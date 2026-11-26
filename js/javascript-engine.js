// =======================================================
// MOTOR JAVASCRIPT, ES MODULES & WEBASSEMBLY NATIVO
// =======================================================

// Detección inteligente de sintaxis JavaScript / TypeScript / ESM
function esCodigoJavaScript(code) {
  if (!code || !code.trim()) return false;
  if (/^\s*import\s+.*?\s+from\s+['"][^'"]+['"]/m.test(code)) return true;
  if (/^\s*import\s+['"][^'"]+['"]/m.test(code)) return true;
  if (/^\s*(const|let|var)\s+[a-zA-Z0-9_$]+\s*=/m.test(code) && !/^\s*#/.test(code)) return true;
  if (/(async\s+function|function)\s+[a-zA-Z0-9_$]+\s*\(.*?\)\s*\{/m.test(code)) return true;
  if (/console\.(log|error|warn|info|table)\s*\(/m.test(code)) return true;
  if (/\bWebAssembly\.(instantiate|compile|Instance)\b/m.test(code)) return true;
  return false;
}

// Bytecode precompilado de math_skill.wasm (55 bytes: calcular_impuesto(monto: f64, tasa: f64) -> f64)
const WASM_SKILL_HEX = "0061736d0100000001070160027c7c017c030201000715011163616c63756c61725f696d70756573746f00000a0901070020002001a20b";

let ejecutandoJsActivo = false;
let iframeJsRunner = null;

// Escuchador de mensajes del ejecutor JavaScript
window.addEventListener("message", (e) => {
  if (!e.data) return;

  if (e.data.type === "js_input_request") {
    const promptText = e.data.prompt || "";
    if (typeof window.solicitarInputTerminal === "function") {
      window.solicitarInputTerminal(promptText).then((valor) => {
        if (iframeJsRunner && iframeJsRunner.contentWindow) {
          iframeJsRunner.contentWindow.postMessage({
            type: "js_input_response",
            id: e.data.id,
            value: valor
          }, "*");
        }
      });
    }
    return;
  }

  if (e.data.type === "js_console") {
    const metodo = e.data.method || "log";

    if (metodo === "clear") {
      if (terminal) terminal.textContent = "";
      return;
    }

    const texto = (e.data.args || []).map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ");
    
    let colorClass = "";
    let prefijo = "";
    if (metodo === "error") {
      colorClass = "text-danger";
      prefijo = "❌ ";
    } else if (metodo === "warn") {
      colorClass = "text-warning";
      prefijo = "⚠️ ";
    } else if (metodo === "info") {
      colorClass = "text-info";
      prefijo = "ℹ️ ";
    }

    if (terminal) {
      if (colorClass) {
        terminal.innerHTML += `<span class="${colorClass}">${prefijo}${texto}</span>\n`;
      } else {
        terminal.textContent += `${texto}\n`;
      }
      if (terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
  }

  if (e.data.type === "js_finished") {
    const btn = document.getElementById("btn-run");
    const spinner = document.getElementById("btn-spinner");
    const icon = document.getElementById("btn-icon");
    const btnMob = document.getElementById("btn-mobile-run");
    const spinnerMob = document.getElementById("btn-mobile-spinner");
    const iconMob = document.getElementById("btn-mobile-icon");
    const tiempoLbl = document.getElementById("tiempo-ejecucion");

    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.add("d-none");
    if (icon) icon.classList.remove("d-none");
    if (btnMob) btnMob.disabled = false;
    if (spinnerMob) spinnerMob.classList.add("d-none");
    if (iconMob) iconMob.classList.remove("d-none");

    if (tiempoLbl && e.data.elapsed) {
      tiempoLbl.innerText = `JS ejecutado en ${(e.data.elapsed / 1000).toFixed(2)}s`;
    }

    if (terminal) {
      if (e.data.success) {
        terminal.innerHTML += `\n<span class="text-success fw-bold">✨ [Proceso JavaScript & Wasm finalizado con éxito]</span>\n`;
      } else {
        terminal.innerHTML += `\n<span class="text-danger fw-bold">❌ [Fallo en ejecución JavaScript: ${e.data.error || 'Error'}]</span>\n`;
      }
      if (terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }

    ejecutandoJsActivo = false;
  }
});

async function ejecutarCodigoJavaScript(code) {
  if (ejecutandoJsActivo) return;
  ejecutandoJsActivo = true;

  const btn = document.getElementById("btn-run");
  const spinner = document.getElementById("btn-spinner");
  const icon = document.getElementById("btn-icon");
  const btnMob = document.getElementById("btn-mobile-run");
  const spinnerMob = document.getElementById("btn-mobile-spinner");
  const iconMob = document.getElementById("btn-mobile-icon");

  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.remove("d-none");
  if (icon) icon.classList.add("d-none");
  if (btnMob) btnMob.disabled = true;
  if (spinnerMob) spinnerMob.classList.remove("d-none");
  if (iconMob) iconMob.classList.add("d-none");

  // Conmutar a consola
  cambiarTab('terminal');
  if (typeof cambiarVistaMovil === "function" && window.innerWidth < 992) {
    cambiarVistaMovil('terminal');
  }

  terminal.className = "";
  terminal.textContent = `⚡ =======================================================
⚡ MOTOR NATIVO JAVASCRIPT, ES MODULES & WEBASSEMBLY
⚡ Resolviendo paquetes ESM (@google/genai) y binarios Wasm...
⚡ =======================================================\n\n`;

  // Remover runner anterior si existiera
  if (iframeJsRunner && iframeJsRunner.parentNode) {
    iframeJsRunner.parentNode.removeChild(iframeJsRunner);
  }

  // Crear iframe sandbox seguro para ejecución de ES Modules
  iframeJsRunner = document.createElement("iframe");
  iframeJsRunner.style.display = "none";
  document.body.appendChild(iframeJsRunner);

  const readlinePolyfill = "data:text/javascript;charset=utf-8," + encodeURIComponent(`
    export function createInterface() {
      return {
        question: (promptText) => window.solicitarInput(promptText),
        close: () => {}
      };
    }
    export default { createInterface };
  `);

  const processPolyfill = "data:text/javascript;charset=utf-8," + encodeURIComponent(`
    export const stdin = {};
    export const stdout = {};
    export const env = new Proxy({}, {
      get: (target, prop) => {
        try {
          return window.parent.localStorage.getItem(prop) || window.parent.sessionStorage.getItem(prop) || "";
        } catch(e) { return ""; }
      },
      set: (target, prop, val) => {
        try {
          window.parent.localStorage.setItem(prop, String(val));
          return true;
        } catch(e) { return true; }
      }
    });
    export const exit = (code) => {
      console.log("[Proceso finalizado]");
    };
    export default { stdin, stdout, env, exit };
  `);

  const runnerDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script type="importmap">
  {
    "imports": {
      "@google/genai": "https://cdn.jsdelivr.net/npm/@google/genai/+esm",
      "node:readline/promises": "${readlinePolyfill}",
      "readline/promises": "${readlinePolyfill}",
      "node:readline": "${readlinePolyfill}",
      "readline": "${readlinePolyfill}",
      "node:process": "${processPolyfill}",
      "process": "${processPolyfill}"
    }
  }
  <` + `/script>
  <script>
    window.__inputPromises = {};
    window.addEventListener("message", (ev) => {
      if (ev.data && ev.data.type === "js_input_response" && window.__inputPromises[ev.data.id]) {
        window.__inputPromises[ev.data.id](ev.data.value);
        delete window.__inputPromises[ev.data.id];
      }
    });

    window.solicitarInput = function(promptText) {
      return new Promise((resolve) => {
        const id = "req_" + Math.random().toString(36).slice(2);
        window.__inputPromises[id] = resolve;
        window.parent.postMessage({ type: "js_input_request", id: id, prompt: promptText }, "*");
      });
    };

    const enviarLog = (method, args) => {
      try {
        window.parent.postMessage({
          type: "js_console",
          method: method,
          args: Array.from(args).map(a => {
            try {
              if (typeof a === "object") return JSON.parse(JSON.stringify(a));
              return String(a);
            } catch(e) { return String(a); }
          })
        }, "*");
      } catch(e) {}
    };

    console.log = function(...args) { enviarLog("log", args); };
    console.error = function(...args) { enviarLog("error", args); };
    console.warn = function(...args) { enviarLog("warn", args); };
    console.info = function(...args) { enviarLog("info", args); };
    console.clear = function() {
      window.parent.postMessage({ type: "js_console", method: "clear", args: [] }, "*");
    };

    const origFetch = window.fetch;
    window.fetch = async function(resource, init) {
      let urlStr = typeof resource === "string" ? resource : (resource && resource.url ? resource.url : String(resource));

      if (urlStr.includes("math_skill.wasm")) {
        console.info("⚡ [Virtual Wasm VFS] Interceptando carga de './math_skill.wasm' desde memoria (55 bytes f64.mul)");
        const hex = "${WASM_SKILL_HEX}";
        const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        return new Response(bytes.buffer, {
          status: 200,
          headers: { "Content-Type": "application/wasm" }
        });
      }

      // Auto-reescritura de versión v1 a v1beta para Function Calling en Google GenAI
      if (urlStr.includes("generativelanguage.googleapis.com/v1/models") && !urlStr.includes("v1beta")) {
        urlStr = urlStr.replace("/v1/models", "/v1beta/models");
        console.info("🔄 [Gemini Auto-Version] Conmutando endpoint a 'v1beta' para habilitar Function Calling sin errores.");
        if (typeof resource === "string") {
          resource = urlStr;
        } else if (resource && resource.url) {
          resource = new Request(urlStr, init || resource);
        }
      }

      return origFetch.apply(this, [resource, init]);
    };

    window.addEventListener("error", (e) => {
      const msg = e.error ? (e.error.stack || e.error.message) : e.message;
      console.error(msg);
      window.parent.postMessage({ type: "js_finished", success: false, error: e.message }, "*");
    });

    window.addEventListener("unhandledrejection", (e) => {
      const msg = e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : "Promise Rejected";
      console.error(msg);
      window.parent.postMessage({ type: "js_finished", success: false, error: msg }, "*");
    });
  <` + `/script>
</head>
<body>
  <script type="module">
    const t0 = performance.now();
${code}
    const t1 = performance.now();
    window.parent.postMessage({ type: "js_finished", success: true, elapsed: (t1 - t0) }, "*");
  <` + `/script>
</body>
</html>`;

  iframeJsRunner.srcdoc = runnerDoc;
}
