// =======================================================
// MOTOR MAESTRO DE CAPTURA HD Y FIDELIDAD VISUAL V7
// (SOPORTE TOTAL PARA STREAMLIT, PLOTLY, FOLIUM, CANVAS Y SVG)
// =======================================================

// Rasteriza un SVG a PNG en alta resolución garantizando compatibilidad con clip-path
async function rasterizarElementoSVG(svgEl, width, height) {
  try {
    const w = Math.max(Math.round(width || svgEl.clientWidth || 300), 50);
    const h = Math.max(Math.round(height || svgEl.clientHeight || 200), 50);

    const clon = svgEl.cloneNode(true);
    clon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clon.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clon.setAttribute("width", w);
    clon.setAttribute("height", h);

    const xml = new XMLSerializer().serializeToString(clon);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = w * 2;
          c.height = h * 2;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL("image/png"));
        } catch (e) {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch (e) {
    return null;
  }
}

// Pre-renderiza gráficos dinámicos en imágenes temporales si la API nativa está disponible
async function prepararContenedorParaCaptura(docOrEl, win) {
  const targetWin = win || (docOrEl.defaultView || window);
  const targetDoc = targetWin.document || document;
  const root = docOrEl.body || docOrEl;
  const restauraciones = [];

  const plotlyPlots = root.querySelectorAll ? Array.from(root.querySelectorAll(".js-plotly-plot, .stPlotlyChart")) : [];
  for (const plotEl of plotlyPlots) {
    try {
      const w = Math.round(plotEl.clientWidth || plotEl.offsetWidth || 700);
      const h = Math.round(plotEl.clientHeight || plotEl.offsetHeight || 420);
      let dataUrl = null;

      if (targetWin.Plotly && typeof targetWin.Plotly.toImage === "function") {
        try {
          dataUrl = await targetWin.Plotly.toImage(plotEl, {
            format: "png",
            scale: 2,
            width: w,
            height: h
          });
        } catch (eP) {}
      }

      if (dataUrl && dataUrl.length > 100) {
        const img = targetDoc.createElement("img");
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
          img.src = dataUrl;
        });

        if (img.complete && img.naturalWidth > 0) {
          img.style.width = w + "px";
          img.style.height = h + "px";
          img.style.display = "block";
          img.style.objectFit = "contain";
          img.className = "pystudio-capture-replacement";

          const origDisplay = plotEl.style.display;
          plotEl.style.display = "none";
          plotEl.parentNode.insertBefore(img, plotEl);

          restauraciones.push(() => {
            plotEl.style.display = origDisplay;
            if (img.parentNode) img.parentNode.removeChild(img);
          });
        }
      }
    } catch (ePlot) {
      console.warn("Aviso preparando Plotly para captura:", ePlot);
    }
  }

  return () => {
    for (let i = restauraciones.length - 1; i >= 0; i--) {
      try { restauraciones[i](); } catch (eR) {}
    }
  };
}

// Captura fielmente la porción actualmente visible de un iframe (Streamlit / Folium / Plotly)
async function capturarIframeVisible(iframeEl, backgroundColor) {
  if (!iframeEl || !iframeEl.contentDocument || !iframeEl.contentWindow) return null;
  const doc = iframeEl.contentDocument;
  const win = iframeEl.contentWindow;

  let restaurar = () => {};
  if (typeof prepararContenedorParaCaptura === "function") {
    try {
      restaurar = await prepararContenedorParaCaptura(doc.body || doc, win);
    } catch (ePrep) {
      console.warn("Aviso preparando contenedor iframe:", ePrep);
    }
  }

  try {
    if (!win.html2canvas && window.html2canvas) {
      win.html2canvas = window.html2canvas;
    }
    const h2c = win.html2canvas || window.html2canvas;
    if (!h2c) return null;

    const scale = 2;
    const targetNode = doc.body || doc.documentElement;
    const fullCv = await h2c(targetNode, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: backgroundColor || "#0e1117",
      logging: false
    });

    if (!fullCv || fullCv.width === 0 || fullCv.height === 0) return null;

    // Detectar scroll interno (Streamlit usa [data-testid="stAppViewContainer"] o .main)
    const stContainer = doc.querySelector('[data-testid="stAppViewContainer"]') || doc.querySelector(".main") || win;
    const scrollY = stContainer.scrollTop !== undefined ? stContainer.scrollTop : (win.scrollY || win.pageYOffset || 0);
    const scrollX = stContainer.scrollLeft !== undefined ? stContainer.scrollLeft : (win.scrollX || win.pageXOffset || 0);

    const frameW = iframeEl.clientWidth || 800;
    const frameH = iframeEl.clientHeight || 600;

    const visibleCanvas = document.createElement("canvas");
    const vW = Math.round(frameW * scale);
    const vH = Math.round(frameH * scale);
    visibleCanvas.width = vW;
    visibleCanvas.height = vH;
    const vCtx = visibleCanvas.getContext("2d");
    vCtx.fillStyle = backgroundColor || "#0e1117";
    vCtx.fillRect(0, 0, vW, vH);

    let sx = Math.max(0, Math.round(scrollX * scale));
    let sy = Math.max(0, Math.round(scrollY * scale));

    if (fullCv.height <= vH && fullCv.width <= vW) {
      vCtx.drawImage(fullCv, 0, 0, fullCv.width, fullCv.height, 0, 0, fullCv.width, fullCv.height);
    } else {
      if (sy + vH > fullCv.height) {
        sy = Math.max(0, fullCv.height - vH);
      }
      if (sx + vW > fullCv.width) {
        sx = Math.max(0, fullCv.width - vW);
      }
      const sw = Math.min(fullCv.width - sx, vW);
      const sh = Math.min(fullCv.height - sy, vH);
      if (sw > 0 && sh > 0) {
        vCtx.drawImage(fullCv, sx, sy, sw, sh, 0, 0, sw, sh);
      } else {
        vCtx.drawImage(fullCv, 0, 0, Math.min(fullCv.width, vW), Math.min(fullCv.height, vH), 0, 0, Math.min(fullCv.width, vW), Math.min(fullCv.height, vH));
      }
    }

    return visibleCanvas;
  } catch (errIframe) {
    console.warn("Fallo en captura de iframe visible:", errIframe);
    return null;
  } finally {
    try { restaurar(); } catch(e) {}
  }
}

// =======================================================
// CAPTURA DE PANTALLA COMPLETA Y RESULTADOS DE CONSOLA (PNG HD)
// =======================================================
async function capturarPantallaCompletaPNG() {
  const btn = document.getElementById("btn-captura-pantalla");
  const origHTML = btn ? btn.innerHTML : "";

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Capturando...`;
  }

  try {
    if (typeof ocultarAutocomplete === "function") ocultarAutocomplete();

    if (typeof html2canvas !== "function") {
      alert("La librería html2canvas aún se está cargando. Por favor intenta en un segundo.");
      return;
    }

    // 1. Pre-capturar el contenido exacto de Streamlit si está en la pestaña activa
    let subCanvasStreamlit = null;
    let rectStreamlit = null;
    const viewStreamlit = document.getElementById("tab-streamlit");
    const stFrame = document.getElementById("streamlit-frame");

    if (viewStreamlit && !viewStreamlit.classList.contains("d-none")) {
      if (!stFrame || stFrame.classList.contains("d-none") || !stFrame.contentDocument) {
        alert("⚠️ La aplicación de Streamlit aún no se ha ejecutado.\n\nHaz clic en el botón celeste '▶ Ejecutar' abajo en el editor y, una vez que aparezca tu Dashboard en pantalla, pulsa 'Captura Pantalla'.");
        return;
      }
      const stDoc = stFrame.contentDocument;
      const stRoot = stDoc.getElementById("root");
      const stApp = stDoc.querySelector(".stApp");
      if (!stRoot || (!stApp && (!stRoot.children || !stRoot.children.length))) {
        alert("⚠️ Streamlit aún se está cargando en tu navegador.\n\nEspera unos segundos a que termine de renderizarse tu Dashboard y vuelve a pulsar 'Captura Pantalla'.");
        return;
      }

      try {
        rectStreamlit = stFrame.getBoundingClientRect();
        subCanvasStreamlit = await capturarIframeVisible(stFrame, "#0e1117");

        // Fallback directo si capturarIframeVisible devolviera null
        if (!subCanvasStreamlit) {
          const h2c = stFrame.contentWindow.html2canvas || window.html2canvas;
          subCanvasStreamlit = await h2c(stDoc.body || stDoc.documentElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#0e1117",
            logging: false
          });
        }
      } catch (eSt) {
        console.error("Error capturando Streamlit para pantalla completa:", eSt);
      }
    }

    // 2. Pre-capturar el iframe de Gráficos (Plotly / Folium) si está en la pestaña activa
    let subCanvasGrafico = null;
    let rectGrafico = null;
    const viewGraf = document.getElementById("tab-grafico");
    if (viewGraf && !viewGraf.classList.contains("d-none")) {
      const htmlFrame = document.getElementById("html-viz-frame");
      if (htmlFrame && !htmlFrame.classList.contains("d-none") && htmlFrame.contentDocument) {
        try {
          rectGrafico = htmlFrame.getBoundingClientRect();
          subCanvasGrafico = await capturarIframeVisible(htmlFrame, "#ffffff");
        } catch (eH) {
          console.warn("Aviso pre-capturando iframe gráfico:", eH);
        }
      }
    }

    // Restaurar el botón antes de la captura para que en el PNG final NO aparezca "Capturando..."
    if (btn) {
      btn.innerHTML = origHTML;
      btn.disabled = false;
    }

    // 3. Captura directa de toda la pantalla con html2canvas
    const esModoClaro = document.body.classList.contains("theme-light");
    const scale = 2;
    const canvas = await html2canvas(document.body, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: esModoClaro ? "#f1f5f9" : "#06090f",
      logging: false,
      ignoreElements: (el) => el.classList && el.classList.contains("modal-backdrop")
    });

    // 4. Composición directa en Canvas 2D
    // IMPORTANTE: html2canvas deja un transform interno ctx.scale(scale, scale) activo en el canvas context.
    // Para plasmar los píxeles de subCanvas en coordenadas exactas de píxeles sin doble escalado ni desfasajes,
    // debemos resetear la matriz de transformación a la identidad antes de ctx.drawImage().
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    if (subCanvasStreamlit && rectStreamlit) {
      const dx = Math.round((rectStreamlit.left + scrollX) * scale);
      const dy = Math.round((rectStreamlit.top + scrollY) * scale);
      const dw = Math.round(rectStreamlit.width * scale);
      const dh = Math.round(rectStreamlit.height * scale);
      ctx.drawImage(subCanvasStreamlit, 0, 0, subCanvasStreamlit.width, subCanvasStreamlit.height, dx, dy, dw, dh);
    }

    if (subCanvasGrafico && rectGrafico) {
      const dx = Math.round((rectGrafico.left + scrollX) * scale);
      const dy = Math.round((rectGrafico.top + scrollY) * scale);
      const dw = Math.round(rectGrafico.width * scale);
      const dh = Math.round(rectGrafico.height * scale);
      ctx.drawImage(subCanvasGrafico, 0, 0, subCanvasGrafico.width, subCanvasGrafico.height, dx, dy, dw, dh);
    }

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    a.download = `JPV_PyStudio_Pantalla_Completa_${fecha}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error al capturar pantalla completa:", err);
    alert("Hubo un problema al generar la captura: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}

async function capturarConsolaPNG() {
  const termEl = document.getElementById("tab-terminal");
  const container = document.getElementById("tab-terminal-container");
  const btn = document.getElementById("btn-capturar-consola");

  const texto = termEl ? termEl.textContent.trim() : "";
  if (!texto || texto === "# Esperando inicio de WebAssembly..." || texto === "# Esperando inicio...") {
    alert("⚠️ No hay resultados en la consola para capturar. Ejecuta primero un script en Python para ver salidas.");
    return;
  }

  const origHTML = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="width: 12px; height: 12px;"></span>`;
  }

  try {
    if (typeof cambiarTab === "function") cambiarTab('terminal');

    if (typeof html2canvas !== "function") {
      alert("La librería html2canvas aún se está cargando. Por favor intenta en un segundo.");
      return;
    }

    const esModoClaro = document.body.classList.contains("theme-light");

    const clon = container.cloneNode(true);
    clon.style.height = "auto";
    clon.style.maxHeight = "none";
    clon.style.overflow = "visible";
    clon.style.position = "fixed";
    clon.style.left = "-99999px";
    clon.style.top = "0";
    clon.style.width = Math.max(container.clientWidth || 800, 780) + "px";
    clon.style.backgroundColor = esModoClaro ? "#ffffff" : "#090e17";
    clon.style.padding = "20px";
    clon.style.borderRadius = "10px";
    clon.style.border = esModoClaro ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)";
    clon.style.boxShadow = esModoClaro ? "0 10px 30px rgba(0,0,0,0.12)" : "0 10px 30px rgba(0,0,0,0.85)";

    const headerClon = document.createElement("div");
    headerClon.style.display = "flex";
    headerClon.style.justifyContent = "space-between";
    headerClon.style.alignItems = "center";
    headerClon.style.paddingBottom = "12px";
    headerClon.style.marginBottom = "14px";
    headerClon.style.borderBottom = esModoClaro ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)";
    headerClon.style.fontFamily = "'JetBrains Mono', monospace";
    headerClon.style.fontSize = "12px";
    headerClon.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#ff5f56;"></span>
        <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#ffbd2e;"></span>
        <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#27c93f;"></span>
        <span style="color:${esModoClaro ? '#0284c7' : '#00f2fe'}; margin-left:6px; font-weight:600;"><i class="bi bi-terminal"></i> Salida de Consola</span>
      </div>
      <div style="color:#64748b;">JPV PyStudio • Python 3.12</div>
    `;
    clon.insertBefore(headerClon, clon.firstChild);

    document.body.appendChild(clon);

    const canvas = await html2canvas(clon, {
      scale: 2,
      useCORS: true,
      backgroundColor: esModoClaro ? "#f1f5f9" : "#06090f",
      logging: false
    });

    document.body.removeChild(clon);

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    a.download = `JPV_PyStudio_Consola_${fecha}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error al capturar consola:", err);
    alert("Hubo un problema al capturar la consola: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}

async function capturarStreamlitPNG() {
  const frame = document.getElementById("streamlit-frame");
  const btn = document.getElementById("btn-capturar-streamlit");

  if (!frame || frame.classList.contains("d-none") || !frame.contentDocument) {
    alert("⚠️ No hay una aplicación de Streamlit activa para capturar. Ejecuta primero un código con Streamlit.");
    return;
  }

  const doc = frame.contentDocument;
  const root = doc.getElementById("root");
  if (!root || !root.children.length) {
    alert("⚠️ La aplicación de Streamlit aún se está cargando. Espera un momento y vuelve a intentar.");
    return;
  }

  const origHTML = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="width: 12px; height: 12px;"></span>`;
  }

  try {
    const canvas = await capturarIframeVisible(frame, "#0e1117");
    if (!canvas) {
      alert("No se pudo generar la imagen de Streamlit.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    a.download = `JPV_PyStudio_Streamlit_${fecha}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return dataUrl;
  } catch (err) {
    console.error("Error al capturar Streamlit:", err);
    alert("Hubo un detalle al capturar Streamlit: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}

async function descargarSuiteGlobal() {
  const btn = document.getElementById("btn-descargar-suite");
  const origHTML = btn ? btn.innerHTML : "";

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Empaquetando Suite...`;
  }

  try {
    if (typeof JSZip === "undefined") {
      alert("La librería JSZip se está cargando. Por favor intenta en un segundo.");
      return;
    }

    const zip = new JSZip();
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    const nombreCarpeta = `JPV_PyStudio_Suite_${fecha}`;
    const carpeta = zip.folder(nombreCarpeta);

    // Helper para decodificar dataURL base64 y guardarla como binario puro
    const agregarImagenZip = (zipFolder, fileName, dataUrl) => {
      if (!dataUrl) return;
      if (dataUrl.includes(",")) {
        const base64Data = dataUrl.split(",")[1];
        zipFolder.file(fileName, base64Data, { base64: true });
      }
    };

    // 1. Script Python fuente (.py)
    const codigoActual = editor.value;
    carpeta.file("01_script_python.py", codigoActual);

    // 2. Imagen de Código HD (Editor Prism)
    const codeCanvas = await rasterizarCodigoEditorPNG();
    if (codeCanvas) {
      agregarImagenZip(carpeta, "02_Codigo_Python_HD.png", codeCanvas.toDataURL("image/png"));
    }

    // 3. Salida de Terminal / Consola (.txt y .png si hay resultados)
    const salidaTerminal = terminal.textContent;
    carpeta.file("03_salida_terminal.txt", salidaTerminal);
    if (salidaTerminal && salidaTerminal.trim() !== "" && !salidaTerminal.includes("Esperando inicio")) {
      try {
        const termContainer = document.getElementById("tab-terminal-container");
        if (termContainer && typeof html2canvas === "function") {
          const cvTerm = await html2canvas(termContainer, { scale: 2, backgroundColor: "#090e17", logging: false });
          agregarImagenZip(carpeta, "03_Salida_Terminal_HD.png", cvTerm.toDataURL("image/png"));
        }
      } catch (eTerm) {}
    }

    // 4. Gráficos interactivos y estáticos
    const canvasGrafico = document.getElementById("rendered-plot");
    if (canvasGrafico && canvasGrafico.src && canvasGrafico.src.startsWith("data:image/png")) {
      agregarImagenZip(carpeta, "04_Grafico_Renderizado.png", canvasGrafico.src);
    }
    const htmlFrameViz = document.getElementById("html-viz-frame");
    if (htmlFrameViz && !htmlFrameViz.classList.contains("d-none") && htmlFrameViz.contentDocument) {
      try {
        const cvHtml = await capturarIframeVisible(htmlFrameViz, "#ffffff");
        if (cvHtml) {
          agregarImagenZip(carpeta, "04_Grafico_Interactivo_HD.png", cvHtml.toDataURL("image/png"));
        }
      } catch (eG) {}
    }
    if (typeof ultimoGraficoHTML !== "undefined" && ultimoGraficoHTML) {
      carpeta.file("04_Grafico_Interactivo_Autonomo.html", ultimoGraficoHTML);
    }

    // 5. Streamlit App HD (si está activa)
    const stFrame = document.getElementById("streamlit-frame");
    if (stFrame && !stFrame.classList.contains("d-none") && stFrame.contentDocument) {
      try {
        const stCanvas = await capturarIframeVisible(stFrame, "#0e1117");
        if (stCanvas) {
          agregarImagenZip(carpeta, "04_Captura_Streamlit_App_HD.png", stCanvas.toDataURL("image/png"));
        }
      } catch (eStImg) {}
    }
    if (typeof ultimoStreamlitHTML !== "undefined" && ultimoStreamlitHTML) {
      carpeta.file("04_Streamlit_App_Autonoma.html", ultimoStreamlitHTML);
    }

    // 6. Captura de Pantalla Completa del Entorno (Full Viewport)
    try {
      const scale = 2;
      const fullCanvas = await html2canvas(document.body, { scale: scale, backgroundColor: "#06090f", logging: false, useCORS: true, allowTaint: true });
      const ctx = fullCanvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      const htmlFrame = document.getElementById("html-viz-frame");
      if (stFrame && !stFrame.classList.contains("d-none") && stFrame.contentDocument) {
        try {
          const subCanvas = await capturarIframeVisible(stFrame, "#0e1117");
          if (subCanvas) {
            const rect = stFrame.getBoundingClientRect();
            const dx = Math.round((rect.left + scrollX) * scale);
            const dy = Math.round((rect.top + scrollY) * scale);
            const dw = Math.round(rect.width * scale);
            const dh = Math.round(rect.height * scale);
            ctx.drawImage(subCanvas, 0, 0, subCanvas.width, subCanvas.height, dx, dy, dw, dh);
          }
        } catch (eStComp) {}
      } else if (htmlFrame && !htmlFrame.classList.contains("d-none") && htmlFrame.contentDocument) {
        try {
          const subCanvas = await capturarIframeVisible(htmlFrame, "#ffffff");
          if (subCanvas) {
            const rect = htmlFrame.getBoundingClientRect();
            const dx = Math.round((rect.left + scrollX) * scale);
            const dy = Math.round((rect.top + scrollY) * scale);
            const dw = Math.round(rect.width * scale);
            const dh = Math.round(rect.height * scale);
            ctx.drawImage(subCanvas, 0, 0, subCanvas.width, subCanvas.height, dx, dy, dw, dh);
          }
        } catch (eHtmlComp) {}
      } else {
        const imgPlot = document.getElementById("rendered-plot");
        if (imgPlot && imgPlot.src && imgPlot.complete && imgPlot.naturalWidth > 0) {
          try {
            const rect = imgPlot.getBoundingClientRect();
            const dx = Math.round((rect.left + scrollX) * scale);
            const dy = Math.round((rect.top + scrollY) * scale);
            const dw = Math.round(rect.width * scale);
            const dh = Math.round(rect.height * scale);
            ctx.drawImage(imgPlot, 0, 0, imgPlot.naturalWidth, imgPlot.naturalHeight, dx, dy, dw, dh);
          } catch (eP) {}
        }
      }

      agregarImagenZip(carpeta, "00_Pantalla_Completa_PyStudio.png", fullCanvas.toDataURL("image/png"));
    } catch (eFull) {}

    // 7. Generar ZIP y descargar
    const contenidoZip = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(contenidoZip);
    a.download = `JPV_PyStudio_Suite_Completa_${fecha}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error empaquetando suite:", err);
    alert("Hubo un error al empaquetar la suite: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}

// Renderiza el código del editor Prism a una imagen PNG de alta fidelidad
async function rasterizarCodigoEditorPNG() {
  const lineCount = editor.value.split("\n").length;
  const cloneWrapper = document.createElement("div");
  const esModoClaro = document.body.classList.contains("theme-light");

  cloneWrapper.style.position = "fixed";
  cloneWrapper.style.left = "-99999px";
  cloneWrapper.style.top = "0";
  cloneWrapper.style.width = Math.max(editor.clientWidth || 800, 780) + "px";
  cloneWrapper.style.backgroundColor = esModoClaro ? "#ffffff" : "#06090f";
  cloneWrapper.style.padding = "20px";
  cloneWrapper.style.borderRadius = "10px";
  cloneWrapper.style.fontFamily = "'JetBrains Mono', monospace";
  cloneWrapper.style.fontSize = "13px";
  cloneWrapper.style.lineHeight = "1.55";
  cloneWrapper.style.border = esModoClaro ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)";
  cloneWrapper.style.boxShadow = esModoClaro ? "0 10px 30px rgba(0,0,0,0.12)" : "0 10px 30px rgba(0,0,0,0.85)";

  const headerClon = document.createElement("div");
  headerClon.style.display = "flex";
  headerClon.style.justifyContent = "space-between";
  headerClon.style.alignItems = "center";
  headerClon.style.paddingBottom = "12px";
  headerClon.style.marginBottom = "14px";
  headerClon.style.borderBottom = esModoClaro ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)";
  headerClon.style.fontSize = "12px";
  headerClon.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#ff5f56;"></span>
      <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#ffbd2e;"></span>
      <span style="display:inline-block; width:11px; height:11px; border-radius:50%; background:#27c93f;"></span>
      <span style="color:${esModoClaro ? '#0284c7' : '#00f2fe'}; margin-left:6px; font-weight:600;">JPV PyStudio Pro</span>
    </div>
    <div style="color:#64748b;">script_python.py • ${lineCount} líneas</div>
  `;
  cloneWrapper.appendChild(headerClon);

  const innerFlex = document.createElement("div");
  innerFlex.style.display = "flex";

  const numCol = document.createElement("div");
  numCol.style.width = "40px";
  numCol.style.color = "#3b4d66";
  numCol.style.textAlign = "right";
  numCol.style.paddingRight = "14px";
  numCol.style.userSelect = "none";
  numCol.style.fontFamily = "'JetBrains Mono', monospace";
  let numStr = "";
  for (let i = 1; i <= lineCount; i++) numStr += i + "<br>";
  numCol.innerHTML = numStr;
  innerFlex.appendChild(numCol);

  const preCode = document.createElement("pre");
  preCode.style.margin = "0";
  preCode.style.padding = "0";
  preCode.style.flex = "1";
  preCode.style.overflow = "visible";
  preCode.style.whiteSpace = "pre-wrap";
  preCode.style.wordBreak = "break-all";
  preCode.style.fontFamily = "'JetBrains Mono', monospace";

  const codeEl = document.createElement("code");
  codeEl.className = "language-python";
  codeEl.innerHTML = highlightLayer.innerHTML || Prism.highlight(editor.value, Prism.languages.python, 'python');
  preCode.appendChild(codeEl);
  innerFlex.appendChild(preCode);
  cloneWrapper.appendChild(innerFlex);

  document.body.appendChild(cloneWrapper);

  const canvas = await html2canvas(cloneWrapper, {
    scale: 2,
    useCORS: true,
    backgroundColor: esModoClaro ? "#ffffff" : "#06090f",
    logging: false
  });

  document.body.removeChild(cloneWrapper);
  return canvas;
}

async function capturarCodigoPNG() {
  const btn = document.getElementById("btn-capturar-codigo");
  const origHTML = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="width: 12px; height: 12px;"></span>`;
  }
  try {
    const canvas = await rasterizarCodigoEditorPNG();
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    a.download = `JPV_PyStudio_Codigo_${fecha}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error al capturar código:", err);
    alert("Hubo un problema al capturar el código: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}

async function capturarGraficoPNG() {
  const btn = document.getElementById("btn-capturar-grafico");
  const htmlFrame = document.getElementById("html-viz-frame");
  const imgPlot = document.getElementById("rendered-plot");

  const origHTML = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="width: 12px; height: 12px;"></span>`;
  }

  try {
    if (typeof cambiarTab === "function") cambiarTab('grafico');

    let canvas = null;

    if (htmlFrame && !htmlFrame.classList.contains("d-none") && htmlFrame.contentDocument) {
      canvas = await capturarIframeVisible(htmlFrame, "#ffffff");
    } else if (imgPlot && !imgPlot.classList.contains("d-none") && imgPlot.src && imgPlot.src.startsWith("data:image/png")) {
      const a = document.createElement("a");
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
      a.download = `JPV_PyStudio_Grafico_${fecha}.png`;
      a.href = imgPlot.src;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (!canvas) {
      alert("⚠️ No hay ningún gráfico activo para capturar. Ejecuta primero un script de Matplotlib, Seaborn, Plotly o Folium.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    a.download = `JPV_PyStudio_Grafico_${fecha}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error al capturar gráfico:", err);
    alert("Hubo un problema al capturar el gráfico: " + (err.message || err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }
  }
}


// MOTOR MAESTRO DE CAPTURA DEL CÓDIGO EN IMAGEN PNG HD
// =======================================================
let capturaCodigoDataUrl = "";

function abrirModalCapturaCodigo() {
  const code = editor ? editor.value : "";
  if (!code || !code.trim()) {
    alert("El editor está vacío. Escribe o carga un código para capturar su imagen.");
    return;
  }

  const modalEl = document.getElementById("modalCapturaCodigo");
  if (!modalEl) return;

  const numLineas = code.split("\n").length;
  const metaEl = document.getElementById("captura-codigo-meta");
  if (metaEl) {
    const labelArchivo = document.getElementById("archivo-actual-label") ? document.getElementById("archivo-actual-label").innerText : "script.py";
    metaEl.innerText = `${labelArchivo} • ${numLineas} líneas de código • Renderizado HD`;
  }

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();

  setTimeout(() => {
    generarCapturaCodigoImagen();
  }, 250);
}

async function generarCapturaCodigoImagen() {
  const code = editor ? editor.value : "";
  if (!code || !code.trim()) return;

  const loadingEl = document.getElementById("captura-codigo-loading");
  const containerEl = document.getElementById("captura-codigo-preview-container");
  const imgEl = document.getElementById("img-captura-codigo-preview");
  const badgeRes = document.getElementById("captura-resolucion-badge");

  if (loadingEl) loadingEl.classList.remove("d-none");
  if (containerEl) containerEl.classList.add("d-none");

  const tema = document.getElementById("captura-select-tema") ? document.getElementById("captura-select-tema").value : "degradado-neon";
  const conLineas = document.getElementById("captura-check-lineas") ? document.getElementById("captura-check-lineas").checked : true;
  const conMac = document.getElementById("captura-check-mac") ? document.getElementById("captura-check-mac").checked : true;
  const conMarca = document.getElementById("captura-check-marca") ? document.getElementById("captura-check-marca").checked : true;

  const labelArchivo = document.getElementById("archivo-actual-label") ? document.getElementById("archivo-actual-label").innerText : "script.py";
  const lineasArray = code.split("\n");
  const totalLineas = lineasArray.length;

  try {
    if (typeof html2canvas === "function") {
      const renderContainer = document.createElement("div");
      renderContainer.id = "captura-render-temp-container";
      renderContainer.style.position = "fixed";
      renderContainer.style.left = "-99999px";
      renderContainer.style.top = "0";
      renderContainer.style.zIndex = "-9999";
      renderContainer.style.width = "max-content";
      renderContainer.style.boxSizing = "border-box";

      let paddingWrapper = "32px 36px";
      let bgWrapper = "linear-gradient(135deg, #091223 0%, #0f172a 50%, #080c14 100%)";
      if (tema === "degradado-cyan") {
        bgWrapper = "linear-gradient(135deg, #022031 0%, #082f49 50%, #031522 100%)";
      } else if (tema === "oscuro-puro") {
        bgWrapper = "#06090f";
      } else if (tema === "blanco-elegante") {
        bgWrapper = "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)";
      } else if (tema === "transparente") {
        bgWrapper = "transparent";
        paddingWrapper = "0px";
      }

      renderContainer.style.background = bgWrapper;
      renderContainer.style.padding = paddingWrapper;

      const windowCard = document.createElement("div");
      windowCard.style.borderRadius = "12px";
      windowCard.style.overflow = "hidden";
      windowCard.style.backgroundColor = (tema === "blanco-elegante") ? "#ffffff" : "#080c14";
      windowCard.style.border = (tema === "blanco-elegante") ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.12)";
      windowCard.style.boxShadow = "0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255,255,255,0.04)";
      windowCard.style.minWidth = "680px";
      windowCard.style.maxWidth = "1400px";
      windowCard.style.width = "max-content";
      windowCard.style.fontFamily = "'JetBrains Mono', monospace";

      if (conMac) {
        const topBar = document.createElement("div");
        topBar.style.display = "flex";
        topBar.style.alignItems = "center";
        topBar.style.justifyContent = "space-between";
        topBar.style.padding = "12px 18px";
        topBar.style.backgroundColor = (tema === "blanco-elegante") ? "#f1f5f9" : "#0f172a";
        topBar.style.borderBottom = (tema === "blanco-elegante") ? "1px solid #e2e8f0" : "1px solid rgba(255, 255, 255, 0.08)";

        const macDots = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#ff5f56; box-shadow: 0 0 4px rgba(255,95,86,0.4);"></span>
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#ffbd2e; box-shadow: 0 0 4px rgba(255,189,46,0.4);"></span>
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#27c93f; box-shadow: 0 0 4px rgba(39,201,63,0.4);"></span>
          </div>
        `;

        const titleCenter = `
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${tema === 'blanco-elegante' ? '#334155' : '#94a3b8'};"><span style="color: #00f2fe;">🐍</span><span>${labelArchivo}</span></div>
        `;

        const tagRight = `
          <div style="font-size: 11px; color: ${tema === 'blanco-elegante' ? '#64748b' : '#475569'};">Python 3.12 • Pyodide Wasm</div>
        `;

        topBar.innerHTML = `${macDots}${titleCenter}${tagRight}`;
        windowCard.appendChild(topBar);
      }

      const codeBody = document.createElement("div");
      codeBody.style.display = "flex";
      codeBody.style.padding = "16px 0";
      codeBody.style.backgroundColor = (tema === "blanco-elegante") ? "#f8fafc" : "#06090f";
      codeBody.style.overflow = "hidden";

      if (conLineas) {
        const lineasCol = document.createElement("div");
        lineasCol.style.width = totalLineas > 999 ? "56px" : totalLineas > 99 ? "46px" : "38px";
        lineasCol.style.flexShrink = "0";
        lineasCol.style.textAlign = "right";
        lineasCol.style.padding = "0 12px 0 0";
        lineasCol.style.borderRight = (tema === "blanco-elegante") ? "1px solid #e2e8f0" : "1px solid #1e293b";
        lineasCol.style.color = (tema === "blanco-elegante") ? "#94a3b8" : "#3b4d66";
        lineasCol.style.fontSize = "13px";
        lineasCol.style.lineHeight = "1.55";
        lineasCol.style.userSelect = "none";
        
        let lineNums = [];
        for (let i = 1; i <= totalLineas; i++) lineNums.push(i);
        lineasCol.innerHTML = lineNums.join("<br>");
        codeBody.appendChild(lineasCol);
      }

      const codeCol = document.createElement("div");
      codeCol.style.flex = "1";
      codeCol.style.padding = "0 18px";
      codeCol.style.whiteSpace = "pre";
      codeCol.style.fontFamily = "'JetBrains Mono', monospace";
      codeCol.style.fontSize = "13px";
      codeCol.style.lineHeight = "1.55";
      codeCol.style.color = (tema === "blanco-elegante") ? "#0f172a" : "#f8fafc";
      codeCol.style.tabSize = "4";

      let highlighted = "";
      if (typeof Prism !== "undefined" && Prism.languages && Prism.languages.python) {
        highlighted = Prism.highlight(code, Prism.languages.python, "python");
      } else {
        highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      codeCol.innerHTML = `<pre style="margin: 0; background: transparent; padding: 0; font-family: inherit; font-size: inherit; line-height: inherit; white-space: pre !important;"><code class="language-python" style="font-family: inherit; font-size: inherit; line-height: inherit; background: transparent;">${highlighted}</code></pre>`;
      codeBody.appendChild(codeCol);
      windowCard.appendChild(codeBody);

      if (conMarca) {
        const foot = document.createElement("div");
        foot.style.display = "flex";
        foot.style.justifyContent = "space-between";
        foot.style.alignItems = "center";
        foot.style.padding = "8px 18px";
        foot.style.backgroundColor = (tema === "blanco-elegante") ? "#f1f5f9" : "#0a0f1d";
        foot.style.borderTop = (tema === "blanco-elegante") ? "1px solid #e2e8f0" : "1px solid #1e293b";
        foot.style.fontSize = "11px";
        foot.style.color = "#64748b";
        foot.style.fontFamily = "'Outfit', sans-serif";

        const now = new Date();
        const fechaStr = now.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
        foot.innerHTML = `<div><strong style="color: ${tema === 'blanco-elegante' ? '#0f172a' : '#00f2fe'};"><i class="bi bi-lightning-charge"></i> JPV PyStudio Pro</strong> • Ing. Juancito Peña</div><div>${totalLineas} líneas • ${fechaStr}</div>`;
        windowCard.appendChild(foot);
      }

      renderContainer.appendChild(windowCard);
      document.body.appendChild(renderContainer);

      const canvas = await html2canvas(renderContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: (tema === "transparente") ? null : undefined,
        logging: false
      });

      document.body.removeChild(renderContainer);

      capturaCodigoDataUrl = canvas.toDataURL("image/png");

      if (imgEl) imgEl.src = capturaCodigoDataUrl;
      if (badgeRes) {
        badgeRes.innerHTML = `<i class="bi bi-aspect-ratio"></i> ${canvas.width} × ${canvas.height} px • PNG HD (2x)`;
      }

      if (loadingEl) loadingEl.classList.add("d-none");
      if (containerEl) containerEl.classList.remove("d-none");
      return;
    }

    generarCapturaFallbackCanvas(code, { tema, conLineas, conMac, conMarca, labelArchivo, totalLineas });

  } catch (err) {
    console.error("Error renderizando con html2canvas, usando fallback:", err);
    generarCapturaFallbackCanvas(code, { tema, conLineas, conMac, conMarca, labelArchivo, totalLineas });
  }
}

function generarCapturaFallbackCanvas(code, opts) {
  const loadingEl = document.getElementById("captura-codigo-loading");
  const containerEl = document.getElementById("captura-codigo-preview-container");
  const imgEl = document.getElementById("img-captura-codigo-preview");
  const badgeRes = document.getElementById("captura-resolucion-badge");

  const lines = code.split("\n");
  const totalLines = lines.length;
  const lineHeight = 22;
  const paddingX = 40;
  const paddingY = 40;
  const headerHeight = opts.conMac ? 46 : 0;
  const footerHeight = opts.conMarca ? 36 : 0;

  let maxChar = 60;
  for (const l of lines) {
    if (l.length > maxChar) maxChar = l.length;
  }

  const charWidth = 8.8;
  const gutterWidth = opts.conLineas ? 50 : 0;
  const cardWidth = Math.max(700, Math.round(gutterWidth + (maxChar * charWidth) + 60));
  const cardHeight = headerHeight + (totalLines * lineHeight) + 32 + footerHeight;

  const totalWidth = opts.tema === "transparente" ? cardWidth : cardWidth + (paddingX * 2);
  const totalHeight = opts.tema === "transparente" ? cardHeight : cardHeight + (paddingY * 2);

  const canvas = document.createElement("canvas");
  canvas.width = totalWidth * 2;
  canvas.height = totalHeight * 2;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  if (opts.tema !== "transparente") {
    let grad = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
    if (opts.tema === "degradado-cyan") {
      grad.addColorStop(0, "#022031");
      grad.addColorStop(1, "#031522");
    } else if (opts.tema === "oscuro-puro") {
      grad.addColorStop(0, "#06090f");
      grad.addColorStop(1, "#06090f");
    } else if (opts.tema === "blanco-elegante") {
      grad.addColorStop(0, "#e2e8f0");
      grad.addColorStop(1, "#cbd5e1");
    } else {
      grad.addColorStop(0, "#091223");
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#080c14");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
  }

  const ox = opts.tema === "transparente" ? 0 : paddingX;
  const oy = opts.tema === "transparente" ? 0 : paddingY;

  ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#ffffff" : "#080c14";
  ctx.strokeStyle = (opts.tema === "blanco-elegante") ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(ox, oy, cardWidth, cardHeight, 12);
  ctx.fill();
  ctx.stroke();

  let curY = oy;

  if (opts.conMac) {
    ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#f1f5f9" : "#0f172a";
    ctx.beginPath();
    ctx.roundRect(ox, oy, cardWidth, headerHeight, [12, 12, 0, 0]);
    ctx.fill();

    const dotY = oy + 23;
    ctx.fillStyle = "#ff5f56";
    ctx.beginPath(); ctx.arc(ox + 20, dotY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffbd2e";
    ctx.beginPath(); ctx.arc(ox + 38, dotY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#27c93f";
    ctx.beginPath(); ctx.arc(ox + 56, dotY, 6, 0, Math.PI * 2); ctx.fill();

    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#334155" : "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(`🐍 ${opts.labelArchivo}`, ox + (cardWidth / 2), dotY + 4);

    curY += headerHeight;
  }

  curY += 20;
  ctx.font = "13px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";

  lines.forEach((l, idx) => {
    const lineY = curY + (idx * lineHeight);
    if (opts.conLineas) {
      ctx.textAlign = "right";
      ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#94a3b8" : "#3b4d66";
      ctx.fillText(String(idx + 1), ox + gutterWidth - 12, lineY);
    }
    ctx.textAlign = "left";
    if (l.trim().startsWith("#")) {
      ctx.fillStyle = "#6b7280";
    } else {
      ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#0f172a" : "#f8fafc";
    }
    ctx.fillText(l, ox + gutterWidth + 12, lineY);
  });

  if (opts.conMarca) {
    const footY = oy + cardHeight - footerHeight;
    ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#f1f5f9" : "#0a0f1d";
    ctx.beginPath();
    ctx.roundRect(ox, footY, cardWidth, footerHeight, [0, 0, 12, 12]);
    ctx.fill();

    ctx.font = "11px 'Outfit', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = (opts.tema === "blanco-elegante") ? "#0f172a" : "#00f2fe";
    ctx.fillText("JPV PyStudio Pro • Ing. Juancito Peña", ox + 18, footY + 18);

    ctx.textAlign = "right";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`${totalLines} líneas • Python Wasm`, ox + cardWidth - 18, footY + 18);
  }

  capturaCodigoDataUrl = canvas.toDataURL("image/png");
  if (imgEl) imgEl.src = capturaCodigoDataUrl;
  if (badgeRes) {
    badgeRes.innerHTML = `<i class="bi bi-aspect-ratio"></i> ${canvas.width} × ${canvas.height} px • PNG HD (Canvas 2D)`;
  }
  if (loadingEl) loadingEl.classList.add("d-none");
  if (containerEl) containerEl.classList.remove("d-none");
}

function descargarImagenCapturaCodigo() {
  if (!capturaCodigoDataUrl) {
    alert("Primero genera la imagen del código.");
    return;
  }
  const labelArchivo = document.getElementById("archivo-actual-label") ? document.getElementById("archivo-actual-label").innerText.replace(/\.[^/.]+$/, "") : "codigo";
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "_");
  const link = document.createElement("a");
  link.download = `${labelArchivo}_captura_${timestamp}.png`;
  link.href = capturaCodigoDataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function copiarImagenCapturaPortapapeles() {
  if (!capturaCodigoDataUrl) {
    alert("No hay imagen disponible para copiar.");
    return;
  }
  const btn = document.getElementById("btn-copiar-captura");
  try {
    const res = await fetch(capturaCodigoDataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    if (btn) {
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<i class="bi bi-check2-circle text-success"></i> ¡Copiada con éxito!`;
      btn.classList.replace("btn-outline-info", "btn-success");
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.replace("btn-success", "btn-outline-info");
      }, 2500);
    }
  } catch (err) {
    console.error("Error al copiar imagen al portapapeles:", err);
    alert("No se pudo copiar directamente al portapapeles en este navegador. Usa el botón 'Descargar Imagen PNG'.");
  }
}
