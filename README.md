# 🐍 JPV PyStudio // WebAssembly Pro Studio
### *Estación de Trabajo Analítica, Ciencia de Datos y Desarrollo Python 100% en el Navegador*

<div align="center">

[![Demo en Vivo](https://img.shields.io/badge/🚀%20Demo%20en%20Vivo-GitHub%20Pages-00f2fe?style=for-the-badge&logo=github&logoColor=black)](https://juancitopena.github.io/JPV_PyStudio/)
[![Python](https://img.shields.io/badge/Python-3.12%20(WebAssembly)-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://pyodide.org/en/stable/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-10b981?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/JUANCITOPENA/JPV_PyStudio?style=for-the-badge&color=f59e0b&logo=apachespark&logoColor=black)](https://github.com/JUANCITOPENA/JPV_PyStudio/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/JUANCITOPENA/JPV_PyStudio?style=for-the-badge&color=8b5cf6&logo=git&logoColor=white)](https://github.com/JUANCITOPENA/JPV_PyStudio/network/members)

**Cero instalaciones • Cero configuraciones • Cero servidores backend • 100% Privacidad en el Cliente**

[🌐 Probar JPV PyStudio en Vivo](https://juancitopena.github.io/JPV_PyStudio/) • [📖 Documentación y Guía](#-por-qu%C3%A9-jpv-pystudio-para-estudiantes-y-practicantes) • [⭐ Dar una Estrella](https://github.com/JUANCITOPENA/JPV_PyStudio) • [👨‍💻 Sobre el Autor](#-autor--arquitectura-institucional-neo-brutalista)

</div>

---

## 📌 ¿Por qué JPV PyStudio? Para Estudiantes, Practicantes y Docentes

El mayor obstáculo que enfrenta un estudiante, docente o profesional al aprender **Python y Ciencia de Datos** no es la lógica de programación: es el **infierno de la configuración del entorno local (*Environment Setup Hell*)**:

- Conflictos entre versiones de Python en el sistema operativo.
- Entornos virtuales corruptos (`venv`, `conda`) y fallos de compilación con `pip install`.
- Restricciones de permisos de administrador en computadoras de laboratorios escolares, bibliotecas o PCs corporativas.
- Laptops de bajos recursos donde instalar suites pesadas o contenedores Docker paraliza la máquina.
- Dependencia de servidores remotos (Google Colab, Binder) que sufren desconexiones por inactividad, colas de espera, consumen datos móviles y exigen crear cuentas o iniciar sesión.

### 🎯 La Solución: Abrir el navegador y codificar al instante
**JPV PyStudio** democratiza el acceso a la computación científica transformando cualquier navegador moderno (Google Chrome, Edge, Safari, Firefox) en una **estación de trabajo completa y autónoma**. No requiere instalar ningún ejecutable, no consume recursos en la nube y funciona de forma inmediata:

1. **Abres la URL** en tu navegador.
2. **Escribes tu código Python** o seleccionas plantillas preconstruidas (*Pandas, Folium, Plotly, Seaborn, NetworkX, WordCloud, Excel*).
3. **Pulsas `Ejecutar` (`Ctrl + Enter`)**: el motor compila y procesa los datos en la memoria RAM de tu propio equipo.
4. **Visualizas resultados**: tablas interactivas, consolas de salida, mapas geoespaciales y gráficos estadísticos sincronizados.
5. **Exportas tu trabajo**: descarga datasets limpios en CSV/Excel, imágenes gráficas y **capturas fotográficas completas del código en PNG HD** para tareas, investigaciones o redes.

---

## 🚀 Capacidades y Características Principales

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             JPV PyStudio                                    │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │   Panel Editor de Código      │  │    Panel Salida Multiformato       │  │
│  │  • Sintaxis Prism Okaidia     │  │  • Consola interactiva (input())   │  │
│  │  • Autocompletado inteligente │  │  • Tablas paginadas CSV/Excel      │  │
│  │  • Auto-detección AST         │  │  • Visor Gráfico (Pan & Zoom)      │  │
│  │  • 📸 Captura Global PNG HD   │  │  • Mapas Folium & Dashboards HTML  │  │
│  └───────────────────────────────┘  └────────────────────────────────────┘  │
│         ▲                                         ▲                         │
│         └─────────── Motor WebAssembly (Pyodide) ─┘                         │
│                      (CPython 3.12 nativo en RAM)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. 📊 Stack Científico y Analítico de Clase Mundial
Ejecuta directamente las librerías estándar de la industria científica:
- **Manipulación de Datos:** `pandas`, `numpy`, `scipy`, `statsmodels`, `sympy`.
- **Visualización Estadística:** `matplotlib` y `seaborn` con renderizado adaptativo (fondos Negro, Blanco y Transparente) y animaciones GIF (`FuncAnimation`).
- **Dashboards Interactivos:** `plotly` (`plotly.express`, `plotly.graph_objects`), `altair`, `bokeh`.
- **Geointeligencia & Mapas:** `folium` y plugins (`AntPath`, `HeatMap`, `MarkerCluster`, `MiniMap`).
- **Grafos & Topología de Redes:** `networkx`, `pyvis` (rutas mínimas, centralidad, algoritmos de Dijkstra).
- **Procesamiento de Lenguaje Natural:** `wordcloud` para nubes de palabras de alta definición.
- **Machine Learning Integrado:** `scikit-learn` (`sklearn`) para regresión, clasificación y agrupamiento (*clustering*).
- **Ofimática Empresarial:** `openpyxl` y `xlsxwriter` para lectura y escritura de libros Excel multicapa (`.xlsx`).

### 2. ⚡ Auto-Instalador Inteligente de Dependencias (AST)
El motor incorpora un analizador sintáctico en Python (`ast.walk`) que escanea en milisegundos las declaraciones `import` y `from ... import` del código escrito por el usuario. Si detecta librerías requeridas que aún no están en memoria, **las descarga e instala automáticamente desde PyPI/Pyodide (`micropip`)** sin que el usuario tenga que ejecutar comandos de terminal manuales.

### 3. 📸 Captura Global del Código en Imagen PNG HD (Nueva Función)
Exporta tu código completo en una **imagen fotográfica de alta resolución (2x Retina)** lista para presentar en tareas académicas, artículos técnicos, diapositivas o redes sociales:
- **Ventana de Estilo macOS:** Marco elegante con botones circulares de control, título del script e insignia Python Wasm.
- **100% de Líneas Incluidas:** Captura la totalidad del código fuente, incluso las líneas ocultas por el scroll del editor.
- **Personalización Visual:**
  - *Fondos/Marcos:* Neón Nocturno (Gradiente), Cyan Studio, Dark Studio Puro, Blanco Limpio o Transparente.
  - *Interruptores:* Números de línea, barra de ventana macOS y pie de firma institucional JPV.
- **Exportación Dual:** Descarga directa en `.png` o botón de *Copiar al Portapapeles* (`Ctrl + V`) en un solo clic.

### 4. 📁 Sistema de Archivos Virtual (VFS) & Drag & Drop
- Arrastra archivos locales (`.csv`, `.xlsx`, `.json`, `.parquet`, `.txt`) directamente desde tu PC a la ventana del editor; el sistema los inyecta en el disco virtual de Pyodide para leerlos de inmediato con `pd.read_csv("archivo.csv")`.
- Administrador gráfico de archivos en memoria con descarga inmediata de vuelta a la PC.

### 5. 🛡️ Privacidad Absoluta (Zero-Knowledge Architecture)
Al no existir ningún servidor backend procesando el código:
- Tus datos, contraseñas, tokens de API y datasets confidenciales **nunca salen de tu navegador**.
- No hay almacenamiento en servidores de terceros ni riesgo de fuga de datos (GDPR / DGII Compliance).

---

## 🔬 ¿Por qué usamos Pyodide (WebAssembly)?

[Pyodide](https://pyodide.org/en/stable/) es el proyecto de referencia de la **Python Software Foundation** y la comunidad de código abierto para llevar el runtime oficial de **CPython** al estándar **WebAssembly (Wasm)** mediante la cadena de herramientas de **Emscripten**.

### ¿Qué nos ofrece Pyodide en JPV PyStudio?
1. **CPython Real en WebAssembly:** No es un intérprete recortado ni una reimplementación parcial; es CPython 3.12 compilado a binarios Wasm, manteniendo compatibilidad total con la semántica del lenguaje.
2. **Paquetes con Extensiones C/C++/Fortran:** A diferencia de proyectos que solo admiten Python puro, Pyodide incluye compilaciones optimizadas de bibliotecas pesadas en C como `numpy`, `scipy` y `pandas`.
3. **Puente Bidireccional Python ⇄ JavaScript:** Permite interactuar con el DOM del navegador, renderizar mapas `folium` en iframes en vivo, manipular gráficos SVG/Canvas y gestionar descargas nativas sin intermediarios.
4. **Aislamiento Seguro en Sandbox:** El código Python se ejecuta dentro del sandbox de seguridad del navegador, impidiendo accesos no autorizados al sistema operativo del usuario.

### ⚖️ Comparativa: JPV PyStudio frente a otras opciones

| Solución | Servidor Requerido | Soporte Pandas/NumPy | Tiempo de Inicio | Requiere Registro | Ideal para Practicar Rápido | Captura de Código PNG |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **🐍 JPV PyStudio (Pyodide)** | ❌ **No (100% Cliente)** | ✅ **Completo (Wasm)** | ⚡ **1-2 segundos** | ❌ **No** | 🌟 **Óptimo (IDE Clásico)** | ✅ **Sí (Nativo HD)** |
| **JupyterLite** | ❌ No (Cliente) | ✅ Completo | ⏳ 8-15 segundos | ❌ No | ⚠️ Complejo (Notebooks) | ❌ Requiere plugins |
| **Brython / Skulpt** | ❌ No (Cliente) | ❌ Muy limitado (Sin C) | ⚡ Instantáneo | ❌ No | ❌ No apto para Data Science | ❌ No |
| **Google Colab** | ✅ Sí (Cloud VM) | ✅ Completo | ⏳ 15-30 segundos | ✅ Sí (Cuenta Google) | ⚠️ Lento / Desconexiones | ❌ Extensiones ajenas |
| **Python Local (VS Code)** | ❌ No (Local) | ✅ Completo | ⏳ Horas de setup | ❌ No | ⚠️ Alto soporte técnico | ❌ Manual |

---

## 🧩 Filosofía de Ingeniería: ¿Por qué HTML5, CSS y JavaScript Vanilla?

En una era donde las herramientas web sufren de hipertrofia (*overengineering*) con cadenas de construcción gigantescas (`node_modules`, bundlers que pesan cientos de megabytes, configuraciones de TypeScript complejas), **JPV PyStudio** adopta el principio de diseño de la **Gobernanza Empresarial JPV**:

> *"La máxima sofisticación de la ingeniería de software es la simplicidad, la resiliencia y la durabilidad temporal."*

- **Despliegue Instantáneo en Servidores Estáticos:** Puede servirse desde GitHub Pages, AWS S3, Cloudflare Pages o abrirse localmente como un archivo `index.html` sin necesidad de servidores Node.js.
- **Cero Costo de Infraestructura:** El creador o la institución educativa gasta **$0 mensuales en servidores**, sin importar si acceden 10 estudiantes o 100,000 usuarios en simultáneo.
- **Auditable y Didáctico:** Todo el código fuente del frontend es legible, transparente y puede ser estudiado directamente por estudiantes para comprender cómo interactúan WebAssembly, Prism.js, Bootstrap y la API de Canvas.
- **Resiliencia Extrema:** Sin dependencias frágiles que rompan el proyecto en futuras versiones de Node o empaquetadores.

---

## 🗺️ Roadmap de Escalamiento e Innovación Futura

- [x] Motor Pyodide v0.26.1 con soporte CPython 3.12.
- [x] Auto-detección sintáctica de dependencias vía AST.
- [x] Visor de gráficos unificado con fondos transparente/blanco/negro y descarga PNG.
- [x] Sistema de Archivos Virtual (VFS) con drag & drop de archivos CSV/Excel.
- [x] **Captura Global del Código en Imagen PNG HD (2x Retina con temas y marcos).**
- [ ] **Soporte PWA Offline-First:** Almacenamiento en caché de paquetes WebAssembly mediante Service Workers para programar en aviones o zonas sin internet.
- [ ] **Integración de DuckDB-Wasm:** Consultas SQL analíticas ultrarrápidas sobre archivos Parquet y CSV de gigabytes en la RAM del navegador.
- [ ] **Soporte de WebGPU:** Inferencia de modelos pequeños de lenguaje (LLMs / SLMs locales) para autocompletado y tutoría de código asistida por IA local.
- [ ] **Exportación a Cuadernos Jupyter (.ipynb):** Conversión bidireccional entre scripts `.py` y notebooks `.ipynb`.

---

## 👨‍💻 Autor & Arquitectura Institucional (Neo-Brutalista)

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ING. JUANCITO PEÑA VIZCAÍNO                           │
│  ┌───────────────────────┐  Ingeniero en Sistemas y Computación             │
│  │                       │  Postgrado en Ingeniería de Software             │
│  │        [ FOTO ]       │  Maestría en Sistemas Mención Gerencial          │
│  │                       │  Universidad Dominicana O&M                      │
│  └───────────────────────┘  Más de 15 años de trayectoria profesional       │
│  [Data Analyst]  [Full Stack Dev]  [AI & API Expert]  [Líder I+D+i]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

</div>

<table align="center" style="border: 3px solid #000000; box-shadow: 6px 6px 0px #000000; background-color: #ffffff; border-radius: 8px; max-width: 900px; width: 100%; border-collapse: separate;">
  <tr>
    <td style="padding: 24px; vertical-align: top; width: 65%; border-right: 2px solid #000000; background-color: #ffffff;">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <img 
          src="https://avatars.githubusercontent.com/u/38921558?v=4" 
          alt="Ing. Juancito Peña Vizcaíno" 
          style="width: 90px; height: 90px; border-radius: 50%; border: 3px solid #000000; box-shadow: 3px 3px 0px #000000; object-fit: cover;"
        >
        <div>
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #000000;">Ing. Juancito Peña Vizcaíno</h2>
          <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px;">
            <span style="background: #000000; color: #ffffff; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px;">Data Analyst</span>
            <span style="background: #da291c; color: #ffffff; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px;">Full Stack Dev</span>
            <span style="background: #0d6efd; color: #ffffff; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px;">AI & API Expert</span>
            <span style="background: #ffc107; color: #000000; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; border: 1px solid #000000;">Líder I+D+i</span>
          </div>
        </div>
      </div>
      <p style="color: #0f172a; font-size: 13.5px; line-height: 1.65; margin-bottom: 12px; font-weight: 500;">
        <strong>Ingeniero en Sistemas y Computación</strong> con Postgrado en <strong>Ingeniería de Software</strong> y Maestría en <strong>Sistemas Mención Gerencial</strong> (<em>Universidad Dominicana O&amp;M</em>). Con más de <strong>15 años de trayectoria</strong>, transformo problemas de alta complejidad en soluciones escalables. Durante el último año, he centrado mi trabajo en <strong>I+D+i (Investigación, Desarrollo e Innovación)</strong>, explorando arquitecturas de <strong>IA Generativa (RAG / LLMs)</strong>, integración de agentes autónomos con bases de datos y orquestación de APIs empresariales.
      </p>
      <p style="color: #0f172a; font-size: 13.5px; line-height: 1.65; margin: 0; font-weight: 500;">
        🔬 <strong>Mi motor es el aprendizaje a través de los retos:</strong> me apasionan los <em>casos de uso reales</em>, las <strong>pruebas técnicas rigurosas</strong>, la investigación profunda y el diseño de soluciones directas a problemas de ingeniería. 🎓 Como <strong>docente universitario</strong> y creador del canal educativo <strong><a href="https://www.youtube.com/@JuancitoDevV" target="_blank" style="color: #da291c; font-weight: bold; text-decoration: underline;">@JuancitoDevV</a></strong>, comparto este conocimiento práctico mediante ejercicios y proyectos de código abierto para acercar la tecnología a problemas reales. 🚀
      </p>
    </td>
    <td style="padding: 24px; vertical-align: top; width: 35%; background-color: #f8fafc;">
      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 6px;">
        🌐 Canales y Conexión Oficial
      </h3>
      <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 13px;">
        <li style="margin-bottom: 10px;">
          <a href="https://www.linkedin.com/in/juancitope%C3%B1a/" target="_blank" style="text-decoration: none; color: #0d6efd; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>💼</span> LinkedIn Oficial
          </a>
        </li>
        <li style="margin-bottom: 10px;">
          <a href="https://www.youtube.com/@JuancitoDevV" target="_blank" style="text-decoration: none; color: #da291c; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>▶️</span> YouTube (@JuancitoDevV)
          </a>
        </li>
        <li style="margin-bottom: 10px;">
          <a href="https://github.com/JUANCITOPENA" target="_blank" style="text-decoration: none; color: #000000; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>🐙</span> GitHub (@JUANCITOPENA)
          </a>
        </li>
        <li style="margin-bottom: 10px;">
          <a href="https://twitter.com/JuancitoPenaV" target="_blank" style="text-decoration: none; color: #1da1f2; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>🐦</span> X (Twitter) Oficial
          </a>
        </li>
        <li>
          <a href="mailto:juancito.pena@gmail.com" style="text-decoration: none; color: #059669; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>✉️</span> Correo Institucional
          </a>
        </li>
      </ul>
      <div style="background-color: #fef08a; border: 2px solid #000000; padding: 10px; border-radius: 6px; box-shadow: 2px 2px 0px #000000; font-size: 11.5px; color: #000000; font-weight: 600;">
        💡 <strong>Código Abierto para la Educación:</strong> Si este proyecto te sirve en tus clases o proyectos, compártelo con tu comunidad.
      </div>
    </td>
  </tr>
</table>

---

## 🌟 ¡Apoya este Proyecto! (Community & Call to Action)

Si **JPV PyStudio** te ha sido útil para practicar, aprender, enseñar o construir soluciones rápidas:

1. **Deja tu Estrellita en GitHub:** Haz clic en el botón [⭐ Star](https://github.com/JUANCITOPENA/JPV_PyStudio) en la parte superior derecha del repositorio para ayudar a que más personas lo descubran.
2. **Haz un Fork 🍴:** Clona el proyecto en tu propia cuenta de GitHub, personalízalo para tu universidad o centro de cómputo y añade nuevos ejemplos.
3. **Compártelo con tu Comunidad 📢:** Envíalo a grupos de estudiantes de Python, foros de programación, comunidades de Ciencia de Datos y a tus profesores.
4. **Reporta Ideas y Sugerencias 💡:** ¿Quieres ver una librería científica adicional soportada? Abre un [Issue en GitHub](https://github.com/JUANCITOPENA/JPV_PyStudio/issues) con tus aportes.

<div align="center">

```
  ★ Si te gustó el proyecto, regálanos una estrella en GitHub ★
  https://github.com/JUANCITOPENA/JPV_PyStudio
```

</div>

---

## 📄 Licencia

Este proyecto se encuentra publicado bajo la licencia **MIT**. Eres libre de usarlo, estudiarlo, modificarlo y distribuirlo para fines académicos, personales o comerciales citando la autoría original de **Ing. Juancito Peña Vizcaíno**. Consulta el archivo [LICENSE](LICENSE) para mayores detalles.

<div align="center">

<sub>Construido con dedicación para la comunidad tecnológica y educativa internacional • <strong>JPV PyStudio Pro</strong></sub>

</div>
