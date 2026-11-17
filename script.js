/* =========================================
   0. FUNÇÕES AUXILIARES
   Salvam e leem preferências (tamanho da letra e contraste).
   O try/catch evita erro se o navegador bloquear o armazenamento.
   ========================================= */
const guardar = (chave, valor) => { try { localStorage.setItem(chave, valor); } catch (e) {} };
const ler = (chave) => { try { return localStorage.getItem(chave); } catch (e) { return null; } };

/* =========================================
   1. MENU MOBILE
   ========================================= */
const menuButton = document.querySelector("#menuButton"); // botão ☰
const navLinks = document.querySelector("#navLinks");     // lista de links

menuButton.addEventListener("click", () => {
    // toggle: adiciona a classe "open" se não tem, remove se já tem
    const aberto = navLinks.classList.toggle("open");
    if (aberto) {
        searchPanel.classList.remove("open");
        searchButton.setAttribute("aria-expanded", "false");
    }
    // Informa ao leitor de tela se o menu está aberto
    menuButton.setAttribute("aria-expanded", aberto);
});

/* =========================================
   2. DESTAQUE DO MENU
   ========================================= */
const links = document.querySelectorAll(".nav-links a");

// Ao clicar num link, fecha o menu do celular
links.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

// Destaca o link da seção que está visível enquanto a pessoa rola a página
const secoes = document.querySelectorAll("main section[id]");

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            links.forEach((l) => {
                // O link é o "atual" se o href dele for igual ao id da seção visível
                const atual = l.getAttribute("href") === "#" + entrada.target.id;
                if (atual) l.setAttribute("aria-current", "location");
                else l.removeAttribute("aria-current");
            });
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" }); // considera só a faixa do meio da tela

secoes.forEach((s) => observador.observe(s));

// Fecha o menu ao usar Esc, tocar fora dele ou voltar à tela larga.
// Não altera a pesquisa nem o formulário de denúncia.
const fecharMenu = () => {
    if (!navLinks.classList.contains("open")) return;
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
        fecharMenu();
        menuButton.focus();
    }
});

document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".nav") && navLinks.classList.contains("open")) fecharMenu();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1060) fecharMenu();
});


/* =========================================
   3. SISTEMA DE PESQUISA
   ========================================= */
const searchButton = document.querySelector("#searchButton"); // lupa
const searchPanel = document.querySelector("#searchPanel");   // caixa de pesquisa
const searchInput = document.querySelector("#searchInput");   // campo de texto
const searchStatus = document.querySelector("#searchStatus"); // "3 resultados"
const noResults = document.querySelector("#noResults");       // "Nenhum resultado"

// Só os elementos com a classe "pesquisavel" entram na busca.
// As seções inteiras ficam de fora, para a página nunca ficar em branco.
const itens = document.querySelectorAll(".pesquisavel");

// Abre e fecha o campo ao clicar na lupa
searchButton.addEventListener("click", () => {
    const aberto = searchPanel.classList.toggle("open");
    if (aberto) fecharMenu();
    searchButton.setAttribute("aria-expanded", aberto);
    if (aberto) searchInput.focus(); // já deixa o cursor pronto para digitar
});

// Ignora acentos e maiúsculas: "denuncia" encontra "denúncia"
const normalizar = (texto) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Filtra enquanto a pessoa digita
searchInput.addEventListener("input", () => {
    const termo = normalizar(searchInput.value.trim());
    let encontrados = 0;

    itens.forEach((item) => {
        // Campo vazio mostra tudo; senão, mostra só quem contém o termo
        const combina = termo === "" || normalizar(item.textContent).includes(termo);
        item.hidden = !combina; // hidden = true esconde o elemento
        if (combina) encontrados++;
    });

    // Mostra a mensagem quando nada foi encontrado
    const vazio = termo !== "" && encontrados === 0;
    noResults.hidden = !vazio;

    // Texto lido pelo leitor de tela com o número de resultados
    searchStatus.textContent = termo === "" ? "" :
        vazio ? "Nenhum resultado." :
        encontrados === 1 ? "1 resultado encontrado." : encontrados + " resultados encontrados.";
});

// Tecla Esc fecha a pesquisa e devolve o foco à lupa
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchPanel.classList.remove("open");
        searchButton.setAttribute("aria-expanded", "false");
        searchButton.focus();
    }
});

/* 4. Envio do relato para a área privada do site. */
const reportForm = document.querySelector("#reportForm");
const reportStatus = document.querySelector("#reportStatus");
const reportSubmit = document.querySelector("#reportSubmit");
const reportApi = location.hostname === "yankapa.github.io"
    ? "https://convivencia-sem-bullying-eetepa-2026.albertomaster.chatgpt.site/api/relatos"
    : "/api/relatos";

reportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!reportForm.reportValidity()) return;
    reportSubmit.disabled = true;
    reportStatus.dataset.state = "";
    reportStatus.textContent = "Guardando o relato...";
    const data = new FormData(reportForm);
    try {
        const response = await fetch(reportApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                papel: data.get("papel"),
                local: data.get("local"),
                quando: data.get("quando"),
                descricao: data.get("descricao"),
            }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível enviar o relato.");
        reportForm.reset();
        reportStatus.dataset.state = "success";
        reportStatus.textContent = "Relato guardado. Obrigado por pedir ajuda. Se houver perigo imediato, procure um adulto da escola ou ligue 190.";
    } catch (error) {
        reportStatus.dataset.state = "error";
        reportStatus.textContent = error.message || "Não foi possível enviar o relato. Tente novamente.";
    } finally {
        reportSubmit.disabled = false;
    }
});

/* =========================================
   5. ACESSIBILIDADE: TAMANHO DA LETRA E CONTRASTE
   ========================================= */

// --- Tamanho da letra (em %, de 80 a 200) ---
// Usa o valor salvo da última visita, ou 100 se for a primeira vez
let tamanho = Math.min(200, Math.max(80, parseInt(ler("tamanho"), 10) || 100));

const aplicarTamanho = () => {
    document.documentElement.style.fontSize = tamanho + "%";
    document.body.classList.toggle("large-text", tamanho >= 140);
    guardar("tamanho", tamanho);
};
aplicarTamanho(); // aplica assim que a página abre

document.querySelector("#fontPlus").addEventListener("click", () => {
    tamanho = Math.min(200, tamanho + 10);
    aplicarTamanho();
});
document.querySelector("#fontMinus").addEventListener("click", () => {
    tamanho = Math.max(80, tamanho - 10);  // não passa de 80%
    aplicarTamanho();
});

// --- Alto contraste ---
const contrastBtn = document.querySelector("#contrastBtn");

const aplicarContraste = (ativo) => {
    // Liga ou desliga a classe que troca as cores no CSS
    document.body.classList.toggle("alto-contraste", ativo);
    contrastBtn.setAttribute("aria-pressed", ativo);
    guardar("contraste", ativo ? "1" : "0");
};
aplicarContraste(ler("contraste") === "1"); // lembra a escolha anterior

contrastBtn.addEventListener("click", () => {
    aplicarContraste(!document.body.classList.contains("alto-contraste"));
});

/* Progresso discreto de leitura, respeitando movimento reduzido. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const barra = document.createElement("div");
  barra.className = "barra-progresso";
  barra.setAttribute("aria-hidden", "true");
  document.body.appendChild(barra);

  let pendente = false;
  function atualizar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = total > 0 ? window.scrollY / total : 0;
    barra.style.transform = "scaleX(" + Math.min(Math.max(progresso, 0), 1) + ")";
    pendente = false;
  }
  window.addEventListener("scroll", () => {
    if (!pendente) {
      pendente = true;
      window.requestAnimationFrame(atualizar);
    }
  }, { passive: true });
  atualizar();
})();
