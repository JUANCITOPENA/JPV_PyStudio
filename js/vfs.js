// =======================================================
// SUBIDA DE ARCHIVOS LOCALES (CSV / EXCEL XLSX / JSON)
// =======================================================
function manejarSubidaArchivo(input) {
  if (!input.files || input.files.length === 0) return;
  const archivo = input.files[0];
  guardarArchivoEnPython(archivo);
  input.value = "";
}

function guardarArchivoEnPython(archivo) {
  if (!pyodideInstance) {
    alert("Espera a que el motor WebAssembly termine de cargar.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    pyodideInstance.FS.writeFile(archivo.name, data);

    const ext = archivo.name.split('.').pop().toLowerCase();
    let snippet = "";
    if (ext === "csv") {
      snippet = `df = pd.read_csv("${archivo.name}")`;
    } else if (ext === "xlsx" || ext === "xls") {
      snippet = `df = pd.read_excel("${archivo.name}")`;
    } else if (ext === "json") {
      snippet = `df = pd.read_json("${archivo.name}")`;
    } else {
      snippet = `with open("${archivo.name}", "r", encoding="utf-8") as f:\n    contenido = f.read()`;
    }

    terminal.textContent += `\n📂 Archivo cargado con éxito: '${archivo.name}' (${(archivo.size / 1024).toFixed(1)} KB)\n`;
    terminal.textContent += `👉 Código para usarlo:\n   ${snippet}\n\n`;
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
    cambiarTab('terminal');
  };
  reader.readAsArrayBuffer(archivo);
}

// Drag & Drop
window.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragOverlay.classList.add("active");
});

window.addEventListener("dragleave", (e) => {
  if (e.relatedTarget === null || e.clientX === 0 || e.clientY === 0) {
    dragOverlay.classList.remove("active");
  }
});

window.addEventListener("drop", (e) => {
  e.preventDefault();
  dragOverlay.classList.remove("active");
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    guardarArchivoEnPython(e.dataTransfer.files[0]);
  }
});

async function mostrarArchivosEnMemoria() {
  if (!pyodideInstance) {
    alert("El motor WebAssembly aún se está inicializando.");
    return;
  }
  try {
    const jsonStr = await pyodideInstance.runPythonAsync(`
import os, json
archivos_info = []
for f in os.listdir('.'):
    if not f.startswith('.') and not f.startswith('__') and os.path.isfile(f):
        try:
            sz = os.path.getsize(f)
            archivos_info.append({"nombre": f, "size": sz})
        except:
            archivos_info.append({"nombre": f, "size": 0})
json.dumps(archivos_info)
    `);
    const archivos = JSON.parse(jsonStr);
    const contenedor = document.getElementById("vfs-tabla-archivos");
    
    if (archivos.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center text-secondary py-4">
          <i class="bi bi-folder-x fs-1 text-muted d-block mb-2"></i>
          No hay archivos creados ni cargados en la memoria virtual.<br>
          <span class="small">Usa <b>'Subir CSV / Excel'</b> o arrastra un archivo al editor para comenzar.</span>
        </div>`;
    } else {
      let html = `
        <table class="table table-dark table-hover table-sm align-middle small mb-0">
          <thead>
            <tr class="text-secondary border-secondary">
              <th>Archivo</th>
              <th>Tamaño</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>`;
      
      archivos.forEach(a => {
        const kb = (a.size / 1024).toFixed(1);
        const ext = a.nombre.split('.').pop().toLowerCase();
        let icon = "bi-file-earmark";
        if (ext === "csv" || ext === "xlsx" || ext === "xls") icon = "bi-file-earmark-excel text-success";
        else if (ext === "json") icon = "bi-file-earmark-code text-warning";
        else if (ext === "png" || ext === "jpg") icon = "bi-file-earmark-image text-info";
        else if (ext === "gif") icon = "bi-film text-danger";
        else if (ext === "html") icon = "bi-filetype-html text-primary";
        
        html += `
          <tr>
            <td><i class="bi ${icon} me-1"></i> <span class="fw-semibold text-light">${a.nombre}</span></td>
            <td class="text-muted">${kb} KB</td>
            <td class="text-end">
              <button class="btn btn-xs btn-outline-info py-0 px-2 me-1" onclick="descargarArchivoVFS('${a.nombre}')" title="Descargar a tu PC">
                <i class="bi bi-download"></i>
              </button>
              <button class="btn btn-xs btn-outline-secondary py-0 px-2 me-1" onclick="copiarSnippetArchivo('${a.nombre}')" title="Copiar código para cargarlo en Python">
                <i class="bi bi-code-slash"></i>
              </button>
              <button class="btn btn-xs btn-outline-danger py-0 px-2" onclick="eliminarArchivoVFS('${a.nombre}')" title="Eliminar del disco virtual">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>`;
      });
      html += `</tbody></table>`;
      contenedor.innerHTML = html;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalVfs'));
    modal.show();
  } catch(e) {
    console.error("Error al explorar VFS:", e);
    alert("Error al explorar VFS: " + e.message);
  }
}

function copiarSnippetArchivo(nombre) {
  const ext = nombre.split('.').pop().toLowerCase();
  let snippet = "";
  if (ext === "csv") snippet = `df = pd.read_csv("${nombre}")`;
  else if (ext === "xlsx" || ext === "xls") snippet = `df = pd.read_excel("${nombre}")`;
  else if (ext === "json") snippet = `df = pd.read_json("${nombre}")`;
  else snippet = `with open("${nombre}", "r", encoding="utf-8") as f:\n    contenido = f.read()`;
  navigator.clipboard.writeText(snippet);
  alert("Snippet copiado al portapapeles:\n\n" + snippet);
}

function descargarArchivoVFS(nombreArchivo) {
  if (!pyodideInstance) return;
  try {
    const data = pyodideInstance.FS.readFile(nombreArchivo);
    const ext = nombreArchivo.split('.').pop().toLowerCase();
    let mime = "application/octet-stream";
    if (ext === "csv") mime = "text/csv;charset=utf-8;";
    else if (ext === "xlsx") mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    else if (ext === "xls") mime = "application/vnd.ms-excel";
    else if (ext === "json") mime = "application/json";
    else if (ext === "png") mime = "image/png";
    else if (ext === "gif") mime = "image/gif";
    else if (ext === "html") mime = "text/html;charset=utf-8;";
    else if (ext === "txt") mime = "text/plain;charset=utf-8;";

    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch(e) {
    alert("Error al descargar archivo: " + e.message);
  }
}

async function eliminarArchivoVFS(nombreArchivo) {
  if (!confirm(`¿Deseas eliminar '${nombreArchivo}' del disco virtual?`)) return;
  try {
    pyodideInstance.FS.unlink(nombreArchivo);
    mostrarArchivosEnMemoria();
  } catch(e) {
    alert("Error al eliminar archivo: " + e.message);
  }
}
