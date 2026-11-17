/* =========================================================
   DADOS INTERATIVOS — PeNSE 2024 (IBGE)
   Todo número também está escrito no HTML: sem JavaScript
   (ou sem WebGL) a página continua legível.
   ========================================================= */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n, d = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* Executa uma função quando o elemento aparece na tela (uma vez só). */
function whenVisible(el, fn, rootMargin = "0px", threshold = 0.25) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) { fn(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin, threshold });
  io.observe(el);
}

/* Anima um número de "from" até "to". */
function tweenNumber(el, from, to, { decimals = 0, duration = 900, prefix = "" } = {}) {
  if (reducedMotion) { el.textContent = prefix + fmt(to, decimals); return; }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const e = 1 - (1 - t) ** 3;
    el.textContent = prefix + fmt(from + (to - from) * e, decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- 1. Abertura: contador e pictograma ---------- */
document.querySelectorAll("#heroPeople .person").forEach((p, i) => p.style.setProperty("--i", i));
document.querySelectorAll("[data-count-to]").forEach((el) => {
  whenVisible(el, () => tweenNumber(el, 0, Number(el.dataset.countTo), { decimals: Number(el.dataset.decimals || 0), duration: 1600 }));
});

/* =========================================================
   2. HISTÓRIA COM ROLAGEM — 1.000 pontos
   ========================================================= */
const TOTAL = 1000;
const COLORS = {
  dim: "#3d635c", soft: "#8fb3a8", peach: "#f7bb91", hot: "#ff8466", mint: "#a9d4c3", sand: "#f2d98a",
};

/* Cada passo diz: como organizar os pontos e quantos pintar de cada cor.
   Os grupos são acumulativos pela ordem dos pontos (ex.: 230 hortelã e, depois, até 272 coral). */
const STEPS = {
  intro:     { layout: "scatter", groups: [], hud: [1000, "estudantes no grupo"], legend: [] },
  ever:      { layout: "scatter", groups: [[398, "soft"]], hud: [398, "declararam ter sofrido bullying"], legend: [["soft", "Sofreu bullying · 39,8%"]] },
  recurrent: { layout: "scatter", groups: [[272, "peach"], [398, "soft"]], hud: [272, "sofreram bullying repetidas vezes"], legend: [["peach", "Duas ou mais vezes · 27,2%"], ["soft", "Pelo menos uma vez"]] },
  gather:    { layout: "sorted", groups: [[272, "peach"]], hud: [272, "em cada 1.000 — mais de 1 em cada 4"], legend: [["peach", "Bullying recorrente · 27,2%"]] },
  trend:     { layout: "sorted", groups: [[230, "mint"], [272, "hot"]], hud: [42, "a mais do que em 2019"], hudPrefix: "+", legend: [["mint", "2019 · 23,0%"], ["hot", "Aumento até 2024 · +4,2 p.p."]] },
  sex:       { layout: "split", groups: [], split: [151, 122], color: "peach", hud: [151, "em 500 meninas · 122 em 500 meninos"], legend: [["peach", "Bullying recorrente"]],
               labels: ["Meninas · <b>30,1%</b>", "Meninos · <b>24,3%</b>"] },
  social:    { layout: "sorted", groups: [[127, "sand"]], hud: [127, "sofreram bullying nas redes sociais"], legend: [["sand", "Redes sociais · 12,7%"]] },
  practice:  { layout: "sorted", groups: [[137, "hot"]], hud: [137, "declararam ter praticado bullying"], legend: [["hot", "Praticou bullying · 13,7%"]] },
};

/* Ordem "embaralhada" fixa (sempre a mesma), para os pontos parecerem colegas espalhados pela sala. */
function seededShuffle(n, seed) {
  const arr = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
const rankOf = new Array(TOTAL);
seededShuffle(TOTAL, 7).forEach((pointIndex, rank) => { rankOf[pointIndex] = rank; });
const halfRankOf = new Array(TOTAL);
seededShuffle(500, 11).forEach((p, r) => { halfRankOf[p] = r; });
seededShuffle(500, 23).forEach((p, r) => { halfRankOf[500 + p] = r; });

/* Calcula onde cada ponto deve ficar (x, y) e a cor de destino. */
function computeTargets(step, portrait) {
  const pos = new Float32Array(TOTAL * 3);
  const col = new Array(TOTAL);
  const labels = [];
  const grid = (slot, cols, rows, ox = 0, oy = 0) => {
    const c = slot % cols, r = Math.floor(slot / cols);
    return [ox + c - (cols - 1) / 2, oy + (rows - 1) / 2 - r];
  };
  for (let i = 0; i < TOTAL; i++) {
    let x, y, lit = null;
    if (step.layout === "split") {
      const half = i < 500 ? 0 : 1;
      const r = halfRankOf[i];
      if (portrait) [x, y] = grid(r, 25, 20, 0, half === 0 ? 11.5 : -11.5);
      else [x, y] = grid(r, 20, 25, half === 0 ? -11.5 : 11.5, 0);
      if (r < step.split[half]) lit = step.color;
    } else {
      const rank = rankOf[i];
      const slot = step.layout === "sorted" ? rank : i;
      [x, y] = portrait ? grid(slot, 25, 40) : grid(slot, 40, 25);
      for (const [n, c] of step.groups) { if (rank < n) { lit = c; break; } }
    }
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = lit ? 0.55 : 0;
    col[i] = lit || "dim";
  }
  if (step.layout === "split") {
    if (portrait) { labels.push([0, 23.2, step.labels[0]], [0, 0, step.labels[1]]); }
    else { labels.push([-11.5, 14.2, step.labels[0]], [11.5, 14.2, step.labels[1]]); }
  }
  const bounds = step.layout === "split"
    ? (portrait ? { w: 26, h: 48 } : { w: 44, h: 30 })
    : (portrait ? { w: 26, h: 41 } : { w: 41, h: 26 });
  return { pos, col, labels, bounds };
}

/* Motor de animação: guarda posição/cor atuais e interpola até o destino. */
function createEngine() {
  const cur = new Float32Array(TOTAL * 3);
  const from = new Float32Array(TOTAL * 3);
  const to = new Float32Array(TOTAL * 3);
  const cCur = new Float32Array(TOTAL * 3);
  const cFrom = new Float32Array(TOTAL * 3);
  const cTo = new Float32Array(TOTAL * 3);
  const delay = new Float32Array(TOTAL);
  const rgb = {};
  for (const [k, hex] of Object.entries(COLORS)) {
    const v = parseInt(hex.slice(1), 16);
    rgb[k] = [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255];
  }
  let start = 0, running = false, first = true;
  const DUR = 650, SPREAD = 550;

  return {
    cur, cCur,
    setTarget(t) {
      from.set(cur); cFrom.set(cCur);
      for (let i = 0; i < TOTAL; i++) {
        to[i * 3] = t.pos[i * 3]; to[i * 3 + 1] = t.pos[i * 3 + 1]; to[i * 3 + 2] = t.pos[i * 3 + 2];
        const c = rgb[t.col[i]];
        cTo[i * 3] = c[0]; cTo[i * 3 + 1] = c[1]; cTo[i * 3 + 2] = c[2];
        delay[i] = (rankOf[i] / TOTAL) * SPREAD;
      }
      if (first || reducedMotion) { cur.set(to); cCur.set(cTo); first = false; running = false; return; }
      start = performance.now(); running = true;
    },
    /* Retorna true enquanto ainda há movimento. */
    update(now) {
      if (!running) return false;
      let moving = false;
      for (let i = 0; i < TOTAL; i++) {
        let t = (now - start - delay[i]) / DUR;
        if (t < 1) moving = true;
        t = Math.max(0, Math.min(1, t));
        const e = t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          cur[j] = from[j] + (to[j] - from[j]) * e;
          cCur[j] = cFrom[j] + (cTo[j] - cFrom[j]) * Math.min(1, t * 1.6);
        }
      }
      running = moving;
      return true;
    },
  };
}

/* Câmera: enquadra o conteúdo na proporção do palco. */
function fitView(bounds, aspect) {
  const margin = 1.12;
  let w = bounds.w * margin, h = bounds.h * margin;
  if (w / h > aspect) h = w / aspect; else w = h * aspect;
  return { w, h };
}

/* Renderizador 3D com Three.js (InstancedMesh: 1.000 cubos em uma chamada). */
async function createThreeRenderer(container, engine) {
  const THREE = await import("./assets/vendor/three/three.module.js");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  if (!renderer.getContext()) throw new Error("WebGL indisponível");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-20, 20, 13, -13, 0.1, 200);
  camera.position.set(0, 0, 80);
  scene.add(new THREE.AmbientLight(0xffffff, 1.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(-20, 30, 60);
  scene.add(sun);
  const group = new THREE.Group();
  scene.add(group);
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.74, 0.74, 0.5),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    TOTAL
  );
  mesh.setColorAt(0, new THREE.Color());
  group.add(mesh);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  let view = { w: 44, h: 28 }, rotX = -0.12, rotY = 0.18, tX = rotX, tY = rotY;

  container.replaceChildren(renderer.domElement);
  if (!reducedMotion) {
    container.addEventListener("pointermove", (ev) => {
      if (ev.pointerType !== "mouse") return;
      const b = container.getBoundingClientRect();
      tY = 0.18 + ((ev.clientX - b.left) / b.width - 0.5) * 0.5;
      tX = -0.12 + ((ev.clientY - b.top) / b.height - 0.5) * 0.3;
      api.kick();
    });
    container.addEventListener("pointerleave", () => { tX = -0.12; tY = 0.18; api.kick(); });
  }

  const api = {
    kind: "webgl",
    kick: () => {},
    setBounds(bounds) {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      view = fitView(bounds, r.width / r.height);
      camera.left = -view.w / 2; camera.right = view.w / 2;
      camera.top = view.h / 2; camera.bottom = -view.h / 2;
      camera.updateProjectionMatrix();
    },
    toScreen(x, y) {
      const r = container.getBoundingClientRect();
      return [(x / view.w + 0.5) * r.width, (0.5 - y / view.h) * r.height];
    },
    draw() {
      group.rotation.x += (tX - group.rotation.x) * 0.12;
      group.rotation.y += (tY - group.rotation.y) * 0.12;
      for (let i = 0; i < TOTAL; i++) {
        const z = engine.cur[i * 3 + 2];
        dummy.position.set(engine.cur[i * 3], engine.cur[i * 3 + 1], z);
        dummy.scale.set(1, 1, 1 + z * 1.6);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color.setRGB(engine.cCur[i * 3], engine.cCur[i * 3 + 1], engine.cCur[i * 3 + 2], THREE.SRGBColorSpace);
        mesh.setColorAt(i, color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;
      renderer.render(scene, camera);
      return Math.abs(tX - group.rotation.x) > 0.0005 || Math.abs(tY - group.rotation.y) > 0.0005;
    },
  };
  return api;
}

/* Alternativa em 2D (canvas comum) caso o WebGL não esteja disponível. */
function createCanvasRenderer(container, engine) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  container.replaceChildren(canvas);
  let view = { w: 44, h: 28 }, W = 1, H = 1, dpr = 1;
  return {
    kind: "2d",
    kick: () => {},
    setBounds(bounds) {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      view = fitView(bounds, W / H);
    },
    toScreen(x, y) { return [(x / view.w + 0.5) * W, (0.5 - y / view.h) * H]; },
    draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const s = W / view.w;
      const size = s * 0.74;
      for (let i = 0; i < TOTAL; i++) {
        const [sx, sy] = this.toScreen(engine.cur[i * 3], engine.cur[i * 3 + 1]);
        const c = engine.cCur;
        ctx.fillStyle = `rgb(${c[i * 3] * 255 | 0},${c[i * 3 + 1] * 255 | 0},${c[i * 3 + 2] * 255 | 0})`;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
      return false;
    },
  };
}

function initStory() {
  const container = document.querySelector("#storyCanvas");
  const stage = document.querySelector(".story-stage");
  const steps = [...document.querySelectorAll(".story-step")];
  const hudCount = document.querySelector("#storyCount");
  const hudText = document.querySelector("#storyHudText");
  const legend = document.querySelector("#storyLegend");
  const labelsBox = document.querySelector("#storyLabels");
  if (!container || !steps.length) return;

  const engine = createEngine();
  let renderer = null, current = "intro", targets = null, frame = 0, lastHud = 1000;
  const isPortrait = () => { const r = stage.getBoundingClientRect(); return r.width / Math.max(r.height, 1) < 0.95; };

  function placeLabels() {
    labelsBox.replaceChildren();
    if (!renderer || !targets) return;
    for (const [x, y, html] of targets.labels) {
      const el = document.createElement("span");
      el.className = "story-label";
      el.innerHTML = html;
      const [sx, sy] = renderer.toScreen(x, y);
      el.style.left = sx + "px"; el.style.top = sy + "px";
      labelsBox.append(el);
      requestAnimationFrame(() => el.classList.add("is-on"));
    }
  }

  function loop(now) {
    const moving = engine.update(now);
    const turning = renderer.draw();
    frame = moving || turning ? requestAnimationFrame(loop) : 0;
  }
  function kick() { if (renderer && !frame) frame = requestAnimationFrame(loop); }

  function apply(name, force = false) {
    if (name === current && !force) return;
    current = name;
    const step = STEPS[name];
    targets = computeTargets(step, isPortrait());
    engine.setTarget(targets);
    if (renderer) { renderer.setBounds(targets.bounds); placeLabels(); kick(); }
    const [n, text] = step.hud;
    tweenNumber(hudCount, name === "trend" ? 0 : lastHud, n, { duration: 700, prefix: step.hudPrefix || "" });
    lastHud = n;
    hudText.textContent = text;
    legend.replaceChildren(...step.legend.map(([c, label]) => {
      const li = document.createElement("li");
      li.innerHTML = `<i style="--c:${COLORS[c]}"></i>${label}`;
      return li;
    }));
  }

  /* Passo ativo: o que cruza a faixa central da tela. */
  const setActive = (el) => {
    steps.forEach((s) => s.classList.toggle("is-active", s === el));
    apply(el.dataset.step);
  };
  steps[0].classList.add("is-active");
  /* No celular a visualização fica no alto; o passo ativo é o cartão que passa na parte de baixo da tela. */
  const narrow = window.matchMedia("(max-width: 1099px)").matches || document.body.classList.contains("large-text");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.closest(".story-step")); });
  }, { rootMargin: narrow ? "-68% 0px -18% 0px" : "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s.querySelector(".step-card") || s));

  async function start() {
    try { renderer = await createThreeRenderer(container, engine); }
    catch (err) { console.warn("WebGL indisponível; usando 2D.", err); renderer = createCanvasRenderer(container, engine); }
    stage.dataset.renderer = renderer.kind;
    renderer.kick = kick;
    apply(current, true);
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => apply(current, true), 120);
    };
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(container);
    else window.addEventListener("resize", onResize, { passive: true });
  }
  whenVisible(document.querySelector("#dados"), start, "600px", 0);
  apply("intro", true);
}
initStory();

/* =========================================================
   3. SIMULADOR DA TURMA
   ========================================================= */
(function initSimulator() {
  const range = document.querySelector("#classSize");
  const out = document.querySelector("#classSizeOut");
  const room = document.querySelector("#classroom");
  const sentence = document.querySelector("#simSentence");
  const buttons = [...document.querySelectorAll("#simControls [data-rate]")];
  if (!range || !room) return;
  const MAX = Number(range.max);
  const seatOrder = seededShuffle(MAX, 5);
  const seats = Array.from({ length: MAX }, () => {
    const s = document.createElement("span");
    s.className = "person";
    room.append(s);
    return s;
  });
  let active = buttons.find((b) => b.getAttribute("aria-pressed") === "true") || buttons[0];

  function render() {
    const n = Number(range.value);
    const rate = Number(active.dataset.rate);
    const k = Math.round(n * rate / 100);
    out.textContent = n;
    const chosen = new Set(seatOrder.filter((s) => s < n).slice(0, k));
    seats.forEach((seat, i) => {
      seat.hidden = i >= n;
      seat.style.setProperty("--d", reducedMotion ? "0ms" : `${(i % 9) * 25}ms`);
      seat.classList.toggle("is-hit", chosen.has(i));
    });
    const oneIn = Math.round(100 / rate);
    sentence.innerHTML = `Em uma turma de <strong>${n}</strong> pessoas, cerca de <strong class="sim-big">${k}</strong> ${active.dataset.label}. Algo como <strong>1 em cada ${oneIn}</strong>.`;
  }
  range.addEventListener("input", render);
  buttons.forEach((b) => b.addEventListener("click", () => {
    active = b;
    buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));
  render();
})();

/* =========================================================
   4. RECORTES — troca de indicador com barras animadas
   ========================================================= */
(function initMetrics() {
  const metricSwitch = document.querySelector("#metricSwitch");
  if (!metricSwitch) return;
  const metricButtons = [...metricSwitch.querySelectorAll("button[data-metric]")];
  const metricPanels = [...document.querySelectorAll("[data-metric-panel]")];
  const announcement = document.querySelector("#metricAnnouncement");
  let seen = false;

  function showMetric(metric, announce = false) {
    metricButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.metric === metric)));
    metricPanels.forEach((p) => {
      const on = p.dataset.metricPanel === metric;
      p.hidden = !on;
      p.classList.remove("is-shown");
      if (on && seen) requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("is-shown")));
    });
    if (announce) {
      const active = metricPanels.find((p) => p.dataset.metricPanel === metric);
      announcement.textContent = `Indicador: ${active.querySelector("h3").textContent}.`;
    }
  }
  metricSwitch.hidden = false;
  showMetric("vitimas");
  metricSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-metric]");
    if (button) showMetric(button.dataset.metric, true);
  });
  whenVisible(document.querySelector(".metric-panels"), () => {
    seen = true;
    metricPanels.filter((p) => !p.hidden).forEach((p) => p.classList.add("is-shown"));
  });
})();

/* =========================================================
   5. MOTIVOS — barras selecionáveis com explicação
   ========================================================= */
(function initReasons() {
  const section = document.querySelector("#motivos");
  const bars = [...document.querySelectorAll("#reasonBars .reason")];
  const notes = [...document.querySelectorAll(".reason-note")];
  if (!section || !bars.length) return;
  function select(key) {
    bars.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.note === key)));
    notes.forEach((n) => n.classList.toggle("is-on", n.dataset.notePanel === key));
  }
  bars.forEach((b) => {
    b.addEventListener("click", () => select(b.dataset.note));
    b.addEventListener("mouseenter", () => select(b.dataset.note));
  });
  select("rosto");
  whenVisible(section, () => section.classList.add("is-visible"));
})();
