/* =========================================
   CONFIGURAÇÃO — A ÚNICA COISA QUE VOCÊ PRECISA EDITAR
   Cole entre as aspas o link do seu Google Forms de denúncia.
   No Forms: desative "Coletar e-mails" e "Exigir login"
   para manter o anonimato.
   Exemplo: const FORMULARIO_URL = "https://forms.gle/abc123";
   ========================================= */
const FORMULARIO_URL = "";

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
    if (window.innerWidth > 760) fecharMenu();
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

/* =========================================
   4. FORMULÁRIO DE DENÚNCIA
   ========================================= */
const reportLink = document.querySelector("#reportLink");       // botão do formulário
const reportSteps = document.querySelector("#reportSteps");
const reportWarning = document.querySelector("#reportWarning");
const heroReportLink = document.querySelector("#heroReportLink");

if (FORMULARIO_URL) {
    // O formulário só aparece quando existe uma URL configurada.
    reportLink.href = FORMULARIO_URL;
    reportLink.hidden = false;
    reportSteps.hidden = false;
    reportWarning.hidden = true;
    heroReportLink.href = "#denuncia";
    heroReportLink.textContent = "Fazer denúncia anônima";
}

/* =========================================
   5. ACESSIBILIDADE: TAMANHO DA LETRA E CONTRASTE
   ========================================= */

// --- Tamanho da letra (em %, de 80 a 200) ---
// Usa o valor salvo da última visita, ou 100 se for a primeira vez
let tamanho = Math.min(200, Math.max(80, parseInt(ler("tamanho"), 10) || 100));

const aplicarTamanho = () => {
    document.documentElement.style.fontSize = tamanho + "%";
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

/* ===== Animação das letras do título (sobem de baixo para cima) ===== */
(function () {
  var h1 = document.getElementById("titulo-hero");
  if (!h1) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Leitores de tela leem o título inteiro, não letra por letra
  h1.setAttribute("aria-label", h1.textContent.trim());

  var contador = 0;

  function dividir(no) {
    Array.from(no.childNodes).forEach(function (filho) {
      if (filho.nodeType === 3) {
        var fragmento = document.createDocumentFragment();
        filho.textContent.split(/(\s+)/).forEach(function (parte) {
          if (!parte) return;
          if (/^\s+$/.test(parte)) {
            fragmento.appendChild(document.createTextNode(" "));
            return;
          }
          var palavra = document.createElement("span");
          palavra.className = "palavra";
          palavra.setAttribute("aria-hidden", "true");
          Array.from(parte).forEach(function (letra) {
            var l = document.createElement("span");
            l.className = "letra";
            l.textContent = letra;
            l.style.animationDelay = 0.1 + 0.04 * contador++ + "s";
            palavra.appendChild(l);
          });
          fragmento.appendChild(palavra);
        });
        no.replaceChild(fragmento, filho);
      } else if (filho.nodeType === 1) {
        dividir(filho); // entra no <em> de "entre nós." e mantém o vermelho
      }
    });
  }

  dividir(h1);
})();















































/* ===== Seções aparecem ao rolar + barra de progresso ===== */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Aparecer ao rolar */
  if ("IntersectionObserver" in window) {
    var alvos = document.querySelectorAll(
      ".section-heading, .info-card, .report-grid > *, .tip, " +
      ".results-panel > *, .contacts li, .help-banner > h2, " +
      ".help-banner > p, .help-banner > .btn"
    );

    // Só esconde os elementos se o JS estiver funcionando
    document.documentElement.classList.add("anima");

    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    alvos.forEach(function (el) {
      var pos = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--atraso", Math.min(pos, 4) * 0.09 + "s");
      el.classList.add("revelar");
      obs.observe(el);
    });
  }

  /* Barra de progresso de leitura no topo */
  var barra = document.createElement("div");
  barra.className = "barra-progresso";
  barra.setAttribute("aria-hidden", "true");
  document.body.appendChild(barra);

  var pendente = false;
  function atualizar() {
    var total = document.documentElement.scrollHeight - innerHeight;
    var p = total > 0 ? scrollY / total : 0;
    barra.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1) + ")";
    pendente = false;
  }
  addEventListener("scroll", function () {
    if (!pendente) {
      pendente = true;
      requestAnimationFrame(atualizar);
    }
  }, { passive: true });
  atualizar();
})();
