// =====================================================================
// MOTOR VISOR WEBVIEW & COMPILADOR EDITORIAL PDF
// Proyecto: JPV_PyStudio • Autor: Ing. Juancito Peña Vizcaíno
// Estándar Editorial DataIADev • Rúbrica República Dominicana
// =====================================================================

// =====================================================================
// MAPA OFICIAL DE LA TRILOGÍA EDITORIAL COMPILADA EN PDF (REPORTLAB 300 DPI)
// =====================================================================
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

function cambiarDocumentoActivo(nuevoId) {
  const normalizado = nuevoId === "libro_python_maestro" ? "libro_maestro_python" : nuevoId;
  if (BIBLIOTECA_DOCUMENTOS[normalizado]) {
    docActivoId = normalizado;
    renderizarDocumentoEnVisor();
    
    // Sincronizar selectores si existen en varios lugares
    const selTab = document.getElementById("select-doc-activo");
    const selModal = document.getElementById("select-doc-modal");
    if (selTab && selTab.value !== normalizado) selTab.value = normalizado;
    if (selModal && selModal.value !== normalizado) selModal.value = normalizado;
  }
}

function generarHtmlDocumento(doc) {
  if (!doc) return "<div class='p-4 text-warning'>Documento no encontrado.</div>";

  const rubrica = RUBRICA_OFICIAL_JPV;

  // Estantería de la Trilogía de 3 Libros
  const estanteriaHtml = `
    <div class="estanteria-trilogia-container mb-4 p-3 bg-dark rounded border border-secondary shadow">
      <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-5">📚</span>
          <h6 class="fw-bold text-white mb-0">Trilogía Editorial Oficial DataIADev (Libros PDF 300 DPI)</h6>
        </div>
        <span class="badge bg-warning text-dark fw-bold px-2 py-1">Estándar Universitario & Enterprise</span>
      </div>

      <div class="row g-2">
        <!-- Tarjeta Libro 1 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'libro_maestro_python' || doc.id === 'libro_python_maestro' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('libro_maestro_python')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-primary" style="font-size: 10px;">VOLUMEN 1</span>
              <span class="text-secondary small" style="font-size: 10.5px;">15 Páginas • 37 KB</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12.5px;">Python Masterclass, POO, SQL & IA</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">Desde consola hasta SQL Server, Streamlit y Agentes.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('libro_maestro_python')">
                <i class="bi bi-eye"></i> Leer
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('libro_maestro_python')">
                <i class="bi bi-download"></i> Descargar PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Tarjeta Libro 2 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'taller_mapas_calor' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('taller_mapas_calor')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-success" style="font-size: 10px;">VOLUMEN 2</span>
              <span class="text-secondary small" style="font-size: 10.5px;">10 Páginas • 1.7 MB</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12.5px;">Analítica Visual, Seaborn & ML</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">8 Retos de Heatmaps, Dashboards y K-Means.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('taller_mapas_calor')">
                <i class="bi bi-eye"></i> Leer
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('taller_mapas_calor')">
                <i class="bi bi-download"></i> Descargar PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Tarjeta Libro 3 -->
        <div class="col-12 col-lg-4">
          <div class="p-2 rounded border ${doc.id === 'taller_apis_publicas' ? 'border-info bg-black' : 'border-secondary bg-dark'}" 
               style="cursor: pointer; transition: all 0.2s ease;" onclick="cambiarDocumentoActivo('taller_apis_publicas')">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-warning text-dark fw-bold" style="font-size: 10px;">VOLUMEN 3</span>
              <span class="text-secondary small" style="font-size: 10.5px;">6 Páginas • 330 KB</span>
            </div>
            <div class="fw-bold text-light text-truncate" style="font-size: 12.5px;">Consumo de APIs Públicas sin Key</div>
            <div class="small text-secondary mb-2" style="font-size: 11px;">Feeds en vivo, Cripto, Clima y Pósters en RAM.</div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-info py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="event.stopPropagation(); cambiarDocumentoActivo('taller_apis_publicas')">
                <i class="bi bi-eye"></i> Leer
              </button>
              <button class="btn btn-sm btn-warning text-dark py-0 px-2 fw-bold" style="font-size: 11px;" onclick="event.stopPropagation(); descargarDocumentoPDF('taller_apis_publicas')">
                <i class="bi bi-download"></i> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const modulosHtml = (doc.modulos || []).map((m, idx) => {
    return `
      <section class="doc-modulo-section mb-5" id="modulo-${m.id}">
        <div class="doc-modulo-header d-flex align-items-center gap-3 pb-2 mb-3 border-bottom border-secondary">
          <div class="doc-modulo-badge">${m.numero}</div>
          <div>
            <h3 class="doc-modulo-title mb-1">${m.titulo}</h3>
            <p class="doc-modulo-desc mb-0">${m.descripcion}</p>
          </div>
        </div>

        <div class="doc-modulo-body">
          ${m.contenidoHtml}
        </div>

        ${m.codigoEjemplo ? `
          <div class="doc-codigo-wrapper my-4">
            <div class="doc-codigo-header d-flex align-items-center justify-content-between px-3 py-2">
              <span class="small fw-bold text-info"><i class="bi bi-code-square"></i> Script Demostrativo Completo (Python / SQL)</span>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-light py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="window.copiarCodigoDoc(this)">
                  <i class="bi bi-clipboard"></i> Copiar
                </button>
                <button class="btn btn-sm btn-outline-warning py-0 px-2 fw-semibold" style="font-size: 11px;" onclick="window.inyectarCodigoDoc(this)">
                  <i class="bi bi-lightning-charge-fill"></i> Probar en Editor
                </button>
              </div>
            </div>
            <pre class="doc-codigo-pre m-0 p-3"><code class="language-python">${escapeHtml(m.codigoEjemplo)}</code></pre>
          </div>
        ` : ''}

        ${m.reto ? `
          <div class="doc-reto-card p-3 my-4 border border-2 border-warning rounded bg-dark">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <h5 class="text-warning fw-bold mb-0"><i class="bi bi-fire"></i> ${m.reto.titulo}</h5>
              <button class="btn btn-sm btn-warning text-dark fw-bold py-0 px-2" style="font-size: 11px;" onclick="window.cargarRetoAlEditor('${doc.id}', '${m.id}')">
                <i class="bi bi-play-circle-fill"></i> Resolver este Reto en PyStudio
              </button>
            </div>
            <p class="small text-light mb-2">${m.reto.descripcion}</p>
            <pre class="bg-black p-2 rounded border border-secondary small text-warning m-0"><code>${escapeHtml(m.reto.codigoInicial)}</code></pre>
          </div>
        ` : ''}

        <!-- Pie de página institucional por módulo -->
        <div class="doc-modulo-footer text-end pt-2 border-top border-secondary text-secondary small" style="font-size: 11px;">
          <span>DataIADev • ${doc.titulo} • Módulo ${m.numero} • Ing. Juancito Peña</span>
        </div>
      </section>
    `;
  }).join("");

  return `
    <article class="doc-articulo-editorial" style="transform-origin: top center; transform: scale(${docZoomActual});">
      
      <!-- ESTANTERÍA VISUAL DE LOS 3 LIBROS -->
      ${estanteriaHtml}

      <!-- PORTADA EDITORIAL CEREMONIAL (ESTÁNDAR INTERNACIONAL JPV) -->
      <div class="doc-portada-ceremonial text-center p-4 p-md-5 mb-5 rounded border border-2 border-info shadow-lg">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="badge bg-danger text-white border border-dark px-3 py-1 fw-bold" style="font-size: 12px; letter-spacing: 1px;">
            DATA-IA-DEV OFICIAL
          </span>
          <span class="small text-secondary fw-bold" style="font-size: 11.5px;">
            ${doc.version}
          </span>
        </div>

        <h1 class="doc-portada-titulo mb-2">${doc.titulo}</h1>
        <h4 class="doc-portada-subtitulo text-info mb-4">${doc.subtitulo}</h4>

        <div class="doc-portada-divider my-4"></div>

        <!-- Rúbrica Oficial de República Dominicana -->
        <div class="doc-rubrica-box text-start p-3 p-md-4 rounded mx-auto" style="max-width: 750px; background: rgba(15, 23, 42, 0.85); border: 2px solid #38bdf8;">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="https://avatars.githubusercontent.com/u/38921558?v=4" alt="Ing. Juancito Peña" 
                 class="rounded-circle border border-2 border-warning" style="width: 55px; height: 55px; object-fit: cover;">
            <div>
              <h5 class="fw-bold text-white mb-0">${rubrica.autor}</h5>
              <div class="text-warning small fw-semibold">${rubrica.institucion}</div>
              <div class="text-secondary small" style="font-size: 11px;">${rubrica.contacto.pais}</div>
            </div>
          </div>

          <div class="small text-light mb-3">
            <strong>Acreditación Profesional & Titulaciones:</strong>
            <ul class="mb-2 ps-3" style="font-size: 11.5px; line-height: 1.6;">
              ${rubrica.credenciales.map(c => `<li>${c}</li>`).join("")}
            </ul>
          </div>

          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top border-secondary small text-secondary" style="font-size: 11px;">
            <span>📧 Correo: <a href="mailto:${rubrica.contacto.correo}" class="text-info text-decoration-none">${rubrica.contacto.correo}</a></span>
            <span>📺 Canal Educativo: <a href="${rubrica.contacto.canal}" target="_blank" class="text-warning text-decoration-none">@JuancitoDevV</a></span>
            <span>🐙 GitHub: <a href="${rubrica.contacto.github}" target="_blank" class="text-info text-decoration-none">JUANCITOPENA</a></span>
          </div>
        </div>

        <!-- Nota Editorial Oficial -->
        <div class="mt-4 p-2 rounded bg-dark border border-secondary text-warning small font-monospace" style="max-width: 750px; margin: 0 auto;">
          <i class="bi bi-shield-check"></i> <strong>Sello Editorial:</strong> "Extractos del libro oficial: «Lo que nadie te enseña de Python y su ecosistema»"
        </div>

        <!-- Botón de Descarga Directa del PDF Real -->
        <div class="mt-4">
          <button class="btn btn-warning text-dark fw-bold px-4 py-2 shadow" onclick="descargarDocumentoPDF('${doc.id}')">
            <i class="bi bi-file-earmark-pdf-fill fs-5"></i> Descargar Libro Oficial en PDF (Formato Carta 300 DPI)
          </button>
        </div>
      </div>

      <!-- ÍNDICE DE CONTENIDOS -->
      <div class="doc-indice-box p-3 p-md-4 mb-5 rounded border border-secondary bg-dark text-start">
        <h5 class="fw-bold text-warning mb-3"><i class="bi bi-list-nested"></i> Tabla de Contenidos & Módulos</h5>
        <div class="row g-2">
          ${doc.modulos.map(m => `
            <div class="col-12 col-md-6">
              <a href="#modulo-${m.id}" class="doc-indice-link text-decoration-none d-flex align-items-center gap-2 p-2 rounded">
                <span class="badge bg-secondary">${m.numero}</span>
                <span class="text-light small text-truncate">${m.titulo}</span>
              </a>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- CUERPO DE MÓDULOS -->
      <div class="doc-modulos-contenedor text-start">
        ${modulosHtml}
      </div>

      <!-- CONTRAPORTADA Y PIE CANÓNICO -->
      <div class="doc-contraportada p-4 p-md-5 my-5 text-center border-top border-secondary text-secondary">
        <h5 class="text-light fw-bold mb-1">${rubrica.institucion}</h5>
        <p class="small mb-3">Construyendo el futuro de la ingeniería de software, la analítica y la inteligencia artificial desde la República Dominicana para el mundo.</p>
        <div class="d-flex justify-content-center gap-3 small">
          <a href="${rubrica.contacto.canal}" target="_blank" class="text-warning text-decoration-none"><i class="bi bi-youtube"></i> YouTube</a>
          <a href="${rubrica.contacto.github}" target="_blank" class="text-light text-decoration-none"><i class="bi bi-github"></i> GitHub</a>
          <a href="${rubrica.contacto.linkedin}" target="_blank" class="text-info text-decoration-none"><i class="bi bi-linkedin"></i> LinkedIn</a>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function renderizarDocumentoEnVisor() {
  const doc = BIBLIOTECA_DOCUMENTOS[docActivoId];
  if (!doc) return;

  const html = generarHtmlDocumento(doc);

  // Renderizar en pestaña principal si existe
  const contenedorTab = document.getElementById("documento-viewer-content");
  if (contenedorTab) {
    contenedorTab.innerHTML = html;
  }

  // Renderizar en modal panorámico si existe
  const contenedorModal = document.getElementById("modal-documento-content");
  if (contenedorModal) {
    contenedorModal.innerHTML = html;
  }

  // Actualizar títulos
  const lblDoc = document.getElementById("doc-actual-titulo");
  if (lblDoc) lblDoc.innerText = doc.titulo;
}

// Inyección de reto seleccionado al editor
window.cargarRetoAlEditor = function(docId, moduloId) {
  const doc = BIBLIOTECA_DOCUMENTOS[docId];
  if (!doc) return;
  const mod = doc.modulos.find(m => m.id === moduloId);
  if (!mod || !mod.reto) return;

  const codigo = `# =====================================================================
# RETO OFICIAL: ${mod.reto.titulo}
# Documento: ${doc.titulo}
# Autor: Ing. Juancito Peña (DataIADev • @JuancitoDevV)
# =====================================================================

${mod.reto.codigoInicial}
`;

  if (typeof editor !== "undefined") {
    editor.value = codigo;
    if (typeof actualizarContador === "function") actualizarContador();
    if (typeof sincronizarPrism === "function") sincronizarPrism();
    if (typeof actualizarDeteccionCodigo === "function") actualizarDeteccionCodigo();

    // Cambiar a la vista del editor
    if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
      cambiarVistaMovil("editor");
    } else if (typeof cambiarTab === "function") {
      cambiarTab("terminal");
    }

    // Cerrar modal si estaba abierto
    const modalEl = document.getElementById("modalVisorPDFLibros");
    if (modalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }

    alert(`✅ ${mod.reto.titulo} cargado en el editor de PyStudio.`);
  }
};

window.copiarCodigoDoc = function(btn) {
  const pre = btn.closest(".doc-codigo-wrapper").querySelector("code");
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check2"></i> ¡Copiado!`;
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  });
};

window.inyectarCodigoDoc = function(btn) {
  const pre = btn.closest(".doc-codigo-wrapper").querySelector("code");
  if (!pre) return;
  if (typeof editor !== "undefined") {
    editor.value = pre.innerText;
    if (typeof actualizarContador === "function") actualizarContador();
    if (typeof sincronizarPrism === "function") sincronizarPrism();
    if (typeof actualizarDeteccionCodigo === "function") actualizarDeteccionCodigo();

    if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
      cambiarVistaMovil("editor");
    } else if (typeof cambiarTab === "function") {
      cambiarTab("terminal");
    }

    const orig = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check2-all"></i> ¡Cargado!`;
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  }
};

// Controles de Zoom
function zoomInDoc() {
  if (docZoomActual < 1.6) {
    docZoomActual += 0.1;
    renderizarDocumentoEnVisor();
    actualizarZoomLabel();
  }
}

function zoomOutDoc() {
  if (docZoomActual > 0.6) {
    docZoomActual -= 0.1;
    renderizarDocumentoEnVisor();
    actualizarZoomLabel();
  }
}

function resetZoomDoc() {
  docZoomActual = 1.0;
  renderizarDocumentoEnVisor();
  actualizarZoomLabel();
}

function actualizarZoomLabel() {
  const lbls = document.querySelectorAll(".doc-zoom-val, #doc-zoom-label");
  lbls.forEach(lbl => {
    lbl.innerText = `${Math.round(docZoomActual * 100)}%`;
  });
}

// Buscador / Filtro rápido dentro del documento activo
function filtrarContenidoDoc(query) {
  const q = (query || "").trim().toLowerCase();
  const articulos = document.querySelectorAll(".doc-articulo-editorial");
  if (!articulos.length) return;

  articulos.forEach(art => {
    if (!q) {
      art.style.display = "";
      return;
    }
    const texto = art.innerText.toLowerCase();
    if (texto.includes(q)) {
      art.style.display = "";
    } else {
      art.style.display = "none";
    }
  });
}

// Descarga directa del PDF real compilado en ReportLab (300 DPI)
function descargarDocumentoPDF(idOpcional) {
  const docId = idOpcional || docActivoId;
  const normalizado = docId === "libro_python_maestro" ? "libro_maestro_python" : docId;
  const infoPdf = MAPA_PDFS_COMPILADOS[normalizado];

  if (infoPdf) {
    const a = document.createElement("a");
    a.href = infoPdf.url;
    a.download = infoPdf.nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const btnDescarga = document.getElementById("btn-descargar-pdf-doc") || document.getElementById("btn-descargar-pdf-tab");
    if (btnDescarga) {
      const origText = btnDescarga.innerHTML;
      btnDescarga.innerHTML = `<i class="bi bi-check2-circle"></i> ¡Descargando ${infoPdf.nombre}!`;
      setTimeout(() => { btnDescarga.innerHTML = origText; }, 3000);
    }

    if (typeof notificarUsuario === "function") {
      notificarUsuario(`📥 Descargando ${infoPdf.nombre} (${infoPdf.paginas} • ${infoPdf.peso})`);
    }
    return;
  }

  // Fallback a impresión nativa si no estuviera en el mapa
  window.print();
}

function imprimirDocumentoNativo() {
  window.print();
}

function abrirVisorPDFLibros(idInicial) {
  if (idInicial) cambiarDocumentoActivo(idInicial);

  // Si estamos en desktop, abrir en la pestaña o en el modal
  if (typeof cambiarTab === "function") {
    cambiarTab("documentos");
  }

  if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
    cambiarVistaMovil("documentos");
  }
}
