// =======================================================
// MOTOR DE DIAGNÓSTICO PEDAGÓGICO DE ERRORES (JPV SMART)
// =======================================================
function parsearTracebackPython(errMsg, userCode) {
  const errMatch = errMsg.match(/([a-zA-Z_]\w*Error|[a-zA-Z_]\w*Exception):\s*([^\n]*)/);
  const tipo = errMatch ? errMatch[1] : "PythonError";
  const detalle = errMatch ? errMatch[2].trim() : "";

  const frameRegex = /File\s+["']([^"']+)["'],\s+line\s+(\d+)(?:,\s+in\s+([^\n]+))?(?:\n\s+([^\n]+))?(?:\n\s*(\^+))?/g;
  const frames = [];
  let m;
  while ((m = frameRegex.exec(errMsg)) !== null) {
    frames.push({
      file: m[1],
      line: parseInt(m[2], 10),
      func: m[3] || "",
      snippet: m[4] ? m[4].trim() : "",
      pointer: m[5] ? m[5].trim() : ""
    });
  }

  const userFrames = frames.filter(f => 
    !f.file.includes("/lib/") && 
    !f.file.includes("<exec>") && 
    !f.file.includes("pyodide")
  );

  const bestFrame = userFrames.length > 0 ? userFrames[userFrames.length - 1] : frames[frames.length - 1];
  let lineno = bestFrame ? bestFrame.line : null;
  let snippet = bestFrame ? bestFrame.snippet : "";
  let pointer = bestFrame ? bestFrame.pointer : "";

  if ((!snippet || !lineno) && userCode) {
    const lineMatch = errMsg.match(/line\s+(\d+)/);
    if (lineMatch) lineno = parseInt(lineMatch[1], 10);
  }

  return { tipo, detalle, lineno, snippet, pointer };
}

function generarDiagnosticoEducativo(diag, userCode, rawErr) {
  const { tipo, detalle, lineno, snippet, pointer } = diag;
  let tituloError = tipo;
  let explicacion = "";
  let recomendacion = "";

  if (tipo === "SyntaxError") {
    tituloError = "Error de Sintaxis (SyntaxError)";
    if (detalle.includes("expression expected after dictionary key and ':'") || (snippet && snippet.includes(":,"))) {
      explicacion = "El diccionario tiene una clave (ej: <code>'Ventas_USD':</code>) sin ningún valor asignado antes de la coma <code>,</code>. En Python, todo elemento de un diccionario exige obligatoriamente la estructura <code>'clave': valor</code>.";
      recomendacion = "Revisa la línea señalada y coloca un valor (número, texto o lista) después de los dos puntos <code>:</code>.<br><strong>Ejemplo de corrección:</strong><br><code>'Ventas_USD': [53900, 45850, 61215, 41085, 48510],</code><br><code>'Meta_USD': [50000, 50000, 55000, 45000, 45000],</code>";
    } else if (detalle.includes("was never closed") || detalle.includes("unclosed")) {
      explicacion = "Hay un paréntesis <code>(</code>, corchete <code>[</code> o llave <code>{</code> que se abrió pero no fue cerrado.";
      recomendacion = "Busca el paréntesis o corchete de apertura en la línea y asegúrate de cerrarlo antes del final de la instrucción.";
    } else if (detalle.includes("invalid syntax")) {
      explicacion = "La sintaxis de esta instrucción no sigue las reglas gramaticales de Python.";
      recomendacion = "Verifica si olvidaste dos puntos <code>:</code> al final de un <code>if</code>, <code>for</code>, <code>def</code> o <code>while</code>, o si hay un operador o comilla fuera de lugar.";
    } else {
      explicacion = detalle || "Error en la estructura sintáctica del código.";
      recomendacion = "Revisa la línea indicada para corregir caracteres faltantes o fuera de lugar.";
    }
  } else if (tipo === "FileNotFoundError") {
    tituloError = "Archivo No Encontrado (FileNotFoundError)";
    const matchArch = detalle.match(/['"]([^'"]+)['"]/);
    const nombreArch = matchArch ? matchArch[1] : "archivo";
    explicacion = `El script intentó abrir o leer el archivo <code>'${nombreArch}'</code>, pero este no se encuentra en el disco virtual de la sesión en el navegador.`;
    recomendacion = `1. Pulsa el botón <strong>'Subir CSV / Excel'</strong> en la barra superior para cargarlo desde tu PC a PyStudio.<br>2. O crea los datos directamente en el código usando <code>pd.DataFrame({...})</code>.`;
  } else if (tipo === "NameError") {
    tituloError = "Variable o Función No Definida (NameError)";
    const matchVar = detalle.match(/name\s+['"]([^'"]+)['"]/);
    const nomVar = matchVar ? matchVar[1] : "variable";
    explicacion = `La variable o función <code>'${nomVar}'</code> se utilizó pero no ha sido definida en este script, o tiene una letra equivocada.`;
    recomendacion = `1. Si es una variable propia, asígnale un valor antes de usarla.<br>2. Si es una librería como Pandas (<code>pd</code>) o Matplotlib (<code>plt</code>), asegúrate de tener al inicio: <code>import pandas as pd</code> o <code>import matplotlib.pyplot as plt</code>.<br>3. Recuerda que Python distingue mayúsculas de minúsculas.`;
  } else if (tipo === "KeyError") {
    tituloError = "Columna o Clave No Encontrada (KeyError)";
    const matchKey = detalle.match(/['"]([^'"]+)['"]/);
    const nomKey = matchKey ? matchKey[1] : "clave";
    explicacion = `La columna o clave <code>['${nomKey}']</code> no existe en el DataFrame o diccionario.`;
    recomendacion = `1. Comprueba los nombres reales de las columnas agregando: <code>print(df.columns.tolist())</code>.<br>2. Verifica si el nombre tiene espacios extra (ej: <code>' ${nomKey} '</code>) o diferencias en mayúsculas/minúsculas.`;
  } else if (tipo === "ZeroDivisionError") {
    tituloError = "División Entre Cero (ZeroDivisionError)";
    explicacion = "El código intentó realizar una división matemática donde el denominador o divisor es igual a 0.";
    recomendacion = "Protege el cálculo verificando que el divisor sea positivo: <code>resultado = (a / b) if b > 0 else 0</code>.";
  } else if (tipo === "IndexError") {
    tituloError = "Índice Fuera de Rango (IndexError)";
    explicacion = "Se intentó acceder a una posición o elemento que no existe dentro de la lista o arreglo.";
    recomendacion = "Verifica la cantidad total de elementos con <code>len(lista)</code>. Recuerda que en Python los índices inician en 0.";
  } else if (tipo === "TypeError") {
    tituloError = "Tipos Incompatibles (TypeError)";
    explicacion = `Operación inválida entre tipos de datos incompatibles (${detalle}).`;
    recomendacion = "Comprueba el tipo de dato de tus variables con <code>print(type(var))</code>. Si unes texto y números, usa <code>f'{var}'</code> o <code>str(var)</code>.";
  } else if (tipo === "IndentationError") {
    tituloError = "Error de Sangría / Indentación (IndentationError)";
    explicacion = "Los espacios al inicio de la línea no corresponden con el bloque de código esperado.";
    recomendacion = "Usa 4 espacios por cada nivel de sangría después de dos puntos <code>:</code>. No mezcles espacios con tabulaciones.";
  } else {
    tituloError = `${tipo}`;
    explicacion = detalle || "Ocurrió un error durante la ejecución del script.";
    recomendacion = "Revisa la línea señalada y valida los tipos de datos y parámetros utilizados.";
  }

  let lineasContextoHTML = "";
  if (userCode && lineno) {
    const arrLines = userCode.split("\n");
    const idx = lineno - 1;
    if (idx >= 0 && idx < arrLines.length) {
      const start = Math.max(0, idx - 1);
      const end = Math.min(arrLines.length - 1, idx + 1);

      for (let i = start; i <= end; i++) {
        const numL = String(i + 1).padStart(2, " ");
        const rawText = arrLines[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (i === idx) {
          lineasContextoHTML += `<div class="diag-line-err"><span class="text-danger fw-bold">❌ ${numL} │</span> ${rawText}</div>`;
          if (pointer) {
            lineasContextoHTML += `<div class="diag-pointer"><span class="text-secondary">     │</span> <span class="text-warning fw-bold">▲ [Error aquí: ${tipo}]</span></div>`;
          }
        } else {
          lineasContextoHTML += `<div class="diag-line-dim"><span class="text-secondary">   ${numL} │</span> ${rawText}</div>`;
        }
      }
    }
  }

  if (!lineasContextoHTML && snippet) {
    lineasContextoHTML = `<div class="diag-line-err"><span class="text-danger fw-bold">❌ Línea ${lineno || "?"}:</span> ${snippet.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    if (pointer) {
      lineasContextoHTML += `<div class="diag-pointer"><span class="text-warning fw-bold">   ▲ [Error aquí]</span></div>`;
    }
  }

  const rawEscapado = (rawErr || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `
<div class="diag-bento-card">
  <div class="diag-header">
    <span class="diag-badge-tipo"><i class="bi bi-exclamation-octagon-fill"></i> ${tituloError}</span>
    ${lineno ? `<span class="diag-badge-loc"><i class="bi bi-geo-alt-fill text-info"></i> Línea ${lineno}</span>` : ""}
  </div>

  ${lineasContextoHTML ? `
  <div class="diag-section-title"><i class="bi bi-code-slash text-info"></i> Fragmento de Código Afectado:</div>
  <div class="diag-code-box">${lineasContextoHTML}</div>
  ` : ""}

  <div class="diag-section-title"><i class="bi bi-info-circle-fill text-warning"></i> ¿Por qué ocurrió esto?:</div>
  <div class="diag-explain">${explicacion}</div>

  <div class="diag-section-title"><i class="bi bi-lightbulb-fill text-success"></i> ¿Qué debes hacer en tu código? (Recomendación):</div>
  <div class="diag-solution">${recomendacion}</div>

  <details class="diag-trace-toggle">
    <summary><i class="bi bi-terminal"></i> Ver rastro técnico original de la consola (Traceback)</summary>
    <pre class="diag-trace-pre">${rawEscapado}</pre>
  </details>
</div>
`;
}
