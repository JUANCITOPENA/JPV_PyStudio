// =======================================================
// GUTTER SPLITTER (MOUSE + TOUCH RESPONSIVE)
// =======================================================
const gutter = document.getElementById("drag-gutter");
const container = document.getElementById("split-container");
const panelEditor = document.getElementById("panel-editor");
let isDraggingGutter = false;

function onGutterDragStart(e) {
  isDraggingGutter = true;
  gutter.classList.add("dragging");
  const isVertical = container && container.classList.contains("mobile-split-vertical");
  document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
  if (e.cancelable && e.type !== "touchstart") e.preventDefault();
}

function onGutterDragMove(e) {
  if (!isDraggingGutter) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = container.getBoundingClientRect();
  const isVertical = container && container.classList.contains("mobile-split-vertical");

  if (isVertical) {
    const offset = clientY - rect.top;
    const total = rect.height;
    if (offset >= 60 && offset <= total - 60) {
      panelEditor.style.height = `${(offset / total) * 100}%`;
    }
  } else {
    const offset = clientX - rect.left;
    const total = rect.width;
    if (offset >= 70 && offset <= total - 70) { /* Permite disminuir lo mínimo a ambos lados */
      panelEditor.style.width = `${(offset / total) * 100}%`;
    }
  }
}

function onGutterDragEnd() {
  if (isDraggingGutter) {
    isDraggingGutter = false;
    gutter.classList.remove("dragging");
    document.body.style.cursor = "default";
  }
}

if (gutter) {
  gutter.addEventListener("mousedown", onGutterDragStart);
  window.addEventListener("mousemove", onGutterDragMove);
  window.addEventListener("mouseup", onGutterDragEnd);

  gutter.addEventListener("touchstart", onGutterDragStart, { passive: true });
  window.addEventListener("touchmove", onGutterDragMove, { passive: true });
  window.addEventListener("touchend", onGutterDragEnd);
}

// =======================================================
// MOBILE WORKSPACE VIEW SWITCHER
// =======================================================
let mobileLayoutMode = "tab"; // "tab" o "split"
let activeMobileView = "editor"; // "editor", "terminal", "grafico", "streamlit"

function cambiarVistaMovil(vista) {
  activeMobileView = vista;
  const btns = {
    editor: document.getElementById("btn-mobile-editor"),
    terminal: document.getElementById("btn-mobile-terminal"),
    grafico: document.getElementById("btn-mobile-grafico"),
    streamlit: document.getElementById("btn-mobile-streamlit"),
    documentos: document.getElementById("btn-mobile-documentos")
  };

  Object.values(btns).forEach(b => b && b.classList.remove("active"));
  if (btns[vista]) btns[vista].classList.add("active");

  const splitEl = document.getElementById("split-container");
  if (!splitEl) return;

  if (vista === "editor") {
    splitEl.classList.add("view-editor");
    splitEl.classList.remove("view-output");
  } else {
    splitEl.classList.add("view-output");
    splitEl.classList.remove("view-editor");
    cambiarTab(vista);
  }
}

function toggleLayoutModoMovil() {
  const splitEl = document.getElementById("split-container");
  const iconEl = document.getElementById("icono-layout-mobile");
  if (!splitEl) return;

  if (mobileLayoutMode === "tab") {
    mobileLayoutMode = "split";
    splitEl.classList.remove("mobile-tab-mode", "view-editor", "view-output");
    splitEl.classList.add("mobile-split-vertical");
    if (iconEl) iconEl.className = "bi bi-square text-warning";
    if (panelEditor) panelEditor.style.display = "flex";
    const panelOut = document.getElementById("panel-output");
    if (panelOut) panelOut.style.display = "flex";
  } else {
    mobileLayoutMode = "tab";
    splitEl.classList.remove("mobile-split-vertical");
    splitEl.classList.add("mobile-tab-mode");
    if (iconEl) iconEl.className = "bi bi-layout-split text-info";
    cambiarVistaMovil(activeMobileView);
  }
}

// =======================================================
// PAN & ZOOM GRÁFICO (MOUSE + TOUCH)
// =======================================================
const chartViewport = document.getElementById("tab-grafico");
const dragLayer = document.getElementById("chart-drag-layer");

if (chartViewport && dragLayer) {
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

  chartViewport.addEventListener("touchstart", (e) => {
    if (currentPlotType === "html" || e.touches.length !== 1) return;
    isPanning = true;
    startX = e.touches[0].clientX - panX;
    startY = e.touches[0].clientY - panY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isPanning || !e.touches || e.touches.length !== 1) return;
    panX = e.touches[0].clientX - startX;
    panY = e.touches[0].clientY - startY;
    dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isPanning = false;
  });

  chartViewport.addEventListener("wheel", (e) => {
    if (currentPlotType === "html") return;
    e.preventDefault();
    scaleGrafico = Math.min(Math.max(scaleGrafico + (e.deltaY < 0 ? 0.12 : -0.12), 0.4), 4.0);
    dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
    document.getElementById("grafico-zoom-label").innerText = Math.round(scaleGrafico * 100) + "%";
  }, { passive: false });
}

function resetZoomGrafico() {
  scaleGrafico = 1.0;
  panX = 0;
  panY = 0;
  if (dragLayer) dragLayer.style.transform = "translate(0px, 0px) scale(1)";
  const label = document.getElementById("grafico-zoom-label");
  if (label) label.innerText = "100%";
}

function ajustarZoomGrafico(delta) {
  scaleGrafico = Math.min(Math.max(scaleGrafico + delta, 0.4), 4.0);
  if (dragLayer) dragLayer.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleGrafico})`;
  const label = document.getElementById("grafico-zoom-label");
  if (label) label.innerText = Math.round(scaleGrafico * 100) + "%";
}


function cambiarTab(tab) {
  const btnTerm = document.getElementById("tab-btn-terminal");
  const btnGraf = document.getElementById("tab-btn-grafico");
  const btnStreamlit = document.getElementById("tab-btn-streamlit");
  const btnDoc = document.getElementById("tab-btn-documentos");

  const viewTerm = document.getElementById("tab-terminal-container");
  const viewGraf = document.getElementById("tab-grafico");
  const viewStreamlit = document.getElementById("tab-streamlit");
  const viewDoc = document.getElementById("tab-documentos");

  const dotGraf = document.getElementById("grafico-dot");
  const dotStreamlit = document.getElementById("streamlit-dot");
  const dotDoc = document.getElementById("documentos-dot");
  const mobDotGraf = document.getElementById("mobile-grafico-dot");
  const mobDotStreamlit = document.getElementById("mobile-streamlit-dot");
  
  const toolsTerm = document.getElementById("tools-consola");
  const toolsGraf = document.getElementById("tools-grafico");
  const toolsStreamlit = document.getElementById("tools-streamlit");
  const toolsDoc = document.getElementById("tools-documentos");

  [btnTerm, btnGraf, btnStreamlit, btnDoc].forEach(b => b && b.classList.remove("active"));
  [viewTerm, viewGraf, viewStreamlit, viewDoc].forEach(v => v && v.classList.add("d-none"));
  [toolsTerm, toolsGraf, toolsStreamlit, toolsDoc].forEach(t => t && t.classList.add("d-none"));

  if (tab === 'terminal') {
    if (btnTerm) btnTerm.classList.add("active");
    if (viewTerm) viewTerm.classList.remove("d-none");
    if (toolsTerm) toolsTerm.classList.remove("d-none");
  } else if (tab === 'grafico') {
    if (btnGraf) btnGraf.classList.add("active");
    if (viewGraf) viewGraf.classList.remove("d-none");
    if (toolsGraf) toolsGraf.classList.remove("d-none");
    if (dotGraf) dotGraf.classList.add("d-none");
    if (mobDotGraf) mobDotGraf.classList.add("d-none");
  } else if (tab === 'streamlit') {
    if (btnStreamlit) btnStreamlit.classList.add("active");
    if (viewStreamlit) viewStreamlit.classList.remove("d-none");
    if (toolsStreamlit) toolsStreamlit.classList.remove("d-none");
    if (dotStreamlit) dotStreamlit.classList.add("d-none");
    if (mobDotStreamlit) mobDotStreamlit.classList.add("d-none");
  } else if (tab === 'documentos') {
    if (btnDoc) btnDoc.classList.add("active");
    if (viewDoc) viewDoc.classList.remove("d-none");
    if (toolsDoc) toolsDoc.classList.remove("d-none");
    if (dotDoc) dotDoc.classList.add("d-none");
    if (typeof renderizarDocumentoEnVisor === 'function') {
      renderizarDocumentoEnVisor();
    }
  }

  // Sincronización con barra móvil en resoluciones < 992px
  if (window.innerWidth < 992 && mobileLayoutMode === "tab") {
    const splitEl = document.getElementById("split-container");
    if (splitEl) {
      activeMobileView = tab;
      splitEl.classList.add("view-output");
      splitEl.classList.remove("view-editor");
    }
    const btns = {
      editor: document.getElementById("btn-mobile-editor"),
      terminal: document.getElementById("btn-mobile-terminal"),
      grafico: document.getElementById("btn-mobile-grafico"),
      streamlit: document.getElementById("btn-mobile-streamlit"),
      documentos: document.getElementById("btn-mobile-documentos")
    };
    if (btns.editor) btns.editor.classList.remove("active");
    if (btns.terminal) btns.terminal.classList.remove("active");
    if (btns.grafico) btns.grafico.classList.remove("active");
    if (btns.streamlit) btns.streamlit.classList.remove("active");
    if (btns.documentos) btns.documentos.classList.remove("active");
    if (btns[tab]) btns[tab].classList.add("active");
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
