# 🐍 JPV PyStudio // WebAssembly Pro Studio

[![GitHub Pages](https://img.shields.io/badge/Demo-En%20Vivo%20(GitHub%20Pages)-00f2fe?style=for-the-badge&logo=github)](https://juancitopena.github.io/JPV_PyStudio/)
[![Python](https://img.shields.io/badge/Python-3.12%20(WebAssembly)-blue?style=for-the-badge&logo=python)](https://pyodide.org/)
[![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](LICENSE)

Entorno de desarrollo interactivo (IDE) y estudio analítico de datos de alto rendimiento ejecutado **100% en el navegador del cliente** mediante **WebAssembly (Pyodide v0.26.1)**. Sin servidores backend, sin instalaciones locales, con privacidad total y potencia nativa.

🔗 **Acceso en vivo:** [https://juancitopena.github.io/JPV_PyStudio/](https://juancitopena.github.io/JPV_PyStudio/)

---

## 🚀 Capacidades y Características Principales

- **📊 Stack Analítico y de Visualización Avanzada:**
  - `folium` y `folium.plugins` (`AntPath`, `MiniMap`, `Fullscreen`, `HeatMap`, `MarkerCluster`) para mapas geoespaciales interactivos en vivo.
  - `plotly` (`plotly.express`, `plotly.graph_objects`) para dashboards interactivos HTML y gráficos multidimensionales.
  - `seaborn` y `matplotlib` para visualización estadística avanzada y animaciones GIF (`PillowWriter`, `FuncAnimation`).
  - `networkx`, `pyvis` y `wordcloud` para grafos de redes, topologías, rutas óptimas (Dijkstra) y nubes de palabras HD.
  - `altair`, `bokeh` y `squarify` para gráficos declarativos interactivos y Treemaps.
  - `pandas`, `numpy`, `scipy`, `statsmodels` y `sympy` para ciencia de datos, estadística y matemática simbólica.
  - `openpyxl` y `xlsxwriter` para lectura y generación de libros Excel multicapa (`.xlsx`).
  - `requests` con conectores HTTPS parcheados (`pyodide-http`) para consumo de APIs REST en vivo.
- **🤖 Machine Learning Integrado:**
  - Compatible con `scikit-learn` (`sklearn`) para modelos de regresión, clasificación y clustering.
- **⚡ Auto-Instalador AST Nativo de Dependencias:**
  - Antes de ejecutar el código, el motor inspecciona el árbol sintáctico (`ast.walk`) de todos los `import` y descarga automáticamente cualquier librería requerida desde PyPI / Pyodide (`micropip`) sin intervención manual.
- **🖥️ Visor Multiformato en Vivo (HTML Interactivo, GIF Animado y PNG Adaptativo):**
  - Renderiza automáticamente mapas interactivos (`folium`), dashboards (`plotly`/`altair`/`bokeh`), animaciones (`.gif`) y gráficos estáticos (`.png` con modos de fondo Negro, Blanco y Transparente), con opción de abrir en pestaña completa o descargar en 1 clic.
- **📁 Sistema de Archivos Virtual (VFS) & Drag & Drop:**
  - Arrastra archivos `.csv`, `.xlsx` o `.json` directo al editor para procesarlos de inmediato.
  - Explorador y gestor de archivos en memoria con descarga a la PC en un clic.
- **🎨 Experiencia Visual & UX:**
  - Interfaz Cyber Dark inspirada en consolas ejecutivas.
  - Visor gráfico con paneo, zoom fluido (40% a 400%) y descarga en PNG de alta resolución.
  - Entrada de datos interactiva (`input()`) nativa sobre la consola.

---

## 🛠️ Tecnologías

- **Runtime:** Pyodide 0.26.1 (Emscripten / WebAssembly)
- **Frontend:** HTML5, CSS Grid / Flexbox, Bootstrap 5, Prism.js (Tema Okaidia), Bootstrap Icons
- **Tipografía:** JetBrains Mono & Outfit (Google Fonts)

---

## 👨‍💻 Autor & Arquitectura

Desarrollado y optimizado por **Ing. Juancito Peña** bajo estándares de **Gobernanza Empresarial de Desarrollo de Software**.
