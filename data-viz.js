/* Exploração dos dados da PeNSE 2024. O HTML contém todos os valores mesmo sem JS. */
const metricSwitch = document.querySelector("#metricSwitch");
const metricButtons = [...metricSwitch.querySelectorAll("button[data-metric]")];
const metricPanels = [...document.querySelectorAll("[data-metric-panel]")];
const metricAnnouncement = document.querySelector("#metricAnnouncement");

function showMetric(metric, announce = false) {
  for (const button of metricButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.metric === metric));
  }
  for (const panel of metricPanels) {
    panel.hidden = panel.dataset.metricPanel !== metric;
  }
  if (announce) {
    const active = metricPanels.find((panel) => panel.dataset.metricPanel === metric);
    metricAnnouncement.textContent = `Indicador: ${active.querySelector("h3").textContent}.`;
  }
}

metricSwitch.hidden = false;
showMetric("vitimas");
metricSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-metric]");
  if (button) showMetric(button.dataset.metric, true);
});

/* Um ponto por estudante em um grupo hipotético de 1.000. */
const yearControls = document.querySelector("#yearControls");
const yearButtons = [...yearControls.querySelectorAll("button[data-year]")];
const populationCaption = document.querySelector("#populationCaption");
const populationScene = document.querySelector("#populationScene");
const yearCounts = { 2019: 230, 2024: 272 };
let selectedYear = 2024;
let updateScene = null;

function showYear(year) {
  selectedYear = year;
  for (const button of yearButtons) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.year) === year));
  }
  const strong = document.createElement("strong");
  strong.textContent = `${yearCounts[year]} de 1.000`;
  const otherYear = year === 2024 ? 2019 : 2024;
  populationCaption.replaceChildren(
    strong,
    document.createTextNode(` na simulação de ${year}. Em ${otherYear}, seriam ${yearCounts[otherYear]} de 1.000.`)
  );
  updateScene?.(yearCounts[year]);
}

yearControls.hidden = false;
yearControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-year]");
  if (button) showYear(Number(button.dataset.year));
});

/* O motor 3D é carregado apenas quando a visualização entra na página. */
async function createPopulationScene() {
  try {
    const THREE = await import("./assets/vendor/three/three.module.js");
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-22, 22, 14, -14, 0.1, 100);
    camera.position.set(0, 0, 55);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    group.rotation.set(-0.07, -0.08, 0);
    scene.add(group);

    const columns = 40;
    const total = 1000;
    const geometry = new THREE.BoxGeometry(0.77, 0.77, 0.22);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geometry, material, total);
    const tile = new THREE.Object3D();
    const activeColor = new THREE.Color("#f7bb91");
    const inactiveColor = new THREE.Color("#68877e");
    let coloredCount = 0;

    for (let index = 0; index < total; index++) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      tile.position.set((column - 19.5) * 0.98, (12 - row) * 0.98, Math.sin(column * 0.22 + row * 0.3) * 0.2);
      tile.updateMatrix();
      mesh.setMatrixAt(index, tile.matrix);
      mesh.setColorAt(index, inactiveColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    group.add(mesh);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let transition = null;
    let targetRotationX = -0.07;
    let targetRotationY = -0.08;

    function setColoredCount(count) {
      if (count === coloredCount) return;
      const start = Math.min(count, coloredCount);
      const end = Math.max(count, coloredCount);
      for (let index = start; index < end; index++) {
        mesh.setColorAt(index, index < count ? activeColor : inactiveColor);
      }
      coloredCount = count;
      mesh.instanceColor.needsUpdate = true;
    }

    function render() {
      const now = performance.now();
      if (transition) {
        const fraction = Math.min((now - transition.start) / 500, 1);
        const eased = 1 - (1 - fraction) ** 3;
        setColoredCount(Math.round(transition.from + (transition.to - transition.from) * eased));
        if (fraction === 1) transition = null;
      }
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.18;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.18;
      renderer.render(scene, camera);
      const stillTurning = Math.abs(targetRotationX - group.rotation.x) > 0.001 || Math.abs(targetRotationY - group.rotation.y) > 0.001;
      frame = transition || stillTurning ? requestAnimationFrame(render) : 0;
    }

    function requestRender() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function resize() {
      const width = populationScene.clientWidth;
      const height = populationScene.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const spanX = Math.max(43, 27 * aspect);
      camera.left = -spanX / 2;
      camera.right = spanX / 2;
      camera.top = spanX / (2 * aspect);
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      requestRender();
    }

    updateScene = (count) => {
      if (reducedMotion) {
        setColoredCount(count);
      } else {
        transition = { from: coloredCount, to: count, start: performance.now() };
      }
      requestRender();
    };

    populationScene.replaceChildren(renderer.domElement);
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(populationScene);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }
    resize();
    updateScene(yearCounts[selectedYear]);

    if (!reducedMotion) {
      populationScene.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = populationScene.getBoundingClientRect();
        targetRotationY = -0.08 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.22;
        targetRotationX = -0.07 + ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12;
        requestRender();
      });
      populationScene.addEventListener("pointerleave", () => {
        targetRotationX = -0.07;
        targetRotationY = -0.08;
        requestRender();
      });
    }
  } catch (error) {
    const fallback = populationScene.querySelector(".scene-fallback");
    if (fallback) fallback.textContent = "A visualização 3D não está disponível neste navegador. Os gráficos e valores acima continuam acessíveis.";
    console.warn("Visualização 3D indisponível", error);
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      createPopulationScene();
    }
  }, { rootMargin: "200px" });
  observer.observe(populationScene);
} else {
  createPopulationScene();
}
