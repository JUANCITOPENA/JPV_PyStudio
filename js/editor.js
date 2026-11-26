// =======================================================
// AUTOCOMPLETADO & SNIPPETS
// =======================================================
const CATALOGO_SNIPPETS = [
  { trigger: "pr", label: "print()", desc: "imprimir en consola", type: "snippet", text: "print($0)" },
  { trigger: "prf", label: "print(f\"...\")", desc: "print con f-string", type: "snippet", text: 'print(f"$0")' },
  { trigger: "inp", label: "input()", desc: "pedir datos interactivos", type: "snippet", text: 'input("$0")' },
  { trigger: "urlcsv", label: "pd.read_csv(url)", desc: "leer CSV desde internet (URL)", type: "pandas", text: 'df = pd.read_csv("$0")\nprint(df.head())' },
  { trigger: "readexcel", label: "pd.read_excel()", desc: "leer archivo Excel (.xlsx)", type: "pandas", text: 'df = pd.read_excel("$0.xlsx")\nprint(df.head())' },
  { trigger: "readcsv", label: "pd.read_csv()", desc: "cargar archivo CSV local", type: "pandas", text: 'pd.read_csv("$0.csv")' },
  { trigger: "readjson", label: "pd.read_json()", desc: "leer JSON local o URL", type: "pandas", text: 'pd.read_json("$0")' },
  { trigger: "df", label: "pd.DataFrame()", desc: "crear DataFrame", type: "pandas", text: "df = pd.DataFrame({\n    \"col1\": [1, 2, 3],\n    \"col2\": [\"A\", \"B\", \"C\"]\n})\nprint(df)$0" },
  { trigger: "reqget", label: "requests.get()", desc: "petición HTTP GET", type: "snippet", text: 'r = requests.get("$0")\ndatos = r.json()\nprint(datos)' },
  { trigger: "reqpost", label: "requests.post()", desc: "petición HTTP POST", type: "snippet", text: 'r = requests.post("$0", json={})\nprint(r.status_code)' },
  { trigger: "snsheat", label: "sns.heatmap()", desc: "mapa de calor Seaborn", type: "matplotlib", text: 'sns.heatmap(df.corr(), annot=True, cmap="coolwarm")\nplt.tight_layout()$0' },
  { trigger: "snsreg", label: "sns.regplot()", desc: "gráfico regresión Seaborn", type: "matplotlib", text: 'sns.regplot(x="$1", y="$2", data=df)\nplt.tight_layout()$0' },
  { trigger: "plot", label: "plt.subplots()", desc: "crear gráfico Matplotlib", type: "matplotlib", text: "fig, ax = plt.subplots(figsize=(7, 3.5))\nax.plot([1, 2, 3], [10, 20, 15], color=\"#00f2fe\")\nplt.tight_layout()$0" },
  { trigger: "toexcel", label: ".to_excel()", desc: "exportar a Excel (.xlsx)", type: "pandas", text: 'to_excel("$0.xlsx", index=False)' },
  { trigger: "tocsv", label: ".to_csv()", desc: "exportar a CSV", type: "pandas", text: 'to_csv("$0.csv", index=False)' },
  { trigger: "curvefit", label: "curve_fit()", desc: "ajuste de curva Scipy", type: "snippet", text: 'params, cov = curve_fit(modelo, x_data, y_data)$0' },
  { trigger: "fori", label: "for i in range():", desc: "bucle de conteo", type: "snippet", text: "for i in range(10):\n    $0" },
  { trigger: "def", label: "def funcion():", desc: "definir función", type: "palabra clave", text: "def mi_funcion($0):\n    pass" },
  { trigger: "try", label: "try / except", desc: "control de excepciones", type: "snippet", text: "try:\n    $0\nexcept Exception as e:\n    print(f\"Error: {e}\")" },
  { trigger: "import", label: "import", desc: "importar módulo", type: "palabra clave", text: "import $0" },
  { trigger: "st", label: "import streamlit as st", desc: "importar Streamlit Wasm", type: "snippet", text: "import streamlit as st\n$0" },
  { trigger: "sttitle", label: "st.title()", desc: "título principal Streamlit", type: "snippet", text: 'st.title("$0")' },
  { trigger: "stslider", label: "st.slider()", desc: "slider interactivo Streamlit", type: "snippet", text: 'valor = st.slider("$0", 0, 100, 50)' },
  { trigger: "stmetric", label: "st.metric()", desc: "tarjeta KPI con delta", type: "snippet", text: 'st.metric(label="$1", value="$2", delta="$3")' },
  { trigger: "stbutton", label: "st.button()", desc: "botón interactivo Streamlit", type: "snippet", text: 'if st.button("$0"):\n    st.write("¡Acción completada!")' },
  { trigger: "stdf", label: "st.dataframe()", desc: "tabla interactiva Streamlit", type: "snippet", text: 'st.dataframe($0, use_container_width=True)' }
];

const PALABRAS_CLAVE = [
  "True", "False", "None", "and", "or", "not", "in", "is", "lambda", "while", "with", "as", 
  "class", "elif", "else", "if", "pass", "break", "continue", "yield"
].map(k => ({ trigger: k, label: k, desc: "palabra reservada", type: "palabra clave", text: k }));

const NATIVAS = [
  "input", "print", "len", "range", "enumerate", "zip", "sum", "min", "max", "round", "open", 
  "str", "int", "float", "list", "dict", "set", "tuple", "isinstance", "type"
].map(b => ({ trigger: b, label: b + "()", desc: "función nativa", type: "función nativa", text: b + "($0)" }));

const CATALOGO_COMPLETO = [...CATALOGO_SNIPPETS, ...PALABRAS_CLAVE, ...NATIVAS];

let sugerenciasActivas = [];
let indiceSeleccionado = 0;

function extraerVariablesUsuario(codigo) {
  const variables = new Map();
  const lineasCod = codigo.split("\n");

  for (let l of lineasCod) {
    const comentarioPos = l.indexOf("#");
    if (comentarioPos !== -1) l = l.substring(0, comentarioPos);
    l = l.trim();
    if (!l) continue;

    const matchVar = l.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (matchVar && !["import", "from", "def", "class", "if", "for", "while"].includes(matchVar[1])) {
      variables.set(matchVar[1], {
        trigger: matchVar[1],
        label: matchVar[1],
        desc: "variable definida",
        type: "variable",
        text: matchVar[1]
      });
    }

    const matchDef = l.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (matchDef) {
      variables.set(matchDef[1], {
        trigger: matchDef[1],
        label: matchDef[1] + "()",
        desc: "función definida",
        type: "función",
        text: matchDef[1] + "($0)"
      });
    }
  }
  return Array.from(variables.values());
}

let cachedLineCount = -1;
let rafEditorSync = null;

function sincronizarPrism() {
  let codigo = editor.value;
  if (codigo.endsWith("\n")) codigo += " ";
  highlightCode.textContent = codigo;
  Prism.highlightElement(highlightCode);
}

function actualizarContador() {
  const total = editor.value.split("\n").length;
  if (total !== cachedLineCount) {
    cachedLineCount = total;
    lineas.innerHTML = Array.from({ length: total }, (_, i) => i + 1).join("<br>");
  }
}

function sincronizarEditorOptimizado() {
  actualizarContador();
  sincronizarPrism();
}

function obtenerPalabraActual() {
  const pos = editor.selectionStart;
  const textoHastaCursor = editor.value.substring(0, pos);
  const ultimaLinea = textoHastaCursor.split("\n").pop();
  if (ultimaLinea.includes("#")) return null;

  const match = textoHastaCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
  return match ? { palabra: match[1], inicio: pos - match[1].length, fin: pos } : null;
}

function mostrarAutocomplete() {
  if (window.innerWidth < 768 || suprimirPopup) {
    suprimirPopup = false;
    ocultarAutocomplete();
    return;
  }

  const obj = obtenerPalabraActual();
  if (!obj || obj.palabra.length < 2) {
    ocultarAutocomplete();
    return;
  }

  const query = obj.palabra.toLowerCase();
  const catalogo = [...extraerVariablesUsuario(editor.value), ...CATALOGO_COMPLETO];
  const vistos = new Set();
  const resultados = [];

  for (const item of catalogo) {
    const trig = item.trigger.toLowerCase();
    if (vistos.has(trig)) continue;
    vistos.add(trig);

    if (trig.startsWith(query)) {
      resultados.push({ item, exact: trig === query ? 0 : 1 });
    }
  }

  if (resultados.length === 0 || (resultados.length === 1 && resultados[0].exact === 0)) {
    ocultarAutocomplete();
    return;
  }

  resultados.sort((a, b) => a.exact - b.exact);
  sugerenciasActivas = resultados.slice(0, 7).map(r => r.item);
  indiceSeleccionado = 0;
  usuarioNavegoConFlechas = false;

  renderizarPopup();
  posicionarPopup();
  popup.style.display = "block";
}

function renderizarPopup() {
  popup.innerHTML = sugerenciasActivas.map((s, idx) => `
    <div class="ac-item ${idx === indiceSeleccionado ? 'selected' : ''}" data-index="${idx}">
      <div class="ac-main">
        <i class="bi bi-code-slash ac-icon"></i>
        <span class="fw-bold">${s.label}</span>
        <small class="ac-desc">${s.desc}</small>
      </div>
      <span class="ac-badge" data-tipo="${s.type}">${s.type}</span>
    </div>
  `).join("");

  popup.querySelectorAll(".ac-item").forEach(el => {
    el.onmousedown = (e) => {
      e.preventDefault();
      aplicarSnippet(sugerenciasActivas[parseInt(el.dataset.index)]);
    };
  });
}

function posicionarPopup() {
  if (window.innerWidth < 768) {
    ocultarAutocomplete();
    return;
  }
  const pos = editor.selectionStart;
  const textoHastaCursor = editor.value.substring(0, pos);
  const numLineas = textoHastaCursor.split("\n").length;
  const col = textoHastaCursor.split("\n").pop().length;

  const lineHeight = fontSizeEditor * 1.55;
  const charWidth = fontSizeEditor * 0.60;

  let top = (numLineas * lineHeight) - editor.scrollTop + 14;
  let left = (col * charWidth) - editor.scrollLeft + 14;

  const maxTop = Math.max(10, editor.clientHeight - 240);
  const maxLeft = Math.max(10, editor.clientWidth - 340);

  popup.style.top = `${Math.max(10, Math.min(top, maxTop))}px`;
  popup.style.left = `${Math.max(10, Math.min(left, maxLeft))}px`;
}

function ocultarAutocomplete() {
  popup.style.display = "none";
  sugerenciasActivas = [];
  usuarioNavegoConFlechas = false;
}

function aplicarSnippet(snippet) {
  const obj = obtenerPalabraActual();
  if (!obj) {
    ocultarAutocomplete();
    return;
  }

  const antes = editor.value.substring(0, obj.inicio);
  const despues = editor.value.substring(obj.fin);

  let textoInsertar = snippet.text;
  let offset = textoInsertar.indexOf("$0");
  if (offset !== -1) {
    textoInsertar = textoInsertar.replace("$0", "");
  } else {
    offset = textoInsertar.length;
  }

  editor.value = antes + textoInsertar + despues;
  editor.selectionStart = editor.selectionEnd = obj.inicio + offset;

  suprimirPopup = true;
  ocultarAutocomplete();
  actualizarContador();
  sincronizarPrism();
}

// =======================================================
// TECLADO (TAB / ENTER / SÍMBOLOS)
// =======================================================
editor.addEventListener("keydown", (e) => {
  const abierto = popup.style.display === "block" && sugerenciasActivas.length > 0;

  if (e.key === "Escape") {
    if (abierto) {
      e.preventDefault();
      ocultarAutocomplete();
      suprimirPopup = true;
      return;
    }
  }

  if (abierto) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      usuarioNavegoConFlechas = true;
      indiceSeleccionado = (indiceSeleccionado + 1) % sugerenciasActivas.length;
      renderizarPopup();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      usuarioNavegoConFlechas = true;
      indiceSeleccionado = (indiceSeleccionado - 1 + sugerenciasActivas.length) % sugerenciasActivas.length;
      renderizarPopup();
      return;
    }
  }

  if (e.key === "Tab") {
    if (abierto) {
      e.preventDefault();
      aplicarSnippet(sugerenciasActivas[indiceSeleccionado]);
      return;
    } else {
      e.preventDefault();
      const pos = editor.selectionStart;
      editor.value = editor.value.substring(0, pos) + "    " + editor.value.substring(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = pos + 4;
      actualizarContador();
      sincronizarPrism();
      return;
    }
  }

  if (e.key === "Enter") {
    if (abierto && usuarioNavegoConFlechas) {
      e.preventDefault();
      aplicarSnippet(sugerenciasActivas[indiceSeleccionado]);
      return;
    }

    if (abierto) ocultarAutocomplete();

    const pos = editor.selectionStart;
    const lineaActual = editor.value.substring(0, pos).split("\n").pop();
    let sangria = (lineaActual.match(/^(\s*)/) || [""])[1];

    if (lineaActual.trim().endsWith(":")) {
      sangria += "    ";
    }

    e.preventDefault();
    editor.value = editor.value.substring(0, pos) + "\n" + sangria + editor.value.substring(pos);
    editor.selectionStart = editor.selectionEnd = pos + 1 + sangria.length;
    actualizarContador();
    sincronizarPrism();
    return;
  }

  if (e.key === " " || ["=", ":", "(", ")", "[", "]", "{", "}", ",", "+", "-", "*", "/"].includes(e.key)) {
    if (abierto) ocultarAutocomplete();
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    if (abierto) ocultarAutocomplete();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    if (!document.getElementById("btn-run").disabled) ejecutarPython();
  }
});

editor.addEventListener("input", () => {
  if (rafEditorSync) cancelAnimationFrame(rafEditorSync);
  rafEditorSync = requestAnimationFrame(() => {
    sincronizarEditorOptimizado();
    if (window.innerWidth >= 768) {
      mostrarAutocomplete();
    } else {
      ocultarAutocomplete();
    }
  });
});

editor.addEventListener("click", () => {
  ocultarAutocomplete();
});

editor.addEventListener("scroll", () => {
  highlightLayer.scrollTop = editor.scrollTop;
  highlightLayer.scrollLeft = editor.scrollLeft;
  lineas.scrollTop = editor.scrollTop;
  ocultarAutocomplete();
});
