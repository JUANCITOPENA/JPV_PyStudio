// =====================================================================
// MOTOR VISOR MAESTRO DE TALLERES & BLOC DE NOTAS PRO (DATAIADEV)
// Proyecto: JPV_PyStudio • Autor: Ing. Juancito Peña Vizcaíno
// Soporte Dual: Vista Técnica Enriquecida + Vista Bloc de Notas (Raw TXT)
// =====================================================================

// Mapa oficial de la Trilogía en PDF (ReportLab 300 DPI) para compatibilidad y descarga
const MAPA_PDFS_COMPILADOS = {
  libro_maestro_python: {
    url: "pdf/01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf",
    nombre: "01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf",
    paginas: "15 páginas",
    peso: "37 KB",
    volumen: "Volumen 1 de 3",
    tituloCorto: "Fundamentos, POO, SQL Server e IA"
  },
  libro_python_maestro: {
    url: "pdf/01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf",
    nombre: "01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf",
    paginas: "15 páginas",
    peso: "37 KB",
    volumen: "Volumen 1 de 3",
    tituloCorto: "Fundamentos, POO, SQL Server e IA"
  },
  taller_mapas_calor: {
    url: "pdf/02_LIBRO_ANALISIS_DATOS_GRAFICOS_SEABORN_MATPLOTLIB_PRO.pdf",
    nombre: "02_LIBRO_ANALISIS_DATOS_GRAFICOS_SEABORN_MATPLOTLIB_PRO.pdf",
    paginas: "10 páginas",
    peso: "1.7 MB",
    volumen: "Volumen 2 de 3",
    tituloCorto: "Analítica Visual, Seaborn, Matplotlib & ML"
  },
  taller_apis_publicas: {
    url: "pdf/03_LIBRO_CONSUMO_APIS_PUBLICAS_PYTHON_SIN_KEY_PRO.pdf",
    nombre: "03_LIBRO_CONSUMO_APIS_PUBLICAS_PYTHON_SIN_KEY_PRO.pdf",
    paginas: "6 páginas",
    peso: "330 KB",
    volumen: "Volumen 3 de 3",
    tituloCorto: "Consumo Profesional de APIs sin Key"
  }
};

let docActivoId = "libro_maestro_python";
let docZoomActual = 1.0;
let modoVistaDoc = "enriquecida"; // 'enriquecida' o 'raw_txt'

function cambiarDocumentoActivo(nuevoId) {
  const normalizado = nuevoId === "libro_python_maestro" ? "libro_maestro_python" : nuevoId;
  if (typeof BIBLIOTECA_DOCUMENTOS !== "undefined" && BIBLIOTECA_DOCUMENTOS[normalizado]) {
    docActivoId = normalizado;
    renderizarDocumentoEnVisor();
    
    // Sincronizar selectores si existen en varios lugares
    const selTab = document.getElementById("select-doc-activo");
    const selModal = document.getElementById("select-doc-modal");
    if (selTab && selTab.value !== normalizado) selTab.value = normalizado;
    if (selModal && selModal.value !== normalizado) selModal.value = normalizado;
  }
}

function alternarModoVistaDoc(nuevoModo) {
  modoVistaDoc = nuevoModo || (modoVistaDoc === "enriquecida" ? "raw_txt" : "enriquecida");
  renderizarDocumentoEnVisor();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
}

// Descarga directa del archivo de texto plano original (.txt)
function descargarArchivoTxt(idOpcional) {
  const id = idOpcional || docActivoId;
  const normalizado = id === "libro_python_maestro" ? "libro_maestro_python" : id;
  const doc = BIBLIOTECA_DOCUMENTOS[normalizado];
  const rawText = (typeof TALLERES_TXT_RAW !== "undefined" && TALLERES_TXT_RAW[normalizado])
    ? TALLERES_TXT_RAW[normalizado]
    : "";
  if (!rawText) return;

  const nombreArchivo = (doc && doc.archivoTxt) ? doc.archivoTxt : `${normalizado}.txt`;
  const blob = new Blob([rawText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Inyectar código directamente en el editor PyStudio y conmutar
window.cargarCodigoEnEditor = function(codigo, titulo) {
  if (typeof editor !== "undefined") {
    editor.value = codigo;
    if (typeof actualizarContador === "function") actualizarContador();
    if (typeof sincronizarPrism === "function") sincronizarPrism();
    if (typeof actualizarDeteccionCodigo === "function") actualizarDeteccionCodigo();

    if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
      cambiarVistaMovil("editor");
    }

    // Feedback visual en la terminal
    const term = document.getElementById("tab-terminal");
    if (term) {
      term.textContent = `# 🚀 [PyStudio] Código cargado con éxito desde el Taller: ${titulo || 'Script'}\n# 💡 Pulsa 'Ejecutar' o Ctrl+Enter para correrlo en WebAssembly.\n\n` + term.textContent;
    }

    // Cambiar vista al editor si se desea
    if (typeof cambiarTab === "function") {
      cambiarTab("terminal");
    }

    // Notificación flotante suave
    mostrarNotificacionFlotante(`⚡ Código de "${titulo || 'Taller'}" cargado en el editor. ¡Listo para ejecutar!`);
  }
};

window.copiarCodigoDoc = function(btn) {
  const wrapper = btn.closest(".doc-codigo-wrapper") || btn.closest(".doc-card-codigo");
  const codeEl = wrapper ? wrapper.querySelector("code") : null;
  if (!codeEl) return;

  const texto = codeEl.innerText;
  navigator.clipboard.writeText(texto).then(() => {
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check2"></i> ¡Copiado!`;
    btn.classList.add("btn-success");
    btn.classList.remove("btn-outline-light", "btn-outline-warning");
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove("btn-success");
      btn.classList.add("btn-outline-light");
    }, 2000);
  });
};

window.inyectarCodigoDoc = function(btn) {
  const wrapper = btn.closest(".doc-codigo-wrapper") || btn.closest(".doc-card-codigo");
  const codeEl = wrapper ? wrapper.querySelector("code") : null;
  if (!codeEl) return;
  window.cargarCodigoEnEditor(codeEl.innerText, "Script del Taller");
};

function mostrarNotificacionFlotante(msg) {
  let toast = document.getElementById("toast-pystudio-doc");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-pystudio-doc";
    toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 99999; background: #0f172a; color: #38bdf8; border: 2px solid #38bdf8; padding: 12px 18px; border-radius: 8px; font-weight: bold; font-size: 13px; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: opacity 0.3s ease; pointer-events: none;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(toast.__timer);
  toast.__timer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2600);
}

// =====================================================================
// GENERACIÓN DE HTML: VISTA TÉCNICA ENRIQUECIDA
// =====================================================================
function generarHtmlVistaEnriquecida(doc) {
  const rubrica = RUBRICA_OFICIAL_JPV;
  const rawText = (typeof TALLERES_TXT_RAW !== "undefined" && TALLERES_TXT_RAW[doc.id]) || "";

  // Estantería de Talleres (Selector visual interactivo)
  const estanteriaHtml = `
    <div class="estanteria-talleres mb-4 p-3 bg-dark rounded border border-secondary shadow">
      <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-5">📚</span>
          <h6 class="fw-bold text-white mb-0">Talleres Técnicos & Bloc de Notas Oficiales (DataIADev)</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-info fw-bold py-0 px-2" onclick="alternarModoVistaDoc('raw_txt')">
            <i class="bi bi-file-text"></i> Ver TXT Plano
          </button>
          <button class="btn btn-sm btn-outline-success fw-bold py-0 px-2" onclick="descargarArchivoTxt('${doc.id}')">
            <i class="bi bi-download"></i> Descargar .TXT
          </button>
        </div>
      </div>

      <div class="row g-2">
        <!-- Taller 1 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'libro_maestro_python' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('libro_maestro_python')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-primary" style="font-size: 10px;">TALLER 1</span>
              <span class="text-secondary small" style="font-size: 10.5px;">671 Líneas • 5 Módulos</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12px;">Fundamentos de Programación</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">Módulos 1 al 5 + 15 Casos Prácticos Reales.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('libro_maestro_python')">
                <i class="bi bi-eye"></i> Abrir
              </button>
              <button class="btn btn-sm btn-outline-success py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarArchivoTxt('libro_maestro_python')">
                <i class="bi bi-filetype-txt"></i> .TXT
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('libro_maestro_python')">
                <i class="bi bi-file-pdf"></i> PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Taller 2 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'taller_mapas_calor' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('taller_mapas_calor')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-success" style="font-size: 10px;">TALLER 2</span>
              <span class="text-secondary small" style="font-size: 10.5px;">816 Líneas • 9 Retos</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12px;">Mapas de Calor Seaborn & ML</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">Matriz 3x3, Ventas, Clima, Triage y K-Means.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('taller_mapas_calor')">
                <i class="bi bi-eye"></i> Abrir
              </button>
              <button class="btn btn-sm btn-outline-success py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarArchivoTxt('taller_mapas_calor')">
                <i class="bi bi-filetype-txt"></i> .TXT
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('taller_mapas_calor')">
                <i class="bi bi-file-pdf"></i> PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Taller 3 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'taller_apis_publicas' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('taller_apis_publicas')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-warning text-dark fw-bold" style="font-size: 10px;">TALLER 3</span>
              <span class="text-secondary small" style="font-size: 10.5px;">303 Líneas • 6 APIs</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12px;">Consumo de APIs Públicas sin Key</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">Clima, Cripto, Terremotos y Pósters en RAM.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('taller_apis_publicas')">
                <i class="bi bi-eye"></i> Abrir
              </button>
              <button class="btn btn-sm btn-outline-success py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarArchivoTxt('taller_apis_publicas')">
                <i class="bi bi-filetype-txt"></i> .TXT
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('taller_apis_publicas')">
                <i class="bi bi-file-pdf"></i> PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render de Módulos / Retos
  const modulosHtml = (doc.modulos || []).map((m, idx) => {
    return `
      <section class="doc-modulo-section mb-5 p-3 p-md-4 rounded bg-dark border border-secondary shadow-sm" id="modulo-${m.id}">
        <!-- Encabezado del Módulo / Reto -->
        <div class="d-flex align-items-start justify-content-between flex-wrap gap-2 pb-3 mb-3 border-bottom border-secondary">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-info text-dark fw-bold fs-6 px-2 py-1">${m.numero}</span>
            <h4 class="fw-bold text-white mb-0">${m.titulo}</h4>
          </div>
          <span class="badge bg-black border border-secondary text-secondary small">${m.categoria || 'Guía Técnica'}</span>
        </div>

        <!-- 1. Presentación Didáctica / Contexto -->
        ${m.didactica ? `
          <div class="mb-3 p-3 rounded" style="background: rgba(15, 23, 42, 0.7); border-left: 4px solid #38bdf8;">
            <div class="d-flex align-items-center gap-2 text-info fw-bold mb-1" style="font-size: 13px;">
              <i class="bi bi-lightbulb-fill"></i> Fundamentos y Presentación Didáctica:
            </div>
            <p class="text-light mb-0 small" style="line-height: 1.6; white-space: pre-line;">${escapeHtml(m.didactica)}</p>
          </div>
        ` : ''}

        <!-- 2. Definición y Conceptualización -->
        ${m.concepto ? `
          <div class="mb-3 p-3 rounded" style="background: rgba(30, 41, 59, 0.5); border-left: 4px solid #f59e0b;">
            <div class="d-flex align-items-center gap-2 text-warning fw-bold mb-1" style="font-size: 13px;">
              <i class="bi bi-cpu-fill"></i> Definición & Conceptualización Clave:
            </div>
            <p class="text-light mb-0 small" style="line-height: 1.6; white-space: pre-line;">${escapeHtml(m.concepto)}</p>
          </div>
        ` : ''}

        <!-- 3. Reto para el Video / Misión Práctica -->
        ${m.reto_video ? `
          <div class="mb-3 p-3 rounded" style="background: rgba(220, 38, 38, 0.15); border: 2px solid #ef4444;">
            <div class="d-flex align-items-center gap-2 text-danger fw-bold mb-1" style="font-size: 13px;">
              <i class="bi bi-camera-reels-fill"></i> 🎬 Misión / Reto para el Video:
            </div>
            <p class="text-white fw-semibold mb-0 small" style="line-height: 1.5;">${escapeHtml(m.reto_video)}</p>
          </div>
        ` : ''}

        <!-- 4. Código Python Principal con Botón de Inyección en Vivo -->
        ${m.codigo ? `
          <div class="doc-codigo-wrapper my-3 rounded border border-secondary overflow-hidden">
            <div class="d-flex align-items-center justify-content-between px-3 py-2 bg-black border-bottom border-secondary">
              <span class="small fw-bold text-success font-monospace">
                <i class="bi bi-terminal-fill me-1"></i> Script Python (${m.numero})
              </span>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-light py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="window.copiarCodigoDoc(this)">
                  <i class="bi bi-clipboard"></i> Copiar
                </button>
                <button class="btn btn-sm btn-warning text-dark fw-bold py-0 px-2" style="font-size: 11px;" onclick="window.cargarCodigoEnEditor(\`${m.codigo.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`, '${m.titulo.replace(/'/g, "\\'")}')">
                  <i class="bi bi-lightning-charge-fill"></i> 🚀 Cargar en Editor PyStudio
                </button>
              </div>
            </div>
            <pre class="m-0 p-3 bg-black text-light font-monospace small" style="max-height: 380px; overflow-y: auto; line-height: 1.45;"><code class="language-python">${escapeHtml(m.codigo)}</code></pre>
          </div>
        ` : ''}

        <!-- 5. Ejercicios del Mundo Real (para Fundamentos) -->
        ${(m.ejercicios && m.ejercicios.length > 0) ? `
          <div class="mt-4 pt-3 border-top border-secondary">
            <h6 class="text-warning fw-bold mb-3"><i class="bi bi-briefcase-fill me-1"></i> 🚀 Ejercicios Aplicados del Mundo Real</h6>
            <div class="row g-3">
              ${m.ejercicios.map((ej, ejIdx) => `
                <div class="col-12">
                  <div class="p-3 rounded border border-secondary bg-black">
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                      <span class="fw-bold text-info small"><i class="bi bi-check2-circle me-1"></i> ${ej.titulo}</span>
                      <button class="btn btn-sm btn-outline-warning py-0 px-2 fw-bold" style="font-size: 11px;" 
                              onclick="window.cargarCodigoEnEditor(\`${ej.codigo.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`, '${ej.titulo.replace(/'/g, "\\'")}')">
                        <i class="bi bi-play-circle-fill"></i> Probar Ejercicio
                      </button>
                    </div>
                    ${ej.descripcion ? `<p class="small text-secondary mb-2" style="white-space: pre-line;">${escapeHtml(ej.descripcion)}</p>` : ''}
                    <pre class="m-0 p-2 rounded bg-dark border border-secondary text-success font-monospace small" style="max-height: 220px; overflow-y: auto;"><code>${escapeHtml(ej.codigo)}</code></pre>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </section>
    `;
  }).join('');

  return `
    <article class="doc-articulo-completo">
      <!-- Portada Oficial Neo-Brutalista -->
      <div class="doc-portada p-4 p-md-5 mb-4 text-center rounded border border-secondary shadow" style="background: radial-gradient(circle at 50% 0%, #1e293b 0%, #070b14 100%);">
        <div class="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-black border border-info text-info small fw-bold">
          <i class="bi ${doc.icono || 'bi-journal-code'}"></i> ${doc.categoria || 'Guía Oficial DataIADev'} • ${doc.lineasTxt || 500} Líneas
        </div>
        <h2 class="doc-portada-titulo fw-bold text-white mb-2" style="font-size: clamp(1.4rem, 2.5vw, 2.2rem);">${doc.titulo}</h2>
        <p class="doc-portada-subtitulo text-info mb-4" style="max-width: 800px; margin: 0 auto; font-size: 13.5px;">${doc.subtitulo}</p>

        <!-- Rúbrica Oficial de República Dominicana -->
        <div class="doc-rubrica-box text-start p-3 p-md-4 rounded mx-auto" style="max-width: 750px; background: rgba(15, 23, 42, 0.85); border: 2px solid #38bdf8;">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="https://avatars.githubusercontent.com/u/38921558?v=4" alt="Ing. Juancito Peña" 
                 class="rounded-circle border border-2 border-warning" style="width: 50px; height: 50px; object-fit: cover;">
            <div>
              <h5 class="fw-bold text-white mb-0" style="font-size: 15px;">${rubrica.autor}</h5>
              <div class="text-warning small fw-semibold" style="font-size: 12px;">${rubrica.institucion}</div>
              <div class="text-secondary small" style="font-size: 11px;">${rubrica.contacto.pais}</div>
            </div>
          </div>

          <div class="small text-light mb-3">
            <strong>Acreditación Profesional & Titulaciones:</strong>
            <ul class="mb-2 ps-3" style="font-size: 11px; line-height: 1.5;">
              ${rubrica.credenciales.map(c => `<li>${c}</li>`).join("")}
            </ul>
          </div>

          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top border-secondary small text-secondary" style="font-size: 11px;">
            <span>📧 <a href="mailto:${rubrica.contacto.correo}" class="text-info text-decoration-none">${rubrica.contacto.correo}</a></span>
            <span>📺 <a href="${rubrica.contacto.canal}" target="_blank" class="text-warning text-decoration-none">@JuancitoDevV</a></span>
            <span>🐙 <a href="${rubrica.contacto.github}" target="_blank" class="text-info text-decoration-none">JUANCITOPENA</a></span>
          </div>
        </div>

        <!-- Botones de Acción Primarios -->
        <div class="mt-4 d-flex flex-wrap justify-content-center gap-2">
          <button class="btn btn-success text-dark fw-bold px-3 py-2 shadow" onclick="descargarArchivoTxt('${doc.id}')">
            <i class="bi bi-file-earmark-text-fill"></i> Descargar .TXT Original (${doc.lineasTxt} líneas)
          </button>
          <button class="btn btn-outline-info fw-bold px-3 py-2" onclick="alternarModoVistaDoc('raw_txt')">
            <i class="bi bi-card-text"></i> Abrir Modo Bloc de Notas (Raw)
          </button>
          <button class="btn btn-warning text-dark fw-bold px-3 py-2" onclick="descargarDocumentoPDF('${doc.id}')">
            <i class="bi bi-file-earmark-pdf-fill"></i> Descargar PDF Oficial
          </button>
        </div>
      </div>

      <!-- Estantería de Navegación Rápida -->
      ${estanteriaHtml}

      <!-- Índice de Módulos -->
      <div class="p-3 mb-4 rounded bg-dark border border-secondary text-start">
        <h6 class="fw-bold text-warning mb-2"><i class="bi bi-list-check me-1"></i> Índice Rápido del Taller</h6>
        <div class="d-flex flex-wrap gap-2">
          ${(doc.modulos || []).map(m => `
            <a href="#modulo-${m.id}" class="badge bg-black border border-secondary text-info text-decoration-none px-2 py-2 small" style="transition: all 0.2s ease;">
              <span class="text-warning">${m.numero}:</span> ${m.titulo.length > 35 ? m.titulo.substring(0, 32) + '...' : m.titulo}
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Módulos de Contenido -->
      <div class="doc-modulos-contenedor text-start">
        ${modulosHtml}
      </div>

      <!-- Pie Canónico -->
      <div class="doc-contraportada p-4 my-4 text-center border-top border-secondary text-secondary small">
        <h6 class="text-light fw-bold mb-1">${rubrica.institucion}</h6>
        <p class="mb-2">Desarrollo de Software, Analítica de Datos & Inteligencia Artificial desde República Dominicana.</p>
        <div>${rubrica.notaEditorial}</div>
      </div>
    </article>
  `;
}

// =====================================================================
// GENERACIÓN DE HTML: VISTA BLOC DE NOTAS (RAW TXT MONOSPACE)
// =====================================================================
function generarHtmlVistaRawTxt(doc) {
  const rawText = (typeof TALLERES_TXT_RAW !== "undefined" && TALLERES_TXT_RAW[doc.id]) || "Archivo de texto no disponible.";
  const lineas = rawText.split("\n");

  return `
    <div class="vista-raw-txt-contenedor p-3 rounded bg-black border border-secondary">
      <!-- Toolbar del Bloc de Notas -->
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2 mb-3 bg-dark rounded border border-secondary">
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-success text-dark fw-bold">BLOC DE NOTAS RAW</span>
          <span class="text-light fw-bold small">${doc.archivoTxt || (doc.id + '.txt')}</span>
          <span class="text-secondary small font-monospace">(${lineas.length} líneas · ${(rawText.length / 1024).toFixed(1)} KB)</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-info text-dark fw-bold py-0 px-2" onclick="alternarModoVistaDoc('enriquecida')">
            <i class="bi bi-layout-text-window-reverse"></i> Vista Técnica Enriquecida
          </button>
          <button class="btn btn-sm btn-outline-light py-0 px-2 fw-semibold" onclick="copiarTodoRawTxt()">
            <i class="bi bi-clipboard"></i> Copiar Todo el TXT
          </button>
          <button class="btn btn-sm btn-success text-dark fw-bold py-0 px-2" onclick="descargarArchivoTxt('${doc.id}')">
            <i class="bi bi-download"></i> Descargar .TXT
          </button>
        </div>
      </div>

      <!-- Visor Monospaced con Líneas de Código -->
      <div class="bg-black p-3 rounded border border-secondary font-monospace" style="max-height: 720px; overflow-y: auto; font-size: 12px; line-height: 1.5; color: #e2e8f0; white-space: pre-wrap; word-break: break-word;">
        <pre class="m-0" id="raw-txt-content"><code>${escapeHtml(rawText)}</code></pre>
      </div>
    </div>
  `;
}

function copiarTodoRawTxt() {
  const rawText = (typeof TALLERES_TXT_RAW !== "undefined" && TALLERES_TXT_RAW[docActivoId]) || "";
  if (!rawText) return;
  navigator.clipboard.writeText(rawText).then(() => {
    mostrarNotificacionFlotante("📋 ¡Texto íntegro del Bloc de Notas copiado al portapapeles!");
  });
}

function renderizarDocumentoEnVisor() {
  const doc = (typeof BIBLIOTECA_DOCUMENTOS !== "undefined") ? BIBLIOTECA_DOCUMENTOS[docActivoId] : null;
  if (!doc) return;

  const container = document.getElementById("documento-viewer-content");
  if (!container) return;

  if (modoVistaDoc === "raw_txt") {
    container.innerHTML = generarHtmlVistaRawTxt(doc);
  } else {
    container.innerHTML = generarHtmlVistaEnriquecida(doc);
  }

  container.style.fontSize = `${14 * docZoomActual}px`;
  actualizarZoomLabel();
}

function zoomInDoc() {
  if (docZoomActual < 1.6) {
    docZoomActual += 0.1;
    const container = document.getElementById("documento-viewer-content");
    if (container) container.style.fontSize = `${14 * docZoomActual}px`;
    actualizarZoomLabel();
  }
}

function zoomOutDoc() {
  if (docZoomActual > 0.75) {
    docZoomActual -= 0.1;
    const container = document.getElementById("documento-viewer-content");
    if (container) container.style.fontSize = `${14 * docZoomActual}px`;
    actualizarZoomLabel();
  }
}

function resetZoomDoc() {
  docZoomActual = 1.0;
  const container = document.getElementById("documento-viewer-content");
  if (container) container.style.fontSize = "14px";
  actualizarZoomLabel();
}

function actualizarZoomLabel() {
  const lbl = document.getElementById("doc-zoom-label");
  if (lbl) {
    lbl.textContent = `${Math.round(docZoomActual * 100)}%`;
  }
}

function filtrarContenidoDoc(query) {
  const q = (query || "").trim().toLowerCase();
  const secciones = document.querySelectorAll(".doc-modulo-section");
  if (secciones.length === 0) return;

  secciones.forEach(sec => {
    if (!q) {
      sec.style.display = "";
      return;
    }
    const txt = sec.innerText.toLowerCase();
    sec.style.display = txt.includes(q) ? "" : "none";
  });
}

function descargarDocumentoPDF(idOpcional) {
  const id = idOpcional || docActivoId;
  const normalizado = id === "libro_python_maestro" ? "libro_maestro_python" : id;
  const infoPdf = MAPA_PDFS_COMPILADOS[normalizado];

  if (infoPdf && infoPdf.url) {
    const a = document.createElement("a");
    a.href = infoPdf.url;
    a.download = infoPdf.nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    mostrarNotificacionFlotante(`📕 Descargando ${infoPdf.nombre}...`);
    return;
  }

  // Fallback si no está compilado
  window.print();
}

function imprimirDocumentoNativo() {
  window.print();
}

function abrirVisorPDFLibros(idInicial) {
  if (idInicial) {
    cambiarDocumentoActivo(idInicial);
  }
  if (typeof cambiarTab === "function") {
    cambiarTab("documentos");
  }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderizarDocumentoEnVisor();
  }, 100);
});
