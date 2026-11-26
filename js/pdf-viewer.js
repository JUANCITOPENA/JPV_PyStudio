// =====================================================================
// MOTOR VISOR WEBVIEW & COMPILADOR EDITORIAL PDF
// Proyecto: JPV_PyStudio • Autor: Ing. Juancito Peña Vizcaíno
// Estándar Editorial DataIADev • Rúbrica República Dominicana
// =====================================================================

let docActivoId = "libro_maestro_python";
let docZoomActual = 1.0;

function cambiarDocumentoActivo(nuevoId) {
  if (BIBLIOTECA_DOCUMENTOS[nuevoId]) {
    docActivoId = nuevoId;
    renderizarDocumentoEnVisor();
    
    // Sincronizar selectores si existen en varios lugares
    const selTab = document.getElementById("select-doc-activo");
    const selModal = document.getElementById("select-doc-modal");
    if (selTab && selTab.value !== nuevoId) selTab.value = nuevoId;
    if (selModal && selModal.value !== nuevoId) selModal.value = nuevoId;
  }
}

function generarHtmlDocumento(doc) {
  if (!doc) return "<div class='p-4 text-warning'>Documento no encontrado.</div>";

  const rubrica = RUBRICA_OFICIAL_JPV;
  const modulosHtml = doc.modulos.map((m, idx) => {
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
          </div>
        </div>

        <div class="mt-4 text-center">
          <span class="badge bg-black border border-secondary text-secondary px-3 py-2 small">
            📌 ${rubrica.notaEditorial}
          </span>
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

// Descarga en PDF mediante html2pdf o impresión nativa
function descargarDocumentoPDF(idOpcional) {
  const docId = idOpcional || docActivoId;
  const doc = BIBLIOTECA_DOCUMENTOS[docId];
  if (!doc) return;

  const elemento = document.getElementById("documento-viewer-content") || document.getElementById("modal-documento-content");
  if (!elemento) return;

  const btnDescarga = document.getElementById("btn-descargar-pdf-doc") || document.getElementById("btn-descargar-pdf-tab");
  if (btnDescarga) {
    btnDescarga.disabled = true;
    btnDescarga.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Generando PDF...`;
  }

  // Opciones editoriales para html2pdf
  if (typeof html2pdf !== "undefined") {
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${docId}_DataIADev_JuancitoPena.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(elemento).save().then(() => {
      if (btnDescarga) {
        btnDescarga.disabled = false;
        btnDescarga.innerHTML = `<i class="bi bi-download"></i> Descargar PDF`;
      }
    }).catch(err => {
      console.warn("Fallo html2pdf, conmutando a impresion nativa:", err);
      if (btnDescarga) {
        btnDescarga.disabled = false;
        btnDescarga.innerHTML = `<i class="bi bi-download"></i> Descargar PDF`;
      }
      imprimirDocumentoNativo();
    });
  } else {
    // Si no está disponible html2pdf, usar ventana de impresión nativa
    imprimirDocumentoNativo();
    if (btnDescarga) {
      btnDescarga.disabled = false;
      btnDescarga.innerHTML = `<i class="bi bi-download"></i> Descargar PDF`;
    }
  }
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
