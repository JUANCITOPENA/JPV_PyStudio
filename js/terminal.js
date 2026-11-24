// =======================================================
// ENTRADA Y SALIDA NATIVA EN TERMINAL
// =======================================================
window.escribirEnTerminal = function(texto) {
  terminal.textContent += texto;
  terminalContainer.scrollTop = terminalContainer.scrollHeight;
};

window.solicitarInputTerminal = function(promptText) {
  return new Promise((resolve) => {
    if (promptText) {
      terminal.textContent += promptText;
    }

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.className = "terminal-inline-input";
    inputField.autocomplete = "off";
    inputField.spellcheck = false;

    terminal.appendChild(inputField);
    inputField.focus();
    terminalContainer.scrollTop = terminalContainer.scrollHeight;

    const refocuser = () => inputField.focus();
    terminalContainer.addEventListener("click", refocuser);

    inputField.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const valor = inputField.value;

        terminalContainer.removeEventListener("click", refocuser);
        terminal.removeChild(inputField);

        terminal.textContent += valor + "\n";
        terminalContainer.scrollTop = terminalContainer.scrollHeight;

        resolve(valor);
      }
    });
  });
};
