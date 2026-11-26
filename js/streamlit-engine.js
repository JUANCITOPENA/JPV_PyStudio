// =======================================================
// MOTOR MAESTRO DE STREAMLIT WEBASSEMBLY (STLITE)
// =======================================================
function esCodigoStreamlit(code) {
  return /^\s*(import\s+streamlit|from\s+streamlit)\b/m.test(code);
}

let ultimoStreamlitHTML = "";

async function ejecutarStreamlitApp(code) {
  const tiempoLbl = document.getElementById("tiempo-ejecucion");
  const dotStreamlit = document.getElementById("streamlit-dot");
  const loadingLayer = document.getElementById("streamlit-loading-layer");
  const frame = document.getElementById("streamlit-frame");

  const t0 = performance.now();
  cambiarTab('streamlit');
  if (loadingLayer) loadingLayer.classList.remove("d-none");
  if (frame) frame.classList.add("d-none");

  // 1. Extraer archivos en memoria (VFS) para que Streamlit pueda usarlos con pd.read_csv(...)
  const archivosApp = {};
  try {
    if (pyodideInstance && pyodideInstance.FS) {
      const lista = pyodideInstance.FS.readdir('.');
      for (const item of lista) {
        if (item !== '.' && item !== '..' && !item.startsWith('__')) {
          try {
            const stat = pyodideInstance.FS.stat(item);
            if (pyodideInstance.FS.isFile(stat.mode) && stat.size < 10 * 1024 * 1024) {
              const contenido = pyodideInstance.FS.readFile(item, { encoding: 'utf8' });
              archivosApp[item] = contenido;
            }
          } catch(eStat) {}
        }
      }
    }
  } catch(eFs) {}

  const appExecutableCode = SMART_FALLBACK_PREPEND + "\n" + code;
  archivosApp["srcdoc.py"] = appExecutableCode;
  archivosApp["streamlit_app.py"] = appExecutableCode;

  // Inyección de suite maestra de shims nativos WebAssembly (Bolsa, Clima, Cripto, Cine, FastAPI)
  for (const [fn, content] of Object.entries(WASM_BUILTIN_SHIMS)) {
    archivosApp[fn] = content;
  }

  // 2. Resolver dependencias requeridas para stlite quirúrgicamente (optimizado para velocidad y memoria)
  const reqs = [];
  if (/(pandas|pd\.)/i.test(code)) reqs.push("pandas");
  if (/(numpy|np\.)/i.test(code)) reqs.push("numpy");
  if (/(matplotlib|plt\.)/i.test(code) && !reqs.includes("matplotlib")) reqs.push("matplotlib");
  if (/(seaborn|sns\.)/i.test(code) && !reqs.includes("seaborn")) reqs.push("seaborn");
  if (/(plotly|px\.|go\.)/i.test(code) && !reqs.includes("plotly")) reqs.push("plotly");
  if (/(altair|alt\.)/i.test(code) && !reqs.includes("altair")) reqs.push("altair");
  if (/(scikit-learn|sklearn)/i.test(code) && !reqs.includes("scikit-learn")) reqs.push("scikit-learn");
  if (/(scipy)/i.test(code) && !reqs.includes("scipy")) reqs.push("scipy");
  if (/(openpyxl|\.to_excel|\.read_excel)/i.test(code) && !reqs.includes("openpyxl")) reqs.push("openpyxl");

  // Auto-detector dinámico de imports en código de usuario (excluyendo módulos integrados y shims Wasm)
  const regexImportsSt = /(?:^|\n)\s*(?:import|from)\s+([a-zA-Z0-9_]+)/g;
  const ignorarModsSt = new Set([
    "streamlit", "sys", "os", "math", "time", "datetime", "json", "re", "random", 
    "io", "base64", "typing", "collections", "itertools", "functools", "pathlib", 
    "string", "hashlib", "urllib", "urllib3", "http", "csv", "sqlite3", "ssl",
    "copy", "dataclasses", "enum", "inspect", "logging", "shutil", "tempfile",
    "unittest", "xml", "socket", "threading", "asyncio", "platform", "subprocess",
    "multiprocessing", "pickle", "traceback", "gc", "contextlib", "operator",
    "decimal", "fractions", "numbers", "bisect", "heapq", "yfinance", "curl_cffi",
    "curl-cffi", "pyowm", "weather", "coingecko", "pycoingecko", "cinemagoer", "imdb", "fastapi"
  ]);
  let matchImpSt;
  while ((matchImpSt = regexImportsSt.exec(code)) !== null) {
    const mod = matchImpSt[1];
    if (!ignorarModsSt.has(mod) && !reqs.includes(mod)) {
      reqs.push(mod);
    }
  }

  const filesJson = JSON.stringify(archivosApp);
  const reqsJson = JSON.stringify(reqs);

  // 3. Documento HTML autocontenido de Streamlit WebAssembly
  const cdnCss = "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.73.0/build/stlite.css";
  const cdnJs = "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.73.0/build/stlite.js";

  const stliteDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Streamlit App - JPV PyStudio</title>
  <link rel="stylesheet" href="${cdnCss}" crossorigin="anonymous" />
  <style>
    body { margin: 0; padding: 0; background: #0e1117; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #stlite-loader {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: #0e1117; color: #fafafa; font-family: sans-serif; z-index: 9999;
    }
    .st-spinner {
      width: 40px; height: 40px; border: 3px solid rgba(255,75,75,0.25);
      border-top-color: #ff4b4b; border-radius: 50%; animation: spin 0.8s linear infinite;
      margin-bottom: 14px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="stlite-loader">
    <div class="st-spinner"></div>
    <div style="font-size: 15px; font-weight: 700; color: #ff4b4b;">🎈 Iniciando Streamlit WebAssembly...</div>
    <div style="font-size: 12px; color: #94a3b8; margin-top: 5px;">Renderizando widgets y componentes en tu navegador</div>
  </div>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" crossorigin="anonymous"><` + `/script>
  <script src="${cdnJs}"><` + `/script>
  <script>
    (function() {
      try {
        // Normalizar URL en caso de soporte History API
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", "/");
          }
        } catch(eH) {}

        const appFiles = ${filesJson};
        const appReqs = ${reqsJson};
        stlite.mount({
          requirements: appReqs,
          entrypoint: "srcdoc.py",
          files: appFiles
        }, document.getElementById("root"));

        // Ocultar loader cuando el contenido de Streamlit esté renderizado
        const obsLoader = new MutationObserver(() => {
          const root = document.getElementById("root");
          if (root && (root.querySelector(".stApp") || root.children.length > 0)) {
            const loader = document.getElementById("stlite-loader");
            if (loader) loader.style.display = "none";
            obsLoader.disconnect();
            try {
              window.parent.postMessage({ type: "stlite_ready" }, "*");
            } catch(eP) {}
          }
        });
        obsLoader.observe(document.getElementById("root"), { childList: true, subtree: true });

        // Erradicación de alertas espurias sin sobrecargar el hilo de renderizado
        const limpiarAlertasSrcdoc = () => {
          document.querySelectorAll('[data-testid="stAlert"], [data-testid="stNotification"]').forEach(el => {
            const t = el.textContent || "";
            if (t.includes("Page not found") || t.includes("/srcdoc") || t.includes("srcdoc")) {
              el.remove();
            }
          });
        };
        setTimeout(limpiarAlertasSrcdoc, 1500);
        setTimeout(limpiarAlertasSrcdoc, 3500);
        setTimeout(limpiarAlertasSrcdoc, 7000);

        // Timeout de seguridad en caso de red lenta
        setTimeout(() => {
          const loader = document.getElementById("stlite-loader");
          if (loader) loader.style.display = "none";
          limpiarAlertasSrcdoc();
          try {
            window.parent.postMessage({ type: "stlite_ready" }, "*");
          } catch(eP) {}
        }, 35000);
      } catch(err) {
        const loader = document.getElementById("stlite-loader");
        if (loader) loader.innerHTML = "<div style='color:#ff4b4b; padding:20px; text-align:center;'>❌ Error cargando Streamlit: " + err.message + "</div>";
        try {
          window.parent.postMessage({ type: "stlite_ready" }, "*");
        } catch(eP) {}
      }
    })();
  <` + `/script>
</body>
</html>`;

  ultimoStreamlitHTML = stliteDoc;

  // 4. Inyectar en el iframe (limpiando instancia previa para evitar fugas de memoria Wasm)
  if (frame) {
    frame.srcdoc = "";
    setTimeout(() => {
      frame.srcdoc = stliteDoc;
    }, 25);
    frame.onload = () => {
      if (loadingLayer) loadingLayer.classList.add("d-none");
      frame.classList.remove("d-none");
      try {
        if (frame.contentWindow && !frame.contentWindow.html2canvas && window.html2canvas) {
          frame.contentWindow.html2canvas = window.html2canvas;
        }
      } catch(eH2) {}
    };
  }

  const t1 = performance.now();
  if (tiempoLbl) {
    tiempoLbl.innerText = `Streamlit listo en ${((t1 - t0) / 1000).toFixed(2)}s`;
  }
  if (dotStreamlit) dotStreamlit.classList.remove("d-none");
}

function abrirStreamlitEnPestana() {
  if (!ultimoStreamlitHTML) {
    alert("Ejecuta primero una aplicación Streamlit para abrirla en una pestaña nueva.");
    return;
  }
  const blob = new Blob([ultimoStreamlitHTML], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

function descargarStreamlitHTML() {
  if (!ultimoStreamlitHTML) {
    alert("Ejecuta primero una aplicación Streamlit para descargarla.");
    return;
  }
  const blob = new Blob([ultimoStreamlitHTML], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "streamlit_app_pystudio.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

let ejecutandoStreamlitActivo = false;

window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "stlite_ready") {
    const loadingLayer = document.getElementById("streamlit-loading-layer");
    const frame = document.getElementById("streamlit-frame");
    const btn = document.getElementById("btn-run");
    const spinner = document.getElementById("btn-spinner");
    const icon = document.getElementById("btn-icon");
    const btnMob = document.getElementById("btn-mobile-run");
    const spinnerMob = document.getElementById("btn-mobile-spinner");
    const iconMob = document.getElementById("btn-mobile-icon");
    const tiempoLbl = document.getElementById("tiempo-ejecucion");
    
    if (loadingLayer) loadingLayer.classList.add("d-none");
    if (frame) frame.classList.remove("d-none");
    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.add("d-none");
    if (icon) icon.classList.remove("d-none");
    if (btnMob) btnMob.disabled = false;
    if (spinnerMob) spinnerMob.classList.add("d-none");
    if (iconMob) iconMob.classList.remove("d-none");
    if (tiempoLbl) tiempoLbl.innerText = "Streamlit App Activa";
    ejecutandoStreamlitActivo = false;
  }
});

function recargarStreamlitApp() {
  const code = editor ? editor.value : "";
  if (!code.trim()) return;
  ejecutarStreamlitApp(code);
}

async function ejecutarPython() {
  const btn = document.getElementById("btn-run");
  const spinner = document.getElementById("btn-spinner");
  const icon = document.getElementById("btn-icon");
  const btnMob = document.getElementById("btn-mobile-run");
  const spinnerMob = document.getElementById("btn-mobile-spinner");
  const iconMob = document.getElementById("btn-mobile-icon");
  const dot = document.getElementById("grafico-dot");
  const tiempoLbl = document.getElementById("tiempo-ejecucion");
  const code = editor.value;

  if (!code.trim()) {
    terminal.innerText = "# [Editor vacío]";
    return;
  }

  // Prevenir ejecuciones múltiples simultáneas
  if (ejecutandoStreamlitActivo) return;

  // Interceptor para Streamlit Apps
  if (esCodigoStreamlit(code)) {
    ejecutandoStreamlitActivo = true;
    if (btn) btn.disabled = true;
    if (spinner) spinner.classList.remove("d-none");
    if (icon) icon.classList.add("d-none");
    if (btnMob) btnMob.disabled = true;
    if (spinnerMob) spinnerMob.classList.remove("d-none");
    if (iconMob) iconMob.classList.add("d-none");

    // Conmutar inmediatamente a la vista de Streamlit (Móvil y Escritorio)
    if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
      cambiarVistaMovil("streamlit");
    } else {
      cambiarTab("streamlit");
    }

    try {
      await ejecutarStreamlitApp(code);
    } catch(errSt) {
      console.error("Error ejecutando Streamlit:", errSt);
      alert("Error al inicializar Streamlit: " + errSt.message);
      ejecutandoStreamlitActivo = false;
      if (btn) btn.disabled = false;
      if (spinner) spinner.classList.add("d-none");
      if (icon) icon.classList.remove("d-none");
      if (btnMob) btnMob.disabled = false;
      if (spinnerMob) spinnerMob.classList.add("d-none");
      if (iconMob) iconMob.classList.remove("d-none");
    }

    // Timeout de seguridad para evitar que el botón quede bloqueado
    setTimeout(() => {
      ejecutandoStreamlitActivo = false;
      if (btn) btn.disabled = false;
      if (spinner) spinner.classList.add("d-none");
      if (icon) icon.classList.remove("d-none");
      if (btnMob) btnMob.disabled = false;
      if (spinnerMob) spinnerMob.classList.add("d-none");
      if (iconMob) iconMob.classList.remove("d-none");
    }, 35000);
    return;
  }

  if (!pyodideInstance) return;

  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.remove("d-none");
  if (icon) icon.classList.add("d-none");
  if (btnMob) btnMob.disabled = true;
  if (spinnerMob) spinnerMob.classList.remove("d-none");
  if (iconMob) iconMob.classList.add("d-none");
  terminal.className = "";
  terminal.textContent = "";
  currentPlotB64 = "";
  currentHtmlContent = "";
  btnDlPlot.disabled = true;
  const btnDlHtmlInit = document.getElementById("btn-dl-html");
  if (btnDlHtmlInit) btnDlHtmlInit.classList.add("d-none");

  // En móvil, cambiar a la consola para ver el progreso
  if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
    cambiarVistaMovil("terminal");
  } else {
    cambiarTab("terminal");
  }

  const t0 = performance.now();

  try {
    // Auto-detección y activación previa de librerías conocidas
    await autoResolverDependencias(code);

    // Ejecución con auto-instalador AST nativo en Python
    pyodideInstance.globals.set("__user_code_raw__", code);
    await pyodideInstance.runPythonAsync("await __ejecutar_codigo_usuario(__user_code_raw__)");

    const plotsJson = await pyodideInstance.runPythonAsync("__extraer_plots()");
    try {
      plotsBase64 = JSON.parse(plotsJson);
    } catch(e) {
      plotsBase64 = { tipo: "estatico", transparente: "", blanco: "", negro: "" };
    }

    const t1 = performance.now();
    tiempoLbl.innerText = `Ejecutado en ${((t1 - t0) / 1000).toFixed(2)}s`;

    const infoJson = await pyodideInstance.runPythonAsync("__obtener_datos_descargables()");
    const info = JSON.parse(infoJson);
    if (info.archivos && info.archivos.length > 0) {
      const ult = info.archivos[info.archivos.length - 1];
      estadoCsv.innerHTML = `<i class="bi bi-download"></i> Descargar: <b>${ult}</b>`;
    } else if (info.dfs && info.dfs.length > 0) {
      estadoCsv.innerHTML = `<i class="bi bi-file-earmark-excel"></i> Descargar DataFrame: <b>${info.dfs[info.dfs.length - 1]}</b>`;
    } else {
      estadoCsv.innerHTML = "";
    }

    const btnDl = document.getElementById("btn-dl-plot");
    const btnOpenTab = document.getElementById("btn-open-html-tab");
    const htmlFrame = document.getElementById("html-viz-frame");
    const bgSelectorBox = document.getElementById("contenedor-selector-fondo");
    const zoomBox = document.getElementById("zoom-toolbar-grafico");

    if (plotsBase64 && plotsBase64.tipo === "html" && plotsBase64.html_content) {
      currentPlotType = "html";
      currentHtmlContent = plotsBase64.html_content;
      currentPlotFilename = plotsBase64.html_nombre || "visualizacion_interactiva.html";

      if (currentHtmlBlobUrl) {
        try { URL.revokeObjectURL(currentHtmlBlobUrl); } catch(e) {}
      }
      const htmlBlob = new Blob([currentHtmlContent], { type: "text/html;charset=utf-8" });
      currentHtmlBlobUrl = URL.createObjectURL(htmlBlob);

      dragLayer.classList.add("d-none");
      htmlFrame.classList.remove("d-none");
      htmlFrame.onload = () => {
        aplicarFondoEnIframeHTML(fondoGraficoActual);
        setTimeout(() => aplicarFondoEnIframeHTML(fondoGraficoActual), 180);
        setTimeout(() => aplicarFondoEnIframeHTML(fondoGraficoActual), 500);
      };
      htmlFrame.src = currentHtmlBlobUrl;

      // Mantener siempre visible el selector de fondo (Negro / Blanco / Transparente) para TODAS las modalidades
      if (bgSelectorBox) bgSelectorBox.classList.remove("d-none");
      if (zoomBox) zoomBox.classList.add("d-none");
      if (btnOpenTab) btnOpenTab.classList.remove("d-none");

      dot.classList.remove("d-none");
      btnDl.disabled = false;
      btnDl.innerHTML = `<i class="bi bi-download"></i> Guardar PNG`;
      btnDl.title = `Descargar imagen PNG del gráfico con fondo ${fondoGraficoActual}`;
      const btnDlHtml = document.getElementById("btn-dl-html");
      if (btnDlHtml) btnDlHtml.classList.remove("d-none");
      cambiarFondoGrafico(fondoGraficoActual);
      cambiarTab('grafico');

    } else if (plotsBase64 && plotsBase64.tipo === "gif" && (plotsBase64.gif_b64 || plotsBase64.negro)) {
      currentPlotType = "gif";
      currentPlotFilename = plotsBase64.gif_nombre || "animacion.gif";
      const gifInicial = plotsBase64[fondoGraficoActual] || plotsBase64.negro || plotsBase64.gif_b64;
      currentPlotB64 = gifInicial;

      htmlFrame.classList.add("d-none");
      htmlFrame.src = "about:blank";
      dragLayer.classList.remove("d-none");
      if (bgSelectorBox) bgSelectorBox.classList.remove("d-none");
      if (zoomBox) zoomBox.classList.remove("d-none");
      if (btnOpenTab) btnOpenTab.classList.add("d-none");

      dragLayer.innerHTML = `<img id="rendered-plot" src="data:image/gif;base64,${gifInicial}" alt="Animación GIF" style="border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">`;
      resetZoomGrafico();
      dot.classList.remove("d-none");
      btnDl.disabled = false;
      const btnDlHtmlGif = document.getElementById("btn-dl-html"); if (btnDlHtmlGif) btnDlHtmlGif.classList.add("d-none");
      btnDl.innerHTML = `<i class="bi bi-film"></i> Guardar GIF`;
      btnDl.title = `Descargar animación ${currentPlotFilename} con el fondo elegido`;
      cambiarFondoGrafico(fondoGraficoActual);
      cambiarTab('grafico');

    } else {
      currentPlotType = "png";
      htmlFrame.classList.add("d-none");
      htmlFrame.src = "about:blank";
      dragLayer.classList.remove("d-none");
      if (bgSelectorBox) bgSelectorBox.classList.remove("d-none");
      if (zoomBox) zoomBox.classList.remove("d-none");
      if (btnOpenTab) btnOpenTab.classList.add("d-none");

      const btnDlHtmlPng = document.getElementById("btn-dl-html"); if (btnDlHtmlPng) btnDlHtmlPng.classList.add("d-none");
      btnDl.innerHTML = `<i class="bi bi-download"></i> Guardar PNG`;
      btnDl.title = "Guardar gráfico en PNG con el fondo seleccionado";

      const b64Actual = (plotsBase64 && plotsBase64[fondoGraficoActual]) || (plotsBase64 && (plotsBase64.negro || plotsBase64.blanco || plotsBase64.transparente));

      if (b64Actual && b64Actual.trim() !== "") {
        currentPlotB64 = b64Actual;
        dragLayer.innerHTML = `<img id="rendered-plot" src="data:image/png;base64,${b64Actual}" alt="Gráfico">`;
        resetZoomGrafico();
        dot.classList.remove("d-none");
        btnDl.disabled = false;
        cambiarFondoGrafico(fondoGraficoActual);
      } else {
        dragLayer.innerHTML = `<span class="text-secondary small">No hay gráficos generados.</span>`;
        dot.classList.add("d-none");
        btnDl.disabled = true;
      }
    }

  } catch (err) {
    terminal.className = "";
    const rawMsg = err.message || String(err);
    const diagInfo = parsearTracebackPython(rawMsg, code);
    const diagHTML = generarDiagnosticoEducativo(diagInfo, code, rawMsg);
    terminal.insertAdjacentHTML("beforeend", diagHTML);
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
    cambiarTab('terminal');
  } finally {
    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.add("d-none");
    if (icon) icon.classList.remove("d-none");
    if (btnMob) btnMob.disabled = false;
    if (spinnerMob) spinnerMob.classList.add("d-none");
    if (iconMob) iconMob.classList.remove("d-none");
  }
}
