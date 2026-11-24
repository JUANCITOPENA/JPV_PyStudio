// =======================================================
// DESCARGA: GRÁFICO (PNG) & TABLA (CSV / EXCEL / JSON)
// =======================================================

function construirCSSFondoHTML(modo) {
  const basePlotlyLayout = "html, body { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; } body > div, .plotly-graph-div { height: 100% !important; width: 100% !important; }";
  if (modo === "negro") {
    return `
      ${basePlotlyLayout}
      html, body { background: #080c14 !important; color: #f8fafc !important; }
      .folium-map, .leaflet-container { background: #080c14 !important; }
      .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important; opacity: 1 !important; }
      .bk-root, .vega-embed { background: #080c14 !important; color: #f8fafc !important; }
    `;
  } else if (modo === "blanco") {
    return `
      ${basePlotlyLayout}
      html, body { background: #ffffff !important; color: #0f172a !important; }
      .folium-map, .leaflet-container { background: #ffffff !important; }
      .leaflet-tile-pane { filter: none !important; opacity: 1 !important; }
      .bk-root, .vega-embed { background: #ffffff !important; color: #0f172a !important; }
    `;
  } else {
    return `
      ${basePlotlyLayout}
      html, body { background: transparent !important; color: #ffffff !important; }
      .folium-map, .leaflet-container { background: transparent !important; }
      .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important; opacity: 0.35 !important; }
      .bk-root, .vega-embed { background: transparent !important; color: #ffffff !important; }
    `;
  }
}

function aplicarFondoEnIframeHTML(modo) {
  const htmlFrame = document.getElementById("html-viz-frame");
  if (!htmlFrame || htmlFrame.classList.contains("d-none")) return;

  if (modo === "negro") htmlFrame.style.background = "#080c14";
  else if (modo === "blanco") htmlFrame.style.background = "#ffffff";
  else htmlFrame.style.background = "transparent";

  try {
    const doc = htmlFrame.contentDocument || (htmlFrame.contentWindow && htmlFrame.contentWindow.document);
    const win = htmlFrame.contentWindow;
    if (!doc) return;

    let styleEl = doc.getElementById("jpv-dynamic-bg-style");
    if (!styleEl && doc.head) {
      styleEl = doc.createElement("style");
      styleEl.id = "jpv-dynamic-bg-style";
      doc.head.appendChild(styleEl);
    }
    if (styleEl) {
      styleEl.textContent = construirCSSFondoHTML(modo);
    }

    // Si es un gráfico interactivo de Plotly, actualizar su layout en vivo
    if (win && win.Plotly) {
      const plots = doc.querySelectorAll(".js-plotly-plot");
      plots.forEach(gd => {
        if (modo === "negro") {
          win.Plotly.relayout(gd, {
            paper_bgcolor: "#080c14",
            plot_bgcolor: "#0f172a",
            "font.color": "#f8fafc",
            "title.font.color": "#f8fafc",
            "xaxis.gridcolor": "#1e293b",
            "yaxis.gridcolor": "#1e293b",
            "xaxis.tickfont.color": "#cbd5e1",
            "yaxis.tickfont.color": "#cbd5e1",
            "xaxis.title.font.color": "#f8fafc",
            "yaxis.title.font.color": "#f8fafc",
            "legend.font.color": "#f8fafc"
          });
        } else if (modo === "blanco") {
          win.Plotly.relayout(gd, {
            paper_bgcolor: "#ffffff",
            plot_bgcolor: "#f8fafc",
            "font.color": "#0f172a",
            "title.font.color": "#0f172a",
            "xaxis.gridcolor": "#e2e8f0",
            "yaxis.gridcolor": "#e2e8f0",
            "xaxis.tickfont.color": "#334155",
            "yaxis.tickfont.color": "#334155",
            "xaxis.title.font.color": "#0f172a",
            "yaxis.title.font.color": "#0f172a",
            "legend.font.color": "#0f172a"
          });
        } else {
          win.Plotly.relayout(gd, {
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            "font.color": "#ffffff",
            "title.font.color": "#ffffff",
            "xaxis.gridcolor": "rgba(148,163,184,0.22)",
            "yaxis.gridcolor": "rgba(148,163,184,0.22)",
            "xaxis.tickfont.color": "#f8fafc",
            "yaxis.tickfont.color": "#f8fafc",
            "xaxis.title.font.color": "#ffffff",
            "yaxis.title.font.color": "#ffffff",
            "legend.font.color": "#ffffff"
          });
        }
      });
    }
  } catch (e) {
    console.warn("Aviso al aplicar fondo en iframe:", e);
  }
}

function cambiarFondoGrafico(modo) {
  fondoGraficoActual = modo;
  const select = document.getElementById("select-fondo-grafico");
  if (select && select.value !== modo) select.value = modo;

  const chartViewport = document.getElementById("tab-grafico");
  if (chartViewport) {
    chartViewport.classList.remove("bg-modo-negro", "bg-modo-blanco", "bg-modo-transparente");
    chartViewport.classList.add("bg-modo-" + modo);
  }

  if (currentPlotType === "html") {
    aplicarFondoEnIframeHTML(modo);
    return;
  }

  const imgElement = document.getElementById("rendered-plot");
  if (imgElement && plotsBase64) {
    const b64 = plotsBase64[modo] || plotsBase64.negro || plotsBase64.blanco || plotsBase64.transparente || plotsBase64.gif_b64;
    if (b64) {
      const mime = currentPlotType === "gif" ? "image/gif" : "image/png";
      imgElement.src = `data:${mime};base64,` + b64;
      currentPlotB64 = b64;
    }
  }
}

function obtenerHTMLConFondoActual() {
  if (!currentHtmlContent) return "";
  const css = `<style id="jpv-exported-bg">${construirCSSFondoHTML(fondoGraficoActual)}</style>`;
  if (currentHtmlContent.includes("</head>")) {
    return currentHtmlContent.replace("</head>", css + "</head>");
  }
  return css + currentHtmlContent;
}

function abrirVisualizacionEnPestana() {
  if (!currentHtmlContent) return;
  const htmlExport = obtenerHTMLConFondoActual();
  const blob = new Blob([htmlExport], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

function descargarVisualizacionHTML() {
  if (!currentHtmlContent) {
    alert("No hay visualización HTML interactiva para descargar.");
    return;
  }
  const htmlExport = obtenerHTMLConFondoActual();
  const blob = new Blob([htmlExport], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  const baseName = (currentPlotFilename || "visualizacion_interactiva").replace(/\.html$/i, "");
  enlace.download = `${baseName}_${fondoGraficoActual}.html`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

async function descargarGraficoPNG() {
  const btnDl = document.getElementById("btn-dl-plot");
  const textoOriginal = btnDl ? btnDl.innerHTML : "";

  // 1. Animación GIF
  if (currentPlotType === "gif") {
    const b64Gif = (plotsBase64 && plotsBase64[fondoGraficoActual]) || currentPlotB64 || (plotsBase64 && plotsBase64.gif_b64);
    if (!b64Gif) return;
    const enlace = document.createElement("a");
    enlace.href = "data:image/gif;base64," + b64Gif;
    const baseName = (currentPlotFilename || "animacion_pystudio").replace(/\.gif$/i, "");
    enlace.download = `${baseName}_${fondoGraficoActual}.gif`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    return;
  }

  // 2. Gráfico interactivo HTML (Plotly / Folium / etc.)
  if (currentPlotType === "html") {
    const htmlFrame = document.getElementById("html-viz-frame");
    if (!htmlFrame) return;

    if (btnDl) {
      btnDl.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Generando PNG...`;
      btnDl.disabled = true;
    }

    try {
      const win = htmlFrame.contentWindow;
      const doc = htmlFrame.contentDocument || (win && win.document);
      const fecha = new Date().toISOString().slice(0, 10);

      // 2.A: Si es Plotly interactivo dentro del iframe
      if (win && win.Plotly) {
        const plotEl = doc ? doc.querySelector(".js-plotly-plot") : null;
        if (plotEl) {
          const bgPlot = fondoGraficoActual === "blanco" ? "#ffffff" : (fondoGraficoActual === "transparente" ? "rgba(0,0,0,0)" : "#080c14");
          const imgUrl = await win.Plotly.toImage(plotEl, {
            format: "png",
            scale: 2,
            width: plotEl.offsetWidth || 1200,
            height: plotEl.offsetHeight || 650,
            setBackground: bgPlot
          });
          const enlace = document.createElement("a");
          enlace.href = imgUrl;
          enlace.download = `grafico_plotly_${fondoGraficoActual}_${fecha}.png`;
          document.body.appendChild(enlace);
          enlace.click();
          document.body.removeChild(enlace);
          return;
        }
      }

      // 2.B: Si es Folium u otro contenido HTML (captura HD con html2canvas y pre-rasterizado)
      if (window.html2canvas && doc && doc.body) {
        const bgCanvas = fondoGraficoActual === "blanco" ? "#ffffff" : (fondoGraficoActual === "transparente" ? null : "#080c14");
        let restaurar = () => {};
        if (typeof prepararContenedorParaCaptura === "function") {
          restaurar = await prepararContenedorParaCaptura(doc.body, win);
        }
        let canvas;
        try {
          canvas = await html2canvas(doc.body, {
            backgroundColor: bgCanvas,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
          });
        } finally {
          restaurar();
        }
        const imgUrl = canvas.toDataURL("image/png");
        const enlace = document.createElement("a");
        enlace.href = imgUrl;
        enlace.download = `grafico_html_${fondoGraficoActual}_${fecha}.png`;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        return;
      }
    } catch (e) {
      console.warn("Aviso al capturar HTML a PNG:", e);
      alert("Aviso: no se pudo capturar directamente el PNG del visor interactivo. Descargando archivo HTML...");
      descargarVisualizacionHTML();
    } finally {
      if (btnDl) {
        btnDl.innerHTML = textoOriginal || `<i class="bi bi-download"></i> Guardar PNG`;
        btnDl.disabled = false;
      }
    }
    return;
  }

  // 3. Gráfico estático estándar (Matplotlib / Seaborn / WordCloud / NetworkX)
  const b64 = (plotsBase64 && plotsBase64[fondoGraficoActual]) || currentPlotB64;
  if (!b64) {
    alert("No hay gráfico generado para descargar.");
    return;
  }
  const enlace = document.createElement("a");
  enlace.href = "data:image/png;base64," + b64;
  const fecha = new Date().toISOString().slice(0, 10);
  enlace.download = `grafico_pystudio_${fondoGraficoActual}_${fecha}.png`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

async function descargarTablaCSV() {
  if (!pyodideInstance) return;

  try {
    const infoJson = await pyodideInstance.runPythonAsync("__obtener_datos_descargables()");
    const info = JSON.parse(infoJson);

    if (info.archivos && info.archivos.length > 0) {
      // Descargar el archivo más reciente guardado
      const archivo = info.archivos[info.archivos.length - 1];
      descargarArchivoVFS(archivo);
      return;
    }

    if (info.dfs && info.dfs.length > 0) {
      // Si hay DataFrames activos en memoria
      const nombreDf = info.dfs[info.dfs.length - 1];
      const csvData = await pyodideInstance.runPythonAsync(`__exportar_df_csv('${nombreDf}')`);
      const blob = new Blob(["\uFEFF" + csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `${nombreDf}.csv`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      URL.revokeObjectURL(url);
      return;
    }

    const textoConsola = terminal.textContent.trim();
    if (!textoConsola) {
      alert("No hay tablas ni salidas en consola para descargar.");
      return;
    }
    const blob = new Blob(["\uFEFF" + textoConsola], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "salida_consola.txt";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Error al exportar tabla: " + err.message);
  }
}
