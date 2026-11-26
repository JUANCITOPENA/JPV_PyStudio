function descargarScriptPython() {
  const code = editor ? editor.value : "";
  if (!code || !code.trim()) {
    alert("El editor está vacío. Escribe o carga un código para descargarlo.");
    return;
  }

  // Nombre sugerido: el que tenga el script actualmente o de la plantilla
  const labelEl = document.getElementById("archivo-actual-label");
  let nombreSugerido = labelEl ? labelEl.innerText.trim() : "script.py";
  if (!nombreSugerido || nombreSugerido === "nuevo_script.py") {
    nombreSugerido = "mi_script.py";
  }

  // Solicitar o confirmar el nombre al usuario
  let nombreArchivo = prompt("Escribe o confirma el nombre con el que deseas descargar el archivo Python (.py):", nombreSugerido);
  if (nombreArchivo === null) {
    // Si cancela, no descarga
    return;
  }

  nombreArchivo = nombreArchivo.trim();
  if (!nombreArchivo) {
    nombreArchivo = nombreSugerido;
  }

  // Asegurar extensión .py
  if (!nombreArchivo.toLowerCase().endsWith(".py")) {
    nombreArchivo += ".py";
  }

  // Actualizar el label visualmente si el usuario puso uno nuevo
  if (labelEl) {
    labelEl.innerText = nombreArchivo;
  }

  // Crear Blob y disparar descarga
  const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =======================================================
// DETECTOR INTELIGENTE DE CÓDIGO & MODOS DE INICIO
// =======================================================
let timerDeteccion = null;

function actualizarDeteccionCodigo() {
  const code = editor.value;
  const badgeDetector = document.getElementById("badge-auto-detector");
  const selectPlantillas = document.getElementById("select-plantillas");
  const labelArchivo = document.getElementById("archivo-actual-label");

  if (!code.trim()) {
    if (badgeDetector) {
      badgeDetector.className = "badge bg-dark border border-warning text-warning fw-semibold";
      badgeDetector.innerHTML = `<i class="bi bi-file-earmark-text text-warning"></i> Lienzo Vacío`;
    }
    if (selectPlantillas) selectPlantillas.value = "";
    if (labelArchivo) labelArchivo.innerText = "nuevo_script.py";
    return;
  }

  let detectados = [];
  let contexto = "custom";

  if (/(folium|AntPath|HeatMap|MarkerCluster)/i.test(code)) {
    detectados.push("Folium Maps");
    contexto = "folium";
  }
  if (/(plotly|px\.|go\.Figure)/i.test(code)) {
    detectados.push("Plotly");
    if (contexto === "custom") contexto = "plotly";
  }
  if (/(networkx|nx\.)/i.test(code)) {
    detectados.push("NetworkX");
    if (contexto === "custom") contexto = "networkx";
  }
  if (/(wordcloud|WordCloud)/i.test(code)) {
    detectados.push("WordCloud");
    if (contexto === "custom") contexto = "wordcloud";
  }
  if (/(altair|alt\.Chart)/i.test(code)) {
    detectados.push("Altair");
  }
  if (/(bokeh)/i.test(code)) {
    detectados.push("Bokeh");
  }
  if (/(pyvis)/i.test(code)) {
    detectados.push("Pyvis");
  }
  if (/(openpyxl|xlsxwriter|\.to_excel|\.read_excel|ExcelWriter)/i.test(code)) {
    detectados.push("Excel");
    if (contexto === "custom") contexto = "excel";
  }
  if (/(seaborn|sns\.)/i.test(code)) {
    detectados.push("Seaborn");
    if (contexto === "custom") contexto = "seaborn";
  }
  if (/(sklearn|LinearRegression|RandomForest|KMeans)/i.test(code)) {
    detectados.push("Scikit-Learn");
    if (contexto === "custom") contexto = "sklearn";
  }
  if (/(animation\.|PillowWriter|FuncAnimation)/i.test(code)) {
    detectados.push("Animación");
    if (contexto === "custom") contexto = "animacion";
  }
  if (/(dashboard_tokens|Empresas y Tokens|tokens_usd)/i.test(code)) {
    detectados.push("💎 Dashboard Dinámico");
    contexto = "dashboard_tokens";
  } else if (/(streamlit|st\.)/i.test(code)) {
    detectados.push("🎈 Streamlit App");
    if (contexto === "custom") contexto = "streamlit";
  }
  if (/(GoogleGenAI|NEXUS AI|agentTools|iniciarChat)/i.test(code)) {
    detectados.push("⚡ Nexus AI Pro (Agente)");
    contexto = "nexus_agent";
  } else if (typeof esCodigoJavaScript === "function" && esCodigoJavaScript(code)) {
    detectados.push("⚡ JavaScript / Wasm (ESM)");
    if (contexto === "custom") contexto = "custom";
  }
  if (/(requests\.|urllib)/i.test(code)) {
    detectados.push("Requests HTTPS");
    if (contexto === "custom") contexto = "requests";
  }
  if (/(scipy|curve_fit)/i.test(code)) {
    detectados.push("Scipy");
    if (contexto === "custom") contexto = "scipy";
  }
  if (/titanic\.csv/i.test(code)) {
    if (contexto === "custom") contexto = "titanic";
  }

  if (detectados.length === 0) {
    if (/pandas/i.test(code)) detectados.push("Pandas");
    if (/numpy/i.test(code)) detectados.push("NumPy");
    if (/matplotlib/i.test(code)) detectados.push("Matplotlib");
  }

  if (badgeDetector) {
    if (detectados.length > 0) {
      badgeDetector.className = "badge bg-dark border border-info text-info";
      badgeDetector.innerHTML = `<i class="bi bi-lightning-charge-fill text-warning"></i> Auto: ${detectados.join(" • ")}`;
    } else {
      badgeDetector.className = "badge bg-dark border border-info text-light fw-semibold";
      badgeDetector.innerHTML = `<i class="bi bi-code-slash text-warning"></i> Python Personalizado`;
    }
  }

  if (selectPlantillas) {
    if (contexto !== "custom" && PLANTILLAS[contexto]) {
      selectPlantillas.value = contexto;
      if (labelArchivo) labelArchivo.innerText = contexto + "_analisis.py";
    } else {
      selectPlantillas.value = "custom";
      if (labelArchivo) labelArchivo.innerText = "mi_analisis.py";
    }
  }

  // Activar botón de ejecución inmediatamente si es JS/Wasm o Streamlit (Wasm autónomo) o Pyodide ya cargó
  const btnRun = document.getElementById("btn-run");
  const btnMobileRun = document.getElementById("btn-mobile-run");
  const esJs = typeof esCodigoJavaScript === "function" && esCodigoJavaScript(code);
  const esSt = typeof esCodigoStreamlit === "function" && esCodigoStreamlit(code);
  if (esJs || esSt) {
    if (btnRun) {
      btnRun.disabled = false;
      btnRun.title = esJs ? "Ejecutar JavaScript & WebAssembly en el navegador" : "Ejecutar Streamlit App (WebAssembly autónomo)";
    }
    if (btnMobileRun) {
      btnMobileRun.disabled = false;
      btnMobileRun.title = esJs ? "Ejecutar JS/Wasm" : "Ejecutar Streamlit App";
    }
  } else if (typeof pyodideInstance !== "undefined" && pyodideInstance) {
    if (btnRun) btnRun.disabled = false;
    if (btnMobileRun) btnMobileRun.disabled = false;
  }
}

editor.addEventListener("input", () => {
  clearTimeout(timerDeteccion);
  timerDeteccion = setTimeout(actualizarDeteccionCodigo, 300);
});

function manejarSeleccionPlantilla(tipo) {
  if (!PLANTILLAS[tipo]) return;

  const codigoActual = editor.value.trim();
  if (codigoActual !== "" && codigoActual !== PLANTILLAS[tipo].trim()) {
    const confirmar = confirm(`Tienes código en el editor.\n\n¿Deseas reemplazarlo con la plantilla '${tipo.toUpperCase()}'?\n(Se borrará el código que tienes actualmente)`);
    if (!confirmar) {
      actualizarDeteccionCodigo();
      return;
    }
  }

  cargarPlantilla(tipo);
  actualizarDeteccionCodigo();
}

function activarLienzoVacio() {
  const codigoActual = editor.value.trim();
  if (codigoActual !== "") {
    if (!confirm("¿Deseas vaciar el editor para comenzar con un lienzo limpio?\n(Podrás pegar tu propio código de inmediato)")) {
      return;
    }
  }
  editor.value = "";
  actualizarContador();
  sincronizarPrism();
  actualizarDeteccionCodigo();
  terminal.textContent = "# ✨ Lienzo limpio preparado.\n# Pega tu código Python con Ctrl+V y pulsa 'Ejecutar'.\n";
  cambiarTab('terminal');
}

function cargarEjemploPractica() {
  const select = document.getElementById("select-plantillas");
  const actual = (select && select.value && select.value !== "custom") ? select.value : "titanic";
  manejarSeleccionPlantilla(actual);
}

function elegirModoInicio(modo) {
  const check = document.getElementById("checkRecordarInicio");
  if (check && check.checked) {
    localStorage.setItem("pystudio_inicio", modo);
  }

  if (modo === "vacio") {
    editor.value = "";
    actualizarContador();
    sincronizarPrism();
    actualizarDeteccionCodigo();
    terminal.textContent = "# ✨ Lienzo vacío listo. Pega tu código Python con Ctrl+V y pulsa 'Ejecutar'.\n";
  } else {
    cargarPlantilla("titanic");
    actualizarDeteccionCodigo();
  }

  const modalEl = document.getElementById('modalBienvenidaInicio');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

// =======================================================
// GESTIÓN DE TEMAS: MODO OSCURO (DEFAULT) Y MODO CLARO (WCAG AAA)
// =======================================================
function aplicarTema(tema) {
  const btn = document.getElementById("btn-toggle-tema");
  const icono = document.getElementById("icono-tema");
  const texto = document.getElementById("texto-tema");

  if (tema === "light") {
    document.body.classList.add("theme-light");
    if (icono) icono.className = "bi bi-moon-stars-fill text-primary";
    if (texto) {
      texto.textContent = "Modo Oscuro";
      texto.className = "text-dark fw-bold";
    }
    if (btn) {
      btn.title = "Cambiar a Modo Oscuro";
      btn.className = "btn btn-sm btn-outline-dark d-flex align-items-center gap-1 py-0 px-2 fw-semibold ms-1";
    }
    localStorage.setItem("pystudio_tema", "light");
  } else {
    document.body.classList.remove("theme-light");
    if (icono) icono.className = "bi bi-sun-fill text-warning";
    if (texto) {
      texto.textContent = "Modo Claro";
      texto.className = "text-light fw-bold";
    }
    if (btn) {
      btn.title = "Cambiar a Modo Claro";
      btn.className = "btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 py-0 px-2 fw-semibold ms-1";
    }
    localStorage.setItem("pystudio_tema", "dark");
  }
}

function toggleModoTema() {
  const esClaro = document.body.classList.contains("theme-light");
  aplicarTema(esClaro ? "dark" : "light");
}

window.addEventListener("DOMContentLoaded", () => {
  // Inicialización del tema: Modo Oscuro por defecto o preferencia guardada
  const temaGuardado = localStorage.getItem("pystudio_tema");
  if (temaGuardado === "light") {
    aplicarTema("light");
  } else {
    aplicarTema("dark");
  }

  const pref = localStorage.getItem("pystudio_inicio");
  if (pref === "vacio") {
    editor.value = "";
  } else if (pref === "practica") {
    // Mantener la plantilla de práctica inicial
  } else {
    // Si es la primera visita, abrir modal de bienvenida
    try {
      const modalBienvenida = new bootstrap.Modal(document.getElementById('modalBienvenidaInicio'));
      modalBienvenida.show();
    } catch(eM) {}
  }

  actualizarContador();
  sincronizarPrism();
  actualizarDeteccionCodigo();
  bootWasm();

  // Inicializar modo responsive si la pantalla es móvil (< 992px)
  if (window.innerWidth < 992) {
    if (typeof cambiarVistaMovil === "function") {
      cambiarVistaMovil("editor");
    }
  }

  // Listener adaptativo para redimensionamiento de ventana
  window.addEventListener("resize", () => {
    const splitEl = document.getElementById("split-container");
    if (!splitEl) return;
    if (window.innerWidth >= 992) {
      splitEl.classList.remove("view-editor", "view-output", "mobile-split-vertical");
      const pEditor = document.getElementById("panel-editor");
      const pOutput = document.getElementById("panel-output");
      if (pEditor) pEditor.style.display = "";
      if (pOutput) pOutput.style.display = "";
    } else {
      if (!splitEl.classList.contains("mobile-split-vertical")) {
        splitEl.classList.add("mobile-tab-mode");
        if (typeof cambiarVistaMovil === "function") {
          cambiarVistaMovil(typeof activeMobileView !== "undefined" ? activeMobileView : "editor");
        }
      }
    }
  });
});
