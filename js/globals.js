// =======================================================
// JPV PYSTUDIO - VARIABLES GLOBALES Y ELEMENTOS DOM
// =======================================================
let pyodideInstance = null;
let currentPlotB64 = "";

// Estados
let fontSizeEditor = 13;
let fontSizeConsola = 12;
let scaleGrafico = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

let suprimirPopup = false;
let usuarioNavegoConFlechas = false;

// Elementos DOM
const editor = document.getElementById("codigo-editor");
const highlightCode = document.getElementById("highlight-code");
const highlightLayer = document.getElementById("highlight-layer");
const lineas = document.getElementById("lineas");
const popup = document.getElementById("autocomplete-popup");
const terminal = document.getElementById("tab-terminal");
const terminalContainer = document.getElementById("tab-terminal-container");
const btnDlPlot = document.getElementById("btn-dl-plot");
const estadoCsv = document.getElementById("estado-csv");
const dragOverlay = document.getElementById("drag-overlay");


let plotsBase64 = {
  transparente: "",
  blanco: "",
  negro: ""
};
let fondoGraficoActual = "negro";

let currentPlotType = "png";
let currentPlotFilename = "";
let currentHtmlContent = "";
let currentHtmlBlobUrl = "";
