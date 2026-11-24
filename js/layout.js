// =======================================================
// GUTTER SPLITTER
// =======================================================
const gutter = document.getElementById("drag-gutter");
const container = document.getElementById("split-container");
const panelEditor = document.getElementById("panel-editor");
let isDraggingGutter = false;

gutter.addEventListener("mousedown", (e) => {
  isDraggingGutter = true;
  gutter.classList.add("dragging");
  document.body.style.cursor = "col-resize";
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (!isDraggingGutter) return;
  const rect = container.getBoundingClientRect();
  const offset = e.clientX - rect.left;
  const total = rect.width;

  if (offset >= 70 && offset <= total - 70) { /* Permite disminuir lo mínimo a ambos lados */
    panelEditor.style.width = `${(offset / total) * 100}%`;
  }
});

window.addEventListener("mouseup", () => {
  if (isDraggingGutter) {
    isDraggingGutter = false;
    gutter.classList.remove("dragging");
    document.body.style.cursor = "default";
  }
});

// =======================================================
// PAN & ZOOM GRÁFICO
// =======================================================
const chartViewport = document.getElementById("tab-grafico");
const dragLayer = document.getElementById("chart-drag-layer");

chartViewport.addEventListener("mousedown", (e) => {
  if (currentPlotType === "html" || e.button !== 0) return;
  isPanning = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  chartViewport.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
});

window.addEventListener("mouseup", () => {
  isPanning = false;
  chartViewport.style.cursor = "grab";
});

chartViewport.addEventListener("wheel", (e) => {
  if (currentPlotType === "html") return;
  e.preventDefault();
  scaleGrafico = Math.min(Math.max(scaleGrafico + (e.deltaY < 0 ? 0.12 : -0.12), 0.4), 4.0);
  dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
  document.getElementById("grafico-zoom-label").innerText = Math.round(scaleGrafico * 100) + "%";
}, { passive: false });

function resetZoomGrafico() {
  scaleGrafico = 1.0;
  panX = 0;
  panY = 0;
  dragLayer.style.transform = "translate(0px, 0px) scale(1)";
  document.getElementById("grafico-zoom-label").innerText = "100%";
}

function ajustarZoomGrafico(delta) {
  scaleGrafico = Math.min(Math.max(scaleGrafico + delta, 0.4), 4.0);
  dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
  document.getElementById("grafico-zoom-label").innerText = Math.round(scaleGrafico * 100) + "%";
}


function cambiarTab(tab) {
  const btnTerm = document.getElementById("tab-btn-terminal");
  const btnGraf = document.getElementById("tab-btn-grafico");
  const btnStreamlit = document.getElementById("tab-btn-streamlit");
  const viewTerm = document.getElementById("tab-terminal-container");
  const viewGraf = document.getElementById("tab-grafico");
  const viewStreamlit = document.getElementById("tab-streamlit");
  const dotGraf = document.getElementById("grafico-dot");
  const dotStreamlit = document.getElementById("streamlit-dot");
  
  const toolsTerm = document.getElementById("tools-consola");
  const toolsGraf = document.getElementById("tools-grafico");
  const toolsStreamlit = document.getElementById("tools-streamlit");

  [btnTerm, btnGraf, btnStreamlit].forEach(b => b && b.classList.remove("active"));
  [viewTerm, viewGraf, viewStreamlit].forEach(v => v && v.classList.add("d-none"));
  [toolsTerm, toolsGraf, toolsStreamlit].forEach(t => t && t.classList.add("d-none"));

  if (tab === 'terminal') {
    if (btnTerm) btnTerm.classList.add("active");
    if (viewTerm) viewTerm.classList.remove("d-none");
    if (toolsTerm) toolsTerm.classList.remove("d-none");
  } else if (tab === 'grafico') {
    if (btnGraf) btnGraf.classList.add("active");
    if (viewGraf) viewGraf.classList.remove("d-none");
    if (toolsGraf) toolsGraf.classList.remove("d-none");
    if (dotGraf) dotGraf.classList.add("d-none");
  } else if (tab === 'streamlit') {
    if (btnStreamlit) btnStreamlit.classList.add("active");
    if (viewStreamlit) viewStreamlit.classList.remove("d-none");
    if (toolsStreamlit) toolsStreamlit.classList.remove("d-none");
    if (dotStreamlit) dotStreamlit.classList.add("d-none");
  }
}

function ajustarZoomEditor(delta) {
  fontSizeEditor = Math.min(Math.max(fontSizeEditor + delta, 10), 26);
  editor.style.fontSize = fontSizeEditor + "px";
  highlightLayer.style.fontSize = fontSizeEditor + "px";
  lineas.style.fontSize = fontSizeEditor + "px";
  document.getElementById("editor-zoom-label").innerText = fontSizeEditor + "px";
}

function resetZoomEditor() {
  fontSizeEditor = 13;
  editor.style.fontSize = "13px";
  highlightLayer.style.fontSize = "13px";
  lineas.style.fontSize = "13px";
  document.getElementById("editor-zoom-label").innerText = "13px";
}

function ajustarZoomConsola(delta) {
  fontSizeConsola = Math.min(Math.max(fontSizeConsola + delta, 10), 26);
  terminal.style.fontSize = fontSizeConsola + "px";
  document.getElementById("consola-zoom-label").innerText = fontSizeConsola + "px";
}

function resetZoomConsola() {
  fontSizeConsola = 12;
  terminal.style.fontSize = "12px";
  document.getElementById("consola-zoom-label").innerText = "12px";
}

function toggleMaximize(panelId) {
  document.getElementById(panelId).classList.toggle("panel-maximized");
}

function limpiarEditor() {
  editor.value = "";
  actualizarContador();
  sincronizarPrism();
  terminal.textContent = "";
}

function limpiarConsola() {
  terminal.textContent = "";
  terminal.className = "";
  estadoCsv.innerHTML = "";
}

function copiarConsola() {
  navigator.clipboard.writeText(terminal.textContent);
}
