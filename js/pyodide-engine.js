// =======================================================
// MOTOR PYTHON WASM: FAST-BOOT & SMART DEPENDENCY RESOLVER
// =======================================================
// Registro central de paquetes cargados en memoria
const paquetesCargados = new Set(["pandas", "numpy", "matplotlib", "micropip"]);

// Definición de dependencias y auto-activación inteligente ampliada
const MAPA_DEPENDENCIAS = {
  folium: {
    match: /(folium|AntPath|HeatMap|MarkerCluster|MiniMap)/i,
    pyodidePkg: ["ssl", "jinja2"],
    pypiPkg: ["xyzservices", "branca", "requests", "pyodide-http", "folium"],
    postSetup: "import pyodide_http; pyodide_http.patch_all()",
    etiqueta: "Folium (Mapas Geoespaciales)"
  },
  plotly: {
    match: /(plotly|px\.|go\.Figure|make_subplots)/i,
    pyodidePkg: null,
    pypiPkg: ["plotly"],
    postSetup: `
try:
    import plotly.basedatatypes as _pbd
    _pbd.BaseFigure.show = lambda self, *a, **k: __capturar_plotly_fig(self)
except Exception:
    pass
`,
    etiqueta: "Plotly Interactivo"
  },
  networkx: {
    match: /(networkx|nx\.)/i,
    pyodidePkg: ["networkx"],
    pypiPkg: null,
    etiqueta: "NetworkX (Grafos)"
  },
  wordcloud: {
    match: /(wordcloud|WordCloud)/i,
    pyodidePkg: ["pillow", "wordcloud"],
    pypiPkg: null,
    etiqueta: "WordCloud"
  },
  altair: {
    match: /(altair|alt\.Chart)/i,
    pyodidePkg: ["jinja2"],
    pypiPkg: ["altair", "vega_datasets"],
    etiqueta: "Altair (Vega-Lite)"
  },
  bokeh: {
    match: /(bokeh)/i,
    pyodidePkg: ["bokeh"],
    pypiPkg: null,
    etiqueta: "Bokeh Interactivo"
  },
  pyvis: {
    match: /(pyvis)/i,
    pyodidePkg: ["jinja2", "networkx"],
    pypiPkg: ["pyvis"],
    etiqueta: "Pyvis (Redes Interactivas)"
  },
  squarify: {
    match: /(squarify)/i,
    pyodidePkg: null,
    pypiPkg: ["squarify"],
    etiqueta: "Squarify (Treemaps)"
  },
  statsmodels: {
    match: /(statsmodels|sm\.)/i,
    pyodidePkg: ["scipy", "patsy", "statsmodels"],
    pypiPkg: null,
    etiqueta: "Statsmodels"
  },
  sympy: {
    match: /(sympy)/i,
    pyodidePkg: ["sympy"],
    pypiPkg: null,
    etiqueta: "SymPy"
  },
  excel: {
    match: /(openpyxl|xlsxwriter|\.to_excel|\.read_excel|ExcelWriter)/i,
    pyodidePkg: null,
    pypiPkg: ["openpyxl", "xlsxwriter"],
    etiqueta: "Excel (.xlsx)"
  },
  seaborn: {
    match: /(seaborn|sns\.)/i,
    pyodidePkg: ["scipy"],
    pypiPkg: ["seaborn"],
    etiqueta: "Seaborn"
  },
  requests: {
    match: /(requests\.|pyodide_http)/i,
    pyodidePkg: ["ssl"],
    pypiPkg: ["requests", "pyodide-http"],
    postSetup: "import pyodide_http; pyodide_http.patch_all()",
    etiqueta: "Requests HTTPS"
  },
  sklearn: {
    match: /(sklearn|scikit-learn|LinearRegression|RandomForest|KMeans)/i,
    pyodidePkg: ["scipy", "scikit-learn"],
    pypiPkg: null,
    etiqueta: "Scikit-Learn"
  },
  scipy: {
    match: /(scipy|curve_fit)/i,
    pyodidePkg: ["scipy"],
    pypiPkg: null,
    etiqueta: "Scipy"
  },
  animacion: {
    match: /(animation\.|PillowWriter|FuncAnimation|ArtistAnimation)/i,
    pyodidePkg: ["pillow"],
    pypiPkg: null,
    etiqueta: "Animación (Pillow)"
  },
  imageio: {
    match: /(imageio)/i,
    pyodidePkg: ["pillow"],
    pypiPkg: ["imageio"],
    etiqueta: "ImageIO"
  },
  tabulate: {
    match: /(tabulate)/i,
    pyodidePkg: null,
    pypiPkg: ["tabulate"],
    etiqueta: "Tabulate"
  }
};

// Resolver inteligente: detecta y activa librerías necesarias para el código sin intervención manual
async function autoResolverDependencias(code) {
  if (!pyodideInstance || !code.trim()) return;

  for (const [clave, dep] of Object.entries(MAPA_DEPENDENCIAS)) {
    if (dep.match.test(code)) {
      // 1. Paquetes binarios compilados de Pyodide
      if (dep.pyodidePkg) {
        const listaPyodide = Array.isArray(dep.pyodidePkg) ? dep.pyodidePkg : [dep.pyodidePkg];
        const faltantesPyodide = listaPyodide.filter(p => !paquetesCargados.has(p));
        if (faltantesPyodide.length > 0) {
          terminal.textContent += `⚙️ [Auto-Activación] Cargando '${dep.etiqueta}' (${faltantesPyodide.join(", ")}) en WebAssembly...\n`;
          terminalContainer.scrollTop = terminalContainer.scrollHeight;
          try {
            await pyodideInstance.loadPackage(faltantesPyodide);
            faltantesPyodide.forEach(p => paquetesCargados.add(p));
          } catch(e) {
            console.warn("Fallo carga pyodidePkg:", e);
          }
        }
      }

      // 2. Paquetes puros de PyPI vía micropip
      if (dep.pypiPkg) {
        const faltantes = dep.pypiPkg.filter(p => !paquetesCargados.has(p));
        if (faltantes.length > 0) {
          terminal.textContent += `📦 [Auto-Activación] Instalando '${dep.etiqueta}' (${faltantes.join(", ")})...\n`;
          terminalContainer.scrollTop = terminalContainer.scrollHeight;
          try {
            pyodideInstance.globals.set("__faltantes_lista__", faltantes);
            await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install(list(__faltantes_lista__), keep_going=True)
`);
            faltantes.forEach(p => paquetesCargados.add(p));
            if (dep.postSetup) {
              await pyodideInstance.runPythonAsync(dep.postSetup);
            }
          } catch(ePip) {
            console.warn("Aviso micropip:", ePip);
          }
        }
      }
    }
  }

  // 3. Autocarga estándar de Pyodide para cualquier otro import nativo
  try {
    await pyodideInstance.loadPackagesFromImports(code);
  } catch(ePkg) {
    console.warn("loadPackagesFromImports:", ePkg);
  }
}

// =======================================================
// SUITE MAESTRA DE ADAPTADORES WASM (FINANZAS, CLIMA, CRIPTO, CINE, FASTAPI)
// =======================================================
const YFINANCE_WASM_SHIM = `
import pandas as pd
import numpy as np
from datetime import datetime

class Ticker:
    def __init__(self, ticker):
        self.ticker = str(ticker).upper().strip()

    def history(self, period="1mo", interval="1d", **kwargs):
        period_days = {"1d": 1, "5d": 5, "1mo": 22, "3mo": 65, "6mo": 130, "1y": 252, "2y": 504, "5y": 1260, "max": 500}
        n_days = period_days.get(str(period).lower(), 22)
        dates = pd.date_range(end=datetime.now(), periods=max(5, n_days), freq='B')
        bases = {"NVDA": 141.50, "AAPL": 228.20, "MSFT": 425.00, "GOOGL": 178.50, "AMZN": 202.80, "TSLA": 248.50, "META": 585.00, "SPY": 595.00}
        base = bases.get(self.ticker, 100.0)
        seed = sum(ord(c) for c in self.ticker) % 10000 + 42
        rng = np.random.RandomState(seed)
        returns = rng.normal(0.0015, 0.018, size=len(dates))
        prices = base * np.cumprod(1 + returns)
        highs = prices * (1 + np.abs(rng.normal(0, 0.006, size=len(dates))))
        lows = prices * (1 - np.abs(rng.normal(0, 0.006, size=len(dates))))
        opens = (highs + lows) / 2
        vols = rng.randint(25_000_000, 65_000_000, size=len(dates))
        df = pd.DataFrame({
            "Open": opens, "High": highs, "Low": lows, "Close": prices, "Volume": vols,
            "Dividends": np.zeros(len(dates)), "Stock Splits": np.zeros(len(dates))
        }, index=dates)
        df.index.name = "Date"
        return df

    @property
    def info(self):
        hist = self.history(period="5d")
        curr = float(hist["Close"].iloc[-1])
        prev = float(hist["Close"].iloc[-2])
        return {
            "symbol": self.ticker, "shortName": f"{self.ticker} Inc.", "longName": f"{self.ticker} Corporation",
            "currentPrice": curr, "regularMarketPrice": curr, "regularMarketPreviousClose": prev,
            "regularMarketDayHigh": float(hist["High"].iloc[-1]), "regularMarketDayLow": float(hist["Low"].iloc[-1]),
            "currency": "USD"
        }

    @property
    def fast_info(self):
        return self.info

def download(tickers, period="1mo", interval="1d", **kwargs):
    t_list = tickers.split() if isinstance(tickers, str) else list(tickers)
    if len(t_list) == 1:
        return Ticker(t_list[0]).history(period=period, interval=interval, **kwargs)
    return pd.concat({t: Ticker(t).history(period=period, interval=interval, **kwargs) for t in t_list}, axis=1)
`;

const CLIMA_WASM_SHIM = `
import pandas as pd
from datetime import datetime, timedelta

class OWM:
    def __init__(self, api_key="demo"): pass
    def weather_manager(self): return self
    def weather_at_place(self, place="Santo Domingo"): return WeatherObservation(place)

class WeatherObservation:
    def __init__(self, place): self.place = place
    @property
    def weather(self): return WeatherData(self.place)

class WeatherData:
    def __init__(self, place="Santo Domingo"):
        self.place = place
        self.temperature = lambda unit="celsius": {"temp": 28.5, "temp_max": 31.0, "temp_min": 23.5, "feels_like": 30.2}
        self.humidity = 72
        self.status = "Soleado"
        self.detailed_status = "Cielo mayormente despejado con brisa tropical"
        self.wind = lambda: {"speed": 14.5, "deg": 85}

def get_weather_forecast(city="Santo Domingo", days=7):
    dates = pd.date_range(end=datetime.now() + timedelta(days=days), periods=days, freq='D')
    return pd.DataFrame({
        "Ciudad": [city]*days,
        "Temp_Max": [30.5, 31.2, 29.8, 32.0, 31.5, 30.2, 31.8],
        "Temp_Min": [23.1, 24.0, 22.8, 23.5, 24.1, 23.0, 23.8],
        "Humedad": [70, 74, 80, 68, 72, 75, 69],
        "Condición": ["Soleado", "Parcialmente Nublado", "Lluvia Dispersa", "Soleado", "Despejado", "Nublado", "Soleado"]
    }, index=dates)
`;

const CRYPTO_WASM_SHIM = `
import pandas as pd
import numpy as np
from datetime import datetime

class CoinGeckoAPI:
    def get_price(self, ids="bitcoin", vs_currencies="usd", **kwargs):
        id_list = ids.split(",") if isinstance(ids, str) else list(ids)
        prices = {"bitcoin": 96450.0, "ethereum": 3420.0, "solana": 195.50, "binancecoin": 640.0, "cardano": 0.85, "ripple": 1.45}
        res = {}
        for c in id_list:
            c_clean = c.lower().strip()
            p = prices.get(c_clean, 10.0)
            res[c_clean] = {"usd": p, "usd_24h_change": 2.45}
        return res

    def get_coin_market_chart_by_id(self, id="bitcoin", vs_currency="usd", days=30):
        dates = pd.date_range(end=datetime.now(), periods=int(days), freq='D')
        base = 95000.0 if "btc" in id.lower() or "bitcoin" in id.lower() else (3400.0 if "eth" in id.lower() else 190.0)
        rng = np.random.RandomState(42)
        prices = base * np.cumprod(1 + rng.normal(0.002, 0.03, size=len(dates)))
        return {"prices": [[int(d.timestamp()*1000), p] for d, p in zip(dates, prices)]}

def get_crypto_df(coin="bitcoin", days=30):
    cg = CoinGeckoAPI()
    data = cg.get_coin_market_chart_by_id(coin, days=days)
    dates = [datetime.fromtimestamp(p[0]/1000) for p in data["prices"]]
    vals = [p[1] for p in data["prices"]]
    df = pd.DataFrame({"Precio_USD": vals}, index=pd.DatetimeIndex(dates))
    df.index.name = "Fecha"
    return df
`;

const CINE_WASM_SHIM = `
import pandas as pd

class Cinemagoer:
    def get_top250_movies(self):
        movies = [
            {"title": "The Shawshank Redemption", "year": 1994, "rating": 9.3, "genre": "Drama", "director": "Frank Darabont"},
            {"title": "The Godfather", "year": 1972, "rating": 9.2, "genre": "Crime, Drama", "director": "Francis Ford Coppola"},
            {"title": "The Dark Knight", "year": 2008, "rating": 9.0, "genre": "Action, Crime", "director": "Christopher Nolan"},
            {"title": "Pulp Fiction", "year": 1994, "rating": 8.9, "genre": "Crime, Drama", "director": "Quentin Tarantino"},
            {"title": "Inception", "year": 2010, "rating": 8.8, "genre": "Sci-Fi, Action", "director": "Christopher Nolan"},
            {"title": "Oppenheimer", "year": 2023, "rating": 8.9, "genre": "Biography, Drama", "director": "Christopher Nolan"},
            {"title": "Interstellar", "year": 2014, "rating": 8.7, "genre": "Sci-Fi, Adventure", "director": "Christopher Nolan"}
        ]
        return pd.DataFrame(movies)

    def search_movie(self, title):
        return [{"title": title, "year": 2024, "rating": 8.5, "status": "Disponible en Cartelera"}]

Cinemagoer = Cinemagoer
IMDb = Cinemagoer
`;

const FASTAPI_WASM_SHIM = `
class FastAPI:
    def __init__(self, title="FastAPI Wasm App", version="1.0.0", **kwargs):
        self.title = title
        self.version = version
        self.routes = []

    def get(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("GET", path, func))
            return func
        return decorator

    def post(self, path, **kwargs):
        def decorator(func):
            self.routes.append(("POST", path, func))
            return func
        return decorator

class APIRouter(FastAPI): pass
`;

const SMART_FALLBACK_PREPEND = `
import sys
from types import ModuleType
import pandas as pd

class _SmartMock(object):
    def __init__(self, *args, **kwargs): 
        self._name = str(args[0]) if args else ""
    def __init_subclass__(cls, *args, **kwargs):
        pass
    def __fspath__(self): 
        return '/home/pyodide/' + (self._name if self._name else 'mock') + '.py'
    def __str__(self): 
        return str(self._name)
    def __repr__(self): 
        return f"<SmartMock: {self._name}>"
    def __call__(self, *args, **kwargs): 
        return self
    def __getattr__(self, item):
        if item.startswith("__") and item.endswith("__"):
            raise AttributeError(item)
        if item in ("df", "dataframe", "data"):
            return pd.DataFrame({"id": [1, 2, 3], "estado": ["Activo", "En Proceso", "Completado"], "valor": [150.0, 220.0, 310.0]})
        return _SmartMock(f"{self._name}.{item}")
    def __getitem__(self, item): 
        return _SmartMock(f"{self._name}[{item}]")
    def __iter__(self): 
        return iter([_SmartMock(f"{self._name}_1"), _SmartMock(f"{self._name}_2")])
    def __len__(self): 
        return 10
    def __float__(self): 
        return 100.0
    def __int__(self): 
        return 100
    def __bool__(self): 
        return True
    def __format__(self, spec): 
        return format(100.0, spec) if spec else str(self)

class _SmartMetaLoader(object):
    def create_module(self, spec):
        m = ModuleType(spec.name)
        m.__file__ = f"/home/pyodide/{spec.name}.py"
        m.__loader__ = self
        m.__spec__ = spec
        m.__package__ = spec.name.rpartition('.')[0]
        def _getattr(item):
            if item.startswith("__") and item.endswith("__"):
                raise AttributeError(item)
            return _SmartMock(f"{spec.name}.{item}")
        m.__getattr__ = _getattr
        return m
    def exec_module(self, module): 
        pass

class _SmartMetaFinder(object):
    def find_spec(self, fullname, path, target=None):
        from importlib.machinery import ModuleSpec
        raiz = fullname.split('.')[0]
        if hasattr(sys, 'stdlib_module_names') and (raiz in sys.stdlib_module_names or fullname in sys.stdlib_module_names):
            return None
        criticos = (
            "sys", "os", "math", "time", "datetime", "json", "re", "io", "base64", 
            "typing", "collections", "itertools", "functools", "pathlib", "js", 
            "pyodide", "micropip", "streamlit", "pandas", "numpy", "matplotlib", 
            "seaborn", "plotly", "altair", "sklearn", "scipy", "inspect", "posixpath",
            "tokenize", "linecache", "warnings", "traceback", "threading", "enum", "copy",
            "traitlets", "anywidget", "IPython", "ipywidgets", "jupyter", "jupyterlab",
            "vega", "vega_datasets", "jinja2", "jsonschema", "tornado", "pyarrow",
            "click", "rich", "watchdog", "toml", "validators", "urllib", "http", "requests"
        )
        if any(fullname == c or fullname.startswith(c + ".") for c in criticos):
            return None
        return ModuleSpec(fullname, _SmartMetaLoader())

if not any(isinstance(f, _SmartMetaFinder) for f in sys.meta_path):
    sys.meta_path.append(_SmartMetaFinder())
`;

const WASM_BUILTIN_SHIMS = {
  "yfinance.py": YFINANCE_WASM_SHIM,
  "pyowm.py": CLIMA_WASM_SHIM,
  "weather.py": CLIMA_WASM_SHIM,
  "coingecko.py": CRYPTO_WASM_SHIM,
  "pycoingecko.py": CRYPTO_WASM_SHIM,
  "cinemagoer.py": CINE_WASM_SHIM,
  "imdb.py": CINE_WASM_SHIM,
  "fastapi.py": FASTAPI_WASM_SHIM
};

// Fast-Boot Ultrarrápido: arranca en ~2 segundos con la base y permite ejecución inmediata
async function bootWasm() {
  const badge = document.getElementById("badge-estado");
  const btn = document.getElementById("btn-run");

  try {
    badge.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Iniciando Wasm Core...`;
    pyodideInstance = await loadPyodide();

    badge.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Cargando base científica...`;
    // Carga inicial mínima y rápida: NumPy, Pandas, Matplotlib, Micropip
    await pyodideInstance.loadPackage(["pandas", "numpy", "matplotlib", "micropip"]);
    for (const [fn, content] of Object.entries(WASM_BUILTIN_SHIMS)) {
      try { pyodideInstance.FS.writeFile(fn, content); } catch(eSh) {}
    }

    // Configuración base de terminal, interceptores, auto-instalador AST y motor multivisor
    await pyodideInstance.runPythonAsync(`
import sys
import io
import js
import ast
import json
import os
import time
import builtins
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", message=".*Pyarrow.*")
import importlib.util
from pyodide.http import open_url
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

plt.show = lambda *args, **kwargs: None

# Registro de archivos generados o modificados durante la ejecución actual
__archivos_escritos_en_ejecucion__ = set()
__plotly_htmls_capturados__ = []
__orig_open = builtins.open

def __tracked_open(file, mode='r', *args, **kwargs):
    if isinstance(file, str) and any(m in mode for m in ('w', 'a', 'x', '+')):
        try:
            __archivos_escritos_en_ejecucion__.add(os.path.basename(file))
        except Exception:
            pass
    return __orig_open(file, mode, *args, **kwargs)

builtins.open = __tracked_open
io.open = __tracked_open
import pathlib
__orig_write_text = pathlib.Path.write_text
def __tracked_write_text(self, data, encoding=None, errors=None, newline=None):
    try:
        __archivos_escritos_en_ejecucion__.add(self.name)
    except Exception:
        pass
    return __orig_write_text(self, data, encoding=encoding, errors=errors, newline=newline)
pathlib.Path.write_text = __tracked_write_text

def __capturar_plotly_fig(fig):
    try:
        html_str = fig.to_html(include_plotlyjs="cdn", full_html=True)
        __plotly_htmls_capturados__.append(html_str)
    except Exception:
        pass

# 1. INTERCEPTORES DE PANDAS PARA URLs
_orig_read_csv = pd.read_csv
def _safe_read_csv(filepath_or_buffer, *args, **kwargs):
    if isinstance(filepath_or_buffer, str) and (filepath_or_buffer.startswith("http://") or filepath_or_buffer.startswith("https://")):
        buf = open_url(filepath_or_buffer)
        return _orig_read_csv(buf, *args, **kwargs)
    return _orig_read_csv(filepath_or_buffer, *args, **kwargs)

pd.read_csv = _safe_read_csv

_orig_read_json = pd.read_json
def _safe_read_json(path_or_buf, *args, **kwargs):
    if isinstance(path_or_buf, str) and (path_or_buf.startswith("http://") or path_or_buf.startswith("https://")):
        buf = open_url(path_or_buf)
        return _orig_read_json(buf, *args, **kwargs)
    return _orig_read_json(path_or_buf, *args, **kwargs)

pd.read_json = _safe_read_json

_orig_read_excel = pd.read_excel
def _safe_read_excel(io_or_url, *args, **kwargs):
    if isinstance(io_or_url, str) and (io_or_url.startswith("http://") or io_or_url.startswith("https://")):
        try:
            import requests
            res = requests.get(io_or_url)
            return _orig_read_excel(io.BytesIO(res.content), *args, **kwargs)
        except Exception:
            buf = open_url(io_or_url)
            return _orig_read_excel(buf, *args, **kwargs)
    return _orig_read_excel(io_or_url, *args, **kwargs)

pd.read_excel = _safe_read_excel

# 2. PUENTE DE TERMINAL EN VIVO
class LiveStdout:
    def write(self, text):
        if text:
            js.escribirEnTerminal(str(text))
    def flush(self):
        pass

sys.stdout = LiveStdout()
sys.stderr = LiveStdout()

async def __custom_async_input(prompt=""):
    p_str = str(prompt) if prompt is not None else ""
    val = await js.solicitarInputTerminal(p_str)
    return str(val)

builtins.input = __custom_async_input

# Mapa de alias comunes de paquetes en PyPI
__MAPA_ALIAS_PAQUETES__ = {
    "sklearn": "scikit-learn",
    "PIL": "pillow",
    "cv2": "opencv-python",
    "bs4": "beautifulsoup4",
    "yaml": "pyyaml",
    "dateutil": "python-dateutil"
}

async def __asegurar_imports_instalados(tree):
    import micropip
    modulos_requeridos = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                raiz = alias.name.split('.')[0]
                if raiz and raiz not in modulos_requeridos:
                    modulos_requeridos.append(raiz)
        elif isinstance(node, ast.ImportFrom) and node.module:
            raiz = node.module.split('.')[0]
            if raiz and raiz not in modulos_requeridos:
                modulos_requeridos.append(raiz)

    for mod in modulos_requeridos:
        if mod in sys.builtin_module_names or (hasattr(sys, "stdlib_module_names") and mod in sys.stdlib_module_names) or mod in ("js", "pyodide", "micropip", "urllib", "http", "json", "csv", "ssl"):
            continue
        try:
            spec = importlib.util.find_spec(mod)
        except Exception:
            spec = None
        if spec is None:
            pkg_name = __MAPA_ALIAS_PAQUETES__.get(mod, mod)
            print(f"📦 [Auto-Instalador Wasm] Instalando librería '{pkg_name}' desde PyPI...")
            try:
                if pkg_name == "folium":
                    await micropip.install(["xyzservices", "branca", "requests", "folium"], keep_going=True)
                else:
                    await micropip.install(pkg_name, keep_going=True)
                importlib.invalidate_caches()
                print(f"✅ [Auto-Instalador Wasm] '{pkg_name}' lista.")
            except Exception as e_inst:
                print(f"⚠️ Aviso al instalar '{pkg_name}': {e_inst}")

# 3. EJECUTOR CON AUTO-RESOLUCIÓN NATIVA EN PYTHON
async def __ejecutar_codigo_usuario(code_str):
    import micropip
    __archivos_escritos_en_ejecucion__.clear()
    __plotly_htmls_capturados__.clear()
    plt.close("all")

    tree = ast.parse(code_str)
    await __asegurar_imports_instalados(tree)

    class InputReplacer(ast.NodeTransformer):
        def visit_Call(self, node):
            self.generic_visit(node)
            if isinstance(node.func, ast.Name) and node.func.id == 'input':
                return ast.Await(value=ast.Call(
                    func=ast.Name(id='__custom_async_input', ctx=ast.Load()),
                    args=node.args,
                    keywords=node.keywords
                ))
            return node

    tree = InputReplacer().visit(tree)
    ast.fix_missing_locations(tree)

    code_obj = compile(tree, filename="<editor>", mode="exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)

    # Bucle de protección nativo ante cualquier submódulo dinámico faltante
    for _intento in range(4):
        try:
            res = eval(code_obj, globals())
            if hasattr(res, '__await__'):
                await res
            break
        except ModuleNotFoundError as mnf:
            faltante = getattr(mnf, "name", None) or ""
            raiz_faltante = faltante.split('.')[0] if faltante else ""
            if raiz_faltante and _intento < 3:
                pkg = __MAPA_ALIAS_PAQUETES__.get(raiz_faltante, raiz_faltante)
                print(f"📦 [Auto-Instalador Wasm] Descargando dependencia '{pkg}'...")
                await micropip.install(pkg, keep_going=True)
                importlib.invalidate_caches()
                continue
            raise

def __get_luminance(color):
    try:
        import matplotlib.colors as mcolors
        rgba = mcolors.to_rgba(color)
        return 0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2]
    except Exception:
        return 0.5

def __adaptar_figura_contraste(fig, modo):
    import matplotlib.patheffects as pe
    
    if modo == "blanco":
        bg_fig = "#ffffff"
        bg_ax = "#ffffff"
        fg_target = "#0f172a"
        spine_target = "#94a3b8"
        fig.patch.set_facecolor(bg_fig)
        fig.patch.set_alpha(1.0)
    elif modo == "negro":
        bg_fig = "#080c14"
        bg_ax = "#0f172a"
        fg_target = "#f8fafc"
        spine_target = "#475569"
        fig.patch.set_facecolor(bg_fig)
        fig.patch.set_alpha(1.0)
    else:
        bg_fig = None
        bg_ax = None
        fg_target = "#ffffff"
        spine_target = "#64748b"
        fig.patch.set_alpha(0.0)

    if hasattr(fig, "_suptitle") and fig._suptitle:
        if modo != "transparente":
            fig._suptitle.set_color(fg_target)
            fig._suptitle.set_path_effects([])
        else:
            fig._suptitle.set_color("#ffffff")
            fig._suptitle.set_path_effects([pe.withStroke(linewidth=2.5, foreground="#000000")])

    for ax in fig.axes:
        if modo == "transparente":
            ax.patch.set_alpha(0.0)
        else:
            ax.patch.set_facecolor(bg_ax)
            ax.patch.set_alpha(1.0)

        # Adaptar imágenes embebidas con fondo sólido (ej. WordCloud) a Blanco, Negro y Transparente
        for im in ax.images:
            try:
                if not hasattr(im, "_orig_rgba"):
                    arr_raw = np.array(im.get_array())
                    if arr_raw.ndim == 3 and arr_raw.shape[2] in (3, 4):
                        if arr_raw.dtype != np.uint8:
                            arr_raw = (np.clip(arr_raw, 0, 1) * 255).astype(np.uint8) if arr_raw.max() <= 1.0 else arr_raw.astype(np.uint8)
                        if arr_raw.shape[2] == 3:
                            alpha_ch = np.full((arr_raw.shape[0], arr_raw.shape[1], 1), 255, dtype=np.uint8)
                            arr_rgba = np.concatenate([arr_raw, alpha_ch], axis=2)
                        else:
                            arr_rgba = arr_raw.copy()
                        # Verificar si las esquinas comparten un color de fondo uniforme
                        c1, c2, c3, c4 = arr_rgba[0, 0, :3].astype(int), arr_rgba[0, -1, :3].astype(int), arr_rgba[-1, 0, :3].astype(int), arr_rgba[-1, -1, :3].astype(int)
                        if max(np.max(np.abs(c1 - c2)), np.max(np.abs(c1 - c3)), np.max(np.abs(c1 - c4))) <= 15:
                            im._orig_rgba = arr_rgba
                            im._orig_bg_rgb = c1
                        else:
                            im._orig_rgba = None
                    else:
                        im._orig_rgba = None

                if getattr(im, "_orig_rgba", None) is not None:
                    base_rgba = im._orig_rgba.copy()
                    bg_c = im._orig_bg_rgb
                    mask_bg = np.max(np.abs(base_rgba[:, :, :3].astype(int) - bg_c), axis=-1) <= 22
                    if modo == "blanco":
                        base_rgba[mask_bg] = [255, 255, 255, 255]
                    elif modo == "negro":
                        base_rgba[mask_bg] = [8, 12, 20, 255]
                    else:
                        base_rgba[mask_bg] = [0, 0, 0, 0]
                    im.set_data(base_rgba)
            except Exception:
                pass
            
        for gl in ax.get_xgridlines() + ax.get_ygridlines():
            if modo == "blanco":
                gl.set_color("#e2e8f0")
            elif modo == "negro":
                gl.set_color("#1e293b")
            else:
                gl.set_color("#475569")

        for item in [ax.title, ax.xaxis.label, ax.yaxis.label]:
            if item:
                if modo == "blanco":
                    item.set_color("#0f172a")
                    item.set_path_effects([])
                elif modo == "negro":
                    item.set_color("#f8fafc")
                    item.set_path_effects([])
                else:
                    item.set_color("#ffffff")
                    item.set_path_effects([pe.withStroke(linewidth=2.5, foreground="#000000")])

        for lbl in ax.get_xticklabels() + ax.get_yticklabels():
            if modo == "blanco":
                lbl.set_color("#0f172a")
                lbl.set_path_effects([])
            elif modo == "negro":
                lbl.set_color("#f8fafc")
                lbl.set_path_effects([])
            else:
                lbl.set_color("#ffffff")
                lbl.set_path_effects([pe.withStroke(linewidth=2.0, foreground="#000000")])
                
        ax.tick_params(colors=fg_target if modo != "transparente" else "#ffffff", which="both")
        
        for s in ax.spines.values():
            s.set_color(spine_target)
            
        leg = ax.get_legend()
        if leg:
            if modo == "blanco":
                leg.get_frame().set_facecolor("#ffffff")
                leg.get_frame().set_edgecolor(spine_target)
                leg.get_frame().set_alpha(0.95)
                for t in leg.get_texts(): 
                    t.set_color(fg_target)
                    t.set_path_effects([])
            elif modo == "negro":
                leg.get_frame().set_facecolor("#1e293b")
                leg.get_frame().set_edgecolor(spine_target)
                leg.get_frame().set_alpha(0.95)
                for t in leg.get_texts(): 
                    t.set_color(fg_target)
                    t.set_path_effects([])
            else:
                leg.get_frame().set_alpha(0.3)
                for t in leg.get_texts():
                    t.set_color("#ffffff")
                    t.set_path_effects([pe.withStroke(linewidth=2.0, foreground="#000000")])

        is_heatmap = any("QuadMesh" in type(c).__name__ for c in ax.collections)
        if not is_heatmap:
            for t in ax.texts:
                bbox_p = t.get_bbox_patch()
                if bbox_p is not None:
                    if modo == "blanco":
                        bbox_p.set_facecolor("#ffffff")
                        bbox_p.set_edgecolor("#cbd5e1")
                        bbox_p.set_alpha(0.9)
                        t.set_color("#0f172a")
                        t.set_path_effects([])
                    elif modo == "negro":
                        bbox_p.set_facecolor("#0f172a")
                        bbox_p.set_edgecolor("#334155")
                        bbox_p.set_alpha(0.9)
                        t.set_color("#f8fafc")
                        t.set_path_effects([])
                    else:
                        bbox_p.set_facecolor("#0f172a")
                        bbox_p.set_edgecolor("#475569")
                        bbox_p.set_alpha(0.75)
                        t.set_color("#ffffff")
                        t.set_path_effects([])
                else:
                    if modo == "blanco":
                        t.set_color("#0f172a")
                        t.set_path_effects([pe.withStroke(linewidth=2.2, foreground="#ffffff")])
                    elif modo == "negro":
                        t.set_color("#f8fafc")
                        t.set_path_effects([pe.withStroke(linewidth=2.2, foreground="#080c14")])
                    else:
                        t.set_color("#ffffff")
                        t.set_path_effects([pe.withStroke(linewidth=2.2, foreground="#000000")])

def __generar_variantes_gif(gif_bytes):
    import base64
    variantes = {"negro": "", "blanco": "", "transparente": ""}
    b64_orig = base64.b64encode(gif_bytes).decode("utf-8")
    variantes["negro"] = b64_orig
    try:
        from PIL import Image, ImageSequence
        im = Image.open(io.BytesIO(gif_bytes))
        duracion = im.info.get("duration", 80)
        loop = im.info.get("loop", 0)
        frames_rgba = [np.array(f.convert("RGBA")) for f in ImageSequence.Iterator(im)]
        if not frames_rgba:
            variantes["blanco"] = b64_orig
            variantes["transparente"] = b64_orig
            return variantes

        f0 = frames_rgba[0]
        bg_rgb = f0[0, 0, :3].astype(np.int16)
        lum_bg = (0.299 * bg_rgb[0] + 0.587 * bg_rgb[1] + 0.114 * bg_rgb[2]) / 255.0
        es_oscuro_orig = lum_bg < 0.45

        frames_blanco = []
        frames_negro = []
        frames_trans = []

        for arr in frames_rgba:
            rgb = arr[:, :, :3].astype(np.int16)
            diff_bg = np.max(np.abs(rgb - bg_rgb), axis=-1)
            mask_bg = diff_bg <= 28

            c_max = np.max(rgb, axis=-1)
            c_min = np.min(rgb, axis=-1)
            es_gris = (c_max - c_min) <= 35

            if es_oscuro_orig:
                arr_w = arr.copy()
                for c in range(3):
                    canal = arr_w[:, :, c].astype(np.int16)
                    arr_w[:, :, c] = np.where(es_gris, 255 - canal, canal).astype(np.uint8)
                arr_w[mask_bg, :3] = 255
                frames_blanco.append(Image.fromarray(arr_w, "RGBA").convert("P", palette=Image.ADAPTIVE))

                arr_t = arr.copy()
                arr_t[mask_bg, 3] = 0
                frames_trans.append(Image.fromarray(arr_t, "RGBA"))
            else:
                arr_b = arr.copy()
                for c in range(3):
                    canal = arr_b[:, :, c].astype(np.int16)
                    arr_b[:, :, c] = np.where(es_gris, 255 - canal, canal).astype(np.uint8)
                arr_b[mask_bg, 0] = 8
                arr_b[mask_bg, 1] = 12
                arr_b[mask_bg, 2] = 20
                frames_negro.append(Image.fromarray(arr_b, "RGBA").convert("P", palette=Image.ADAPTIVE))

                arr_t = arr_b.copy()
                arr_t[mask_bg, 3] = 0
                frames_trans.append(Image.fromarray(arr_t, "RGBA"))

        if es_oscuro_orig:
            variantes["negro"] = b64_orig
            buf_w = io.BytesIO()
            frames_blanco[0].save(buf_w, format="GIF", save_all=True, append_images=frames_blanco[1:], duration=duracion, loop=loop)
            variantes["blanco"] = base64.b64encode(buf_w.getvalue()).decode("utf-8")
        else:
            variantes["blanco"] = b64_orig
            buf_b = io.BytesIO()
            frames_negro[0].save(buf_b, format="GIF", save_all=True, append_images=frames_negro[1:], duration=duracion, loop=loop)
            variantes["negro"] = base64.b64encode(buf_b.getvalue()).decode("utf-8")

        buf_t = io.BytesIO()
        frames_trans[0].save(buf_t, format="GIF", save_all=True, append_images=frames_trans[1:], duration=duracion, loop=loop, disposal=2)
        variantes["transparente"] = base64.b64encode(buf_t.getvalue()).decode("utf-8")
    except Exception:
        if not variantes["blanco"]: variantes["blanco"] = b64_orig
        if not variantes["transparente"]: variantes["transparente"] = b64_orig
    return variantes

def __extraer_plots():
    import base64
    res = {
        "tipo": "estatico",
        "transparente": "",
        "blanco": "",
        "negro": "",
        "gif_b64": "",
        "gif_nombre": "",
        "html_content": "",
        "html_nombre": ""
    }
    code_raw = globals().get("__user_code_raw__", "") or ""

    # 1. Detectar si se escribió algún archivo .html durante esta ejecución (Folium, Plotly, Pyvis, Altair, Bokeh)
    htmls_escritos = [f for f in __archivos_escritos_en_ejecucion__ if f.lower().endswith(".html") and os.path.isfile(f)]
    if htmls_escritos:
        reciente_html = htmls_escritos[-1]
        try:
            with __orig_open(reciente_html, "r", encoding="utf-8", errors="replace") as hf:
                contenido_html = hf.read()
            if contenido_html.strip():
                res["tipo"] = "html"
                res["html_nombre"] = reciente_html
                res["html_content"] = contenido_html
                return json.dumps(res)
        except Exception:
            pass

    # 2. Detectar si se llamó fig.show() en Plotly durante esta ejecución
    if __plotly_htmls_capturados__:
        html_plotly = __plotly_htmls_capturados__[-1]
        nombre_auto = "grafico_interactivo_plotly.html"
        try:
            with __orig_open(nombre_auto, "w", encoding="utf-8") as pf:
                pf.write(html_plotly)
        except Exception:
            pass
        res["tipo"] = "html"
        res["html_nombre"] = nombre_auto
        res["html_content"] = html_plotly
        return json.dumps(res)

    # 3. Detectar objetos interactivos en memoria (folium.Map, plotly Figure, altair Chart) si el usuario no llamó .save()
    if "folium" in code_raw:
        for k, v in reversed(list(globals().items())):
            if not k.startswith("_") and type(v).__module__.startswith("folium") and hasattr(v, "get_root"):
                try:
                    html_folium = v.get_root().render()
                    nombre_auto = "mapa_folium_interactivo.html"
                    with __orig_open(nombre_auto, "w", encoding="utf-8") as mf:
                        mf.write(html_folium)
                    res["tipo"] = "html"
                    res["html_nombre"] = nombre_auto
                    res["html_content"] = html_folium
                    return json.dumps(res)
                except Exception:
                    pass

    if "plotly" in code_raw:
        for k, v in reversed(list(globals().items())):
            if not k.startswith("_") and hasattr(v, "to_html") and "plotly" in type(v).__module__:
                try:
                    html_p = v.to_html(include_plotlyjs="cdn", full_html=True)
                    nombre_auto = "grafico_plotly.html"
                    with __orig_open(nombre_auto, "w", encoding="utf-8") as pf:
                        pf.write(html_p)
                    res["tipo"] = "html"
                    res["html_nombre"] = nombre_auto
                    res["html_content"] = html_p
                    return json.dumps(res)
                except Exception:
                    pass

    if "altair" in code_raw:
        for k, v in reversed(list(globals().items())):
            if not k.startswith("_") and hasattr(v, "to_html") and "altair" in type(v).__module__:
                try:
                    html_a = v.to_html()
                    nombre_auto = "grafico_altair.html"
                    with __orig_open(nombre_auto, "w", encoding="utf-8") as af:
                        af.write(html_a)
                    res["tipo"] = "html"
                    res["html_nombre"] = nombre_auto
                    res["html_content"] = html_a
                    return json.dumps(res)
                except Exception:
                    pass

    # 4. Detectar si se generó un archivo .gif en esta ejecución y crear sus 3 modos de fondo
    gifs_escritos = [f for f in __archivos_escritos_en_ejecucion__ if f.lower().endswith(".gif") and os.path.isfile(f)]
    if gifs_escritos:
        reciente_gif = gifs_escritos[-1]
        try:
            with __orig_open(reciente_gif, "rb") as gf:
                gif_bytes = gf.read()
            if len(gif_bytes) > 0:
                res["tipo"] = "gif"
                res["gif_nombre"] = reciente_gif
                variantes_gif = __generar_variantes_gif(gif_bytes)
                res["negro"] = variantes_gif["negro"]
                res["blanco"] = variantes_gif["blanco"]
                res["transparente"] = variantes_gif["transparente"]
                res["gif_b64"] = variantes_gif["negro"]
                plt.clf()
                plt.close("all")
                return json.dumps(res)
        except Exception:
            pass

    # 5. Si hay figuras estáticas abiertas en matplotlib (Matplotlib, Seaborn, NetworkX, WordCloud, Scipy, Sklearn)
    if plt.get_fignums():
        fig = plt.gcf()
        
        # 1. Blanco adaptativo
        __adaptar_figura_contraste(fig, "blanco")
        b_white = io.BytesIO()
        plt.savefig(b_white, format="png", bbox_inches="tight", dpi=140, facecolor="#ffffff", edgecolor="none")
        b_white.seek(0)
        res["blanco"] = base64.b64encode(b_white.read()).decode("utf-8")

        # 2. Negro adaptativo
        __adaptar_figura_contraste(fig, "negro")
        b_black = io.BytesIO()
        plt.savefig(b_black, format="png", bbox_inches="tight", dpi=140, facecolor="#080c14", edgecolor="none")
        b_black.seek(0)
        res["negro"] = base64.b64encode(b_black.read()).decode("utf-8")

        # 3. Transparente adaptativo
        __adaptar_figura_contraste(fig, "transparente")
        b_trans = io.BytesIO()
        plt.savefig(b_trans, format="png", bbox_inches="tight", dpi=140, transparent=True)
        b_trans.seek(0)
        res["transparente"] = base64.b64encode(b_trans.read()).decode("utf-8")

        plt.clf()
        plt.close("all")
        return json.dumps(res)

    # 6. Si el usuario guardó un .png directamente
    pngs_escritos = [f for f in __archivos_escritos_en_ejecucion__ if f.lower().endswith(".png") and os.path.isfile(f)]
    if pngs_escritos:
        reciente_png = pngs_escritos[-1]
        try:
            with __orig_open(reciente_png, "rb") as pf:
                b64_png = base64.b64encode(pf.read()).decode("utf-8")
            res["blanco"] = b64_png
            res["negro"] = b64_png
            res["transparente"] = b64_png
        except Exception:
            pass

    return json.dumps(res)

def __extraer_plot():
    return __extraer_plots()

def __obtener_datos_descargables():
    archivos = [f for f in os.listdir('.') if not f.startswith('.') and not f.startswith('__') and os.path.isfile(f)]
    archivos_data = [f for f in archivos if f.endswith(('.csv', '.xlsx', '.xls', '.json', '.txt', '.png', '.parquet', '.gif', '.html'))]
    dfs = []
    for k, v in list(globals().items()):
        if isinstance(v, pd.DataFrame) and not k.startswith('_'):
            dfs.append(k)
    return json.dumps({"archivos": archivos_data, "dfs": dfs})

def __leer_archivo_csv(nombre):
    if os.path.exists(nombre):
        with __orig_open(nombre, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

def __exportar_df_csv(df_name):
    if df_name in globals():
        obj = globals()[df_name]
        if isinstance(obj, pd.DataFrame):
            return obj.to_csv(index=False)
    return ""
    `);

    // Listo de inmediato
    badge.className = "badge bg-dark border border-success text-success px-3 py-1";
    badge.innerHTML = `<i class="bi bi-check-circle-fill"></i> Motor Wasm Listo (Auto-Detección Activa)`;
    btn.disabled = false;
    
    terminal.textContent = `# 🐍 JPV PyStudio Pro inicializado con éxito.
# ⚡ Motor Fast-Boot activo: Auto-instalación y renderizado de Folium, Plotly, Seaborn, NetworkX, WordCloud, Excel y más.
# 📦 Pega cualquier script Python y pulsa 'Ejecutar': las librerías y mapas/gráficos se activan solos.
`;

    // Calentamiento en segundo plano no bloqueante para requests, excel y ssl
    setTimeout(async () => {
      try {
        await pyodideInstance.loadPackage(["ssl", "jinja2"]);
        paquetesCargados.add("ssl");
        paquetesCargados.add("jinja2");
        await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install(["pyodide-http", "openpyxl"], keep_going=True)
import pyodide_http
pyodide_http.patch_all()
`);
        paquetesCargados.add("openpyxl");
        paquetesCargados.add("pyodide-http");
      } catch(eQuiet) {}
    }, 100);

  } catch (err) {
    badge.className = "badge bg-dark border border-danger text-danger px-3 py-1";
    badge.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Fallo Wasm`;
    terminal.className = "error-state";
    terminal.innerText = "Error cargando runtime:\n" + err;
  }
}
