// =====================================================================
// CONTENIDO EDITORIAL MAESTRO: LIBROS TÉCNICOS & TALLERES DATAIADEV
// Autor: Ing. Juancito Peña Vizcaíno
// Rúbrica Oficial República Dominicana (O&M, CODIA, Maestría Gerencial)
// =====================================================================

const RUBRICA_OFICIAL_JPV = {
  autor: "Ing. Juancito Peña Vizcaíno",
  institucion: "DataIADev • Centro de Innovación Tecnológica",
  credenciales: [
    "Ingeniero en Sistemas y Computación (Universidad Dominicana O&M)",
    "Colegiado Oficial CODIA (Colegio Dominicano de Ingenieros, Arquitectos y Agrimensores)",
    "Magíster en Sistemas mención Gerencial",
    "Especialista en Desarrollo de Software, Arquitectura Cloud e Inteligencia Artificial",
    "Docente Universitario e Investigador I+D+i en Ciencias de la Computación",
    "Creador y Divulgador Técnico en @JuancitoDevV (YouTube, GitHub, LinkedIn)"
  ],
  contacto: {
    correo: "juancitope@gmail.com",
    canal: "https://youtube.com/@JuancitoDevV",
    github: "https://github.com/JUANCITOPENA",
    linkedin: "https://linkedin.com/in/juancitopena",
    pais: "Santo Domingo, República Dominicana"
  },
  notaEditorial: "Extractos del Libro Oficial: 'Lo que nadie te enseña de Python y su ecosistema' — Edición Exclusiva para la Comunidad DataIADev"
};

const BIBLIOTECA_DOCUMENTOS = {
  libro_maestro_python: {
    id: "libro_maestro_python",
    titulo: "Lo que nadie te enseña de Python y su ecosistema",
    subtitulo: "Fundamentos Rigurosos, Programación Orientada a Objetos, SQL Server Enterprise, Pipelines Analíticos, Streamlit e Inteligencia Artificial",
    categoria: "Libro de Ingeniería & Referencia Oficial",
    version: "Edición 2026 - Conforme a Python 3.12/3.13+",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#00e5ff",
    icono: "bi-journal-code",
    modulos: [
      {
        id: "mod-1",
        numero: "01",
        titulo: "Génesis, Filosofía y el Ecosistema Global de Python",
        descripcion: "¿Qué es realmente programar? Orígenes de Python, Guido van Rossum, empresas que mueven billones con él, matriz de habilidades y manejo universal de formatos de datos.",
        contenidoHtml: `
          <h4>1.1. La Verdadera Esencia de la Programación</h4>
          <p>Programar no es memorizar sintaxis; es <strong>diseñar secuencias lógicas de instrucciones no ambiguas</strong> para que un procesador transforme datos crudos en valor accionable. En su nivel más elemental, un programa informático gestiona tres dimensiones: <em>Estado (Memoria)</em>, <em>Transición (Lógica/Operaciones)</em> y <em>Flujo de Control (Decisiones/Bucles)</em>.</p>
          
          <h4>1.2. El Nacimiento de Python y Guido van Rossum</h4>
          <p>Python fue concebido a finales de 1989 por el matemático neerlandés <strong>Guido van Rossum</strong> en el Centrum Wiskunde & Informatica (CWI) de Ámsterdam, publicando su versión 0.9.0 en <strong>febrero de 1991</strong>. Guido buscaba un lenguaje que combinara la expresividad de ABC con la potencia de llamadas al sistema operativo de C, erradicando la complejidad innecesaria de llaves y puntos y comas mediante la <strong>indentación obligatoria y estética</strong>.</p>
          <div class="callout-quote">
            <strong>The Zen of Python (PEP 20 - Tim Peters):</strong><br>
            <em>"Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Readability counts."</em>
          </div>

          <h4>1.3. ¿Quién Mueve el Mundo con Python Hoy?</h4>
          <ul>
            <li><strong>Google:</strong> Motor de búsqueda, YouTube e infraestructura de IA (TensorFlow/JAX) sostenidos bajo el lema original de Peter Norvig: <em>"Python where we can, C++ where we must"</em>.</li>
            <li><strong>Netflix:</strong> Algoritmos de recomendación, codificación masiva de video y automatización de red en la nube de AWS.</li>
            <li><strong>NASA & ESA:</strong> Análisis espectrográfico de imágenes del telescopio espacial James Webb y trayectorias orbitales.</li>
            <li><strong>JP Morgan & Goldman Sachs:</strong> Modelado cuantitativo de derivados de alto riesgo y liquidaciones financieras en tiempo real.</li>
            <li><strong>OpenAI:</strong> La totalidad del pipeline de entrenamiento y orquestación de modelos GPT está construida en Python.</li>
          </ul>

          <h4>1.4. La Gran Matriz de Habilidades y Librerías por Sector</h4>
          <div class="table-responsive">
            <table class="table-doc">
              <thead>
                <tr>
                  <th>Sector / Disciplina</th>
                  <th>Librerías Clave del Ecosistema</th>
                  <th>Impacto en la Industria</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Desarrollo Web & APIs</strong></td>
                  <td>FastAPI, Django, Flask, Pydantic, Uvicorn</td>
                  <td>Microservicios de alto rendimiento con validación asíncrona.</td>
                </tr>
                <tr>
                  <td><strong>Ingeniería y Análisis de Datos</strong></td>
                  <td>Pandas, Polars, DuckDB, PyArrow, Dbt</td>
                  <td>Manipulación de terabytes en memoria con ejecución paralela.</td>
                </tr>
                <tr>
                  <td><strong>Ciencia de Datos y ML</strong></td>
                  <td>Scikit-Learn, XGBoost, LightGBM, Statsmodels</td>
                  <td>Modelado predictivo, regresión, clasificación y clustering.</td>
                </tr>
                <tr>
                  <td><strong>Deep Learning & IA Generativa</strong></td>
                  <td>PyTorch, HuggingFace, LangChain, Google GenAI</td>
                  <td>Transformers, visión por computadora y agentes autónomos.</td>
                </tr>
                <tr>
                  <td><strong>Visualización y Storytelling</strong></td>
                  <td>Matplotlib, Seaborn, Plotly, Altair, Streamlit</td>
                  <td>Dashboards ejecutivos y gráficos interactivos sin backend web.</td>
                </tr>
                <tr>
                  <td><strong>Bases de Datos & ETL</strong></td>
                  <td>SQLAlchemy, PyODBC, Psycopg, Tortoise-ORM</td>
                  <td>Conectividad segura enterprise a SQL Server, PostgreSQL y Oracle.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>1.5. Manejo Universal de Formatos de Archivos</h4>
          <p>Un ingeniero en software profesional domina la ingesta y serialización de datos en cualquier formato estándar:</p>
          <ul>
            <li><strong>CSV / TSV:</strong> <code>pd.read_csv()</code> o módulo nativo <code>csv</code> para intercambios tabulares.</li>
            <li><strong>Excel (XLSX/XLS):</strong> <code>openpyxl</code> y <code>xlsxwriter</code> con soporte para fórmulas y estilos contables.</li>
            <li><strong>JSON:</strong> Serialización jerárquica nativa con <code>json.loads()</code> y <code>json.dumps()</code>.</li>
            <li><strong>XML:</strong> Árboles jerárquicos con <code>xml.etree.ElementTree</code> para facturación fiscal (DGII/e-CF).</li>
            <li><strong>PDF:</strong> Extracción de texto y tablas estructuradas con <code>pypdf</code> y <code>pdfplumber</code>.</li>
            <li><strong>Bases Relacionales (SQL):</strong> Consultas directas normalizadas vía <code>pyodbc</code> hacia SQL Server.</li>
          </ul>
        `,
        codigoEjemplo: `import io
import json
import pandas as pd

# Demostración del Ecosistema Multiformato en 10 líneas
datos_crudos = [
    {"modulo": "Ingeniería", "lenguaje": "Python 3.12", "activo": True, "estudiantes": 1420},
    {"modulo": "Bases de Datos", "lenguaje": "SQL Server 2022", "activo": True, "estudiantes": 1150},
    {"modulo": "Visualización", "lenguaje": "Seaborn / Matplotlib", "activo": True, "estudiantes": 980}
]

# Serialización en Memoria (JSON a DataFrame)
df = pd.DataFrame(datos_crudos)
df["ratio_participacion"] = (df["estudiantes"] / df["estudiantes"].sum()) * 100

print("=== REPORTE OFICIAL DEL ECOSISTEMA (DataIADev) ===")
print(df.to_string(index=False))`,
        reto: {
          titulo: "Reto #1: El Perfilador Universal de Archivos Multi-Formato",
          descripcion: "Construye una función en Python llamada `perfilar_payload_multiformato(datos_json)` que reciba una lista de registros de transacciones comerciales, calcule la suma total facturada, el ticket promedio y devuelva un resumen estructurado tanto en formato tabular con Pandas como serializado en una cadena JSON formateada con sangría de 2 espacios.",
          codigoInicial: `def perfilar_payload_multiformato(transacciones):
    # TODO: Desarrolla el análisis de datos completo
    pass`
        }
      },
      {
        id: "mod-2",
        numero: "02",
        titulo: "Fundamentos Rigurosos: Variables, Tipado Dinámico y Estructuras de Control",
        descripcion: "Tipos de datos atómicos, gestión de memoria por referencias, operadores matemáticos y lógicos, decisiones con if/elif/else y el moderno match/case de Python 3.10+.",
        contenidoHtml: `
          <h4>2.1. Todo en Python es un Objeto: Tipado Fuerte y Dinámico</h4>
          <p>A diferencia de C o Java donde las variables son cajas de memoria con tipo fijo, en Python <strong>las variables son etiquetas (punteros o referencias)</strong> que apuntan a objetos creados en el montón (*Heap*). El tipo pertenece al objeto, no a la variable:</p>
          <pre><code>x = 100       # 'x' referencia un objeto int con valor 100
x = "Python"  # Ahora 'x' referencia un objeto str. El recolector de basura libera el 100 si no hay más referencias.</code></pre>

          <h4>2.2. Tipos de Datos Primitivos y Operadores de Alta Precisión</h4>
          <ul>
            <li><code>int</code>: Enteros con precisión arbitraria (no desbordan a 32 ni 64 bits).</li>
            <li><code>float</code>: Números de punto flotante de doble precisión según estándar IEEE 754.</li>
            <li><code>bool</code>: Subclase de <code>int</code> con valores únicos <code>True</code> (1) y <code>False</code> (0).</li>
            <li><code>str</code>: Cadenas inmutables codificadas en UTF-8 nativo.</li>
          </ul>

          <h4>2.3. Estructuras de Control: De if/elif/else al Moderno match/case</h4>
          <p>Python 3.10 introdujo el <strong>Pattern Matching Estructural</strong> (sentencia <code>match ... case</code>), superando al <code>switch</code> tradicional de otros lenguajes al permitir desempaquetar tuplas, diccionarios y validar tipos dinámicos:</p>
        `,
        codigoEjemplo: `def clasificar_transaccion_fiscal(tipo_doc, monto):
    # Evaluación con Structural Pattern Matching moderno (Python 3.10+)
    match tipo_doc.upper():
        case "B01" | "E31": # Facturas con Crédito Fiscal (Tradicional / Electrónica)
            itbis = monto * 0.18
            retencion = monto * 0.30 if monto > 50000 else 0.0
            categoria = "Crédito Fiscal Empresarial"
        case "B02" | "E32": # Consumo Final
            itbis = monto * 0.18
            retencion = 0.0
            categoria = "Consumidor Final"
        case _:
            itbis = 0.0
            retencion = 0.0
            categoria = "Comprobante Genérico / Exento"

    total_neto = monto + itbis - retencion
    return {
        "categoria": categoria,
        "monto_base": monto,
        "itbis_18": round(itbis, 2),
        "retencion": round(retencion, 2),
        "total_a_pagar": round(total_neto, 2)
    }

resultado = clasificar_transaccion_fiscal("E31", 65000)
for clave, val in resultado.items():
    print(f"👉 {clave.upper()}: {val}")`,
        reto: {
          titulo: "Reto #2: Motor de Reglas de Scoring Financiero y Límites de Crédito",
          descripcion: "Implementa una función llamada `evaluar_credito_pyme(ingresos_mensuales, deudas_actuales, score_crediticio, tipo_empresa)` que determine si un cliente califica para un préstamo bancario. Si el score es mayor a 720 y la relación deuda/ingreso es menor al 40%, aprueba con tasa preferencial del 12.5%. Si el score está entre 650 y 719, aprueba con tasa estándar del 16%. Si no, rechaza justificando la causa.",
          codigoInicial: `def evaluar_credito_pyme(ingresos_mensuales, deudas_actuales, score_crediticio, tipo_empresa):
    # Desarrolla la lógica condicional exhaustiva
    pass`
        }
      },
      {
        id: "mod-3",
        numero: "03",
        titulo: "Bucles, Iteraciones y Estructuras de Datos Maestras",
        descripcion: "for, while, equivalencia do-while, listas, tuplas, conjuntos (sets), diccionarios O(1), matrices con NumPy y comprensiones vectorizadas.",
        contenidoHtml: `
          <h4>3.1. Iteración Elegante y la Cláusula else en Bucles</h4>
          <p>El bucle <code>for</code> en Python es en realidad un iterador de objetos (*Foreach*). Una característica única y poco comprendida de Python es el bloque <code>else</code> en bucles <code>for</code> y <code>while</code>: se ejecuta <strong>únicamente si el bucle terminó de forma natural</strong> (sin interrupción por <code>break</code>).</p>

          <h4>3.2. Estructuras de Datos: Rendimiento y Big-O</h4>
          <ul>
            <li><strong>Listas (<code>list</code>):</strong> Arreglos dinámicos contiguos en memoria. Búsqueda O(N), inserción al final O(1).</li>
            <li><strong>Tuplas (<code>tuple</code>):</strong> Secuencias inmutables, más ligeras en memoria y seguras para llaves de diccionarios.</li>
            <li><strong>Diccionarios (<code>dict</code>):</strong> Tablas Hash de alto rendimiento con búsqueda, inserción y borrado promedio en <strong>O(1)</strong>.</li>
            <li><strong>Conjuntos (<code>set</code>):</strong> Colecciones no ordenadas de elementos únicos con operaciones de teoría de conjuntos (unión <code>|</code>, intersección <code>&</code>, diferencia <code>-</code>).</li>
          </ul>
        `,
        codigoEjemplo: `import time

# Comprensión de Listas Vectorizada vs Bucle For Tradicional
N = 100000

# Método 1: Bucle Tradicional con .append()
t0 = time.perf_counter()
cuadrados_loop = []
for i in range(N):
    if i % 2 == 0:
        cuadrados_loop.append(i ** 2)
t_loop = (time.perf_counter() - t0) * 1000

# Método 2: List Comprehension Optimizada en Bytecode C
t0 = time.perf_counter()
cuadrados_comp = [i ** 2 for i in range(N) if i % 2 == 0]
t_comp = (time.perf_counter() - t0) * 1000

print(f"📊 Bucle Tradicional: {t_loop:.2f} ms")
print(f"⚡ List Comprehension: {t_comp:.2f} ms (¡{(t_loop/t_comp):.1f}x más rápida!)")
print(f"Verificación de paridad: {cuadrados_loop == cuadrados_comp}")`,
        reto: {
          titulo: "Reto #3: Conciliador Bancario de Alto Rendimiento en O(N)",
          descripcion: "Crea una función llamada `conciliar_extractos(movimientos_banco, movimientos_erp)` donde cada lista contenga diccionarios con `{'id': int, 'monto': float}`. La función debe encontrar qué movimientos están en el ERP pero faltan en el banco, cuáles están en el banco pero faltan en el ERP, y cuáles coinciden exactamente, operando en complejidad O(N) mediante conjuntos (`set`) o diccionarios.",
          codigoInicial: `def conciliar_extractos(movimientos_banco, movimientos_erp):
    # Implementa la conciliación en O(N)
    pass`
        }
      },
      {
        id: "mod-4",
        numero: "04",
        titulo: "Funciones Avanzadas, Generadores y Manejo Defensivo de Excepciones",
        descripcion: "Parámetros *args y **kwargs, funciones de primera clase, generadores yield para streaming de memoria, decoradores y arquitectura de excepciones.",
        contenidoHtml: `
          <h4>4.1. Generadores (<code>yield</code>): Procesamiento Masivo con Cero Desborde de RAM</h4>
          <p>Cuando procesamos millones de registros de una base de datos o un archivo de 50 GB, cargarlo en una lista satura la memoria física. Los <strong>Generadores</strong> suspenden y reanudan la ejecución evaluando perezosamente (*Lazy Evaluation*) un registro a la vez.</p>
          
          <h4>4.2. Decoradores: Metaprogramación Limpia</h4>
          <p>Un decorador es una función que envuelve a otra función para extender su comportamiento sin modificar su código fuente (Principio Open/Closed de SOLID).</p>
        `,
        codigoEjemplo: `import functools
import time

def auditoria_ejecucion(func):
    """Decorador Enterprise para telemetría y captura de latencia."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        print(f"🚀 [Iniciando]: {func.__name__} con args={args}")
        try:
            resultado = func(*args, **kwargs)
            latencia = (time.perf_counter() - inicio) * 1000
            print(f"✅ [Éxito]: {func.__name__} completado en {latencia:.2f} ms")
            return resultado
        except Exception as err:
            latencia = (time.perf_counter() - inicio) * 1000
            print(f"❌ [Fallo]: {func.__name__} falló tras {latencia:.2f} ms: {err}")
            raise
    return wrapper

@auditoria_ejecucion
def procesar_lote_pagos(cuentas, monto_unitario):
    if monto_unitario <= 0:
        raise ValueError("El monto unitario debe ser positivo.")
    return sum(monto_unitario for _ in cuentas)

total = procesar_lote_pagos(["CLI-001", "CLI-002", "CLI-003"], 12500.50)
print(f"Total procesado en el lote: RD$ {total:,.2f}")`,
        reto: {
          titulo: "Reto #4: Generador de Streaming con Filtro y Reintentos Automáticos",
          descripcion: "Diseña un generador `stream_lector_registros(total_simulado)` que produzca registros uno a uno mediante `yield`, y acompáñalo con un decorador `@auto_reintento(max_intentos=3)` que capture excepciones transitorias de conexión y reintente la ejecución automáticamente antes de fallar.",
          codigoInicial: `def auto_reintento(max_intentos=3):
    # Decorador con lógica de reintentos
    pass`
        }
      },
      {
        id: "mod-5",
        numero: "05",
        titulo: "Programación Orientada a Objetos (POO) Enterprise",
        descripcion: "Clases, constructores __init__, propiedades @property, métodos dunder y los 4 pilares: Encapsulamiento, Abstracción, Herencia y Polimorfismo.",
        contenidoHtml: `
          <h4>5.1. Los 4 Pilares Fundamentales Explicados con Rigor</h4>
          <ol>
            <li><strong>Encapsulamiento:</strong> Ocultamiento de la complejidad interna y estado de un objeto, protegiendo variables críticas mediante atributos privados (<code>__saldo</code>) y exponiendo métodos de acceso validados (<code>@property</code>).</li>
            <li><strong>Abstracción:</strong> Definición de contratos e interfaces puras con <code>abc.ABC</code> y <code>@abstractmethod</code>, separando qué hace el sistema de cómo lo implementa.</li>
            <li><strong>Herencia:</strong> Reutilización y especialización de comportamientos desde una clase base hacia clases derivadas con resolución MRO limpia.</li>
            <li><strong>Polimorfismo:</strong> Capacidad de objetos de diferentes clases de responder a un mismo mensaje o método con comportamientos específicos según su naturaleza.</li>
          </ol>
        `,
        codigoEjemplo: `from abc import ABC, abstractmethod

class MetodoPagoBase(ABC):
    """Clase Base Abstracta (Abstracción)"""
    def __init__(self, moneda="RD$"):
        self.moneda = moneda

    @abstractmethod
    def procesar_cobro(self, monto: float) -> bool:
        pass

class PasarelaTarjeta(MetodoPagoBase):
    """Implementación de Pago con Tarjeta de Crédito (Herencia y Polimorfismo)"""
    def __init__(self, ultimos_digitos: str, moneda="RD$"):
        super().__init__(moneda)
        self.__ultimos_digitos = ultimos_digitos # Encapsulamiento Privado

    def procesar_cobro(self, monto: float) -> bool:
        print(f"💳 Cobro aprobado por {self.moneda} {monto:,.2f} en Tarjeta ****{self.__ultimos_digitos}")
        return True

class PasarelaTransferencia(MetodoPagoBase):
    """Implementación de Pago por Transferencia Bancaria Directa"""
    def __init__(self, cuenta_origen: str, moneda="RD$"):
        super().__init__(moneda)
        self.__cuenta = cuenta_origen

    def procesar_cobro(self, monto: float) -> bool:
        print(f"🏦 Transferencia confirmada por {self.moneda} {monto:,.2f} desde cuenta {self.__cuenta}")
        return True

# Demostración del Polimorfismo puro
pagos: list[MetodoPagoBase] = [
    PasarelaTarjeta("4412"),
    PasarelaTransferencia("102-488921-5")
]

for p in pagos:
    p.procesar_cobro(18450.00)`,
        reto: {
          titulo: "Reto #5: Arquitectura de Cartera de Clientes y Cobranzas con POO",
          descripcion: "Diseña un modelo de clases que incluya `ClienteBase` (abstracto), `ClienteCorporativo` y `ClienteRetail`. Cada cliente debe tener un método `calcular_descuento_volumen(monto_pedido)` y encapsular un historial de compras privado accesible mediante una propiedad de sólo lectura.",
          codigoInicial: `class ClienteBase:
    # Desarrolla la jerarquía completa
    pass`
        }
      },
      {
        id: "mod-6",
        numero: "06",
        titulo: "Dominio Total de Bases de Datos & SQL Server Enterprise",
        descripcion: "Motores vs lenguajes, manual de instalación paso a paso ilustrado con links oficiales, DDL/DML/DCL/TCL, caso comercial real con IDENTITY(1,1), Window Functions, CTEs, Views, SPs y Triggers.",
        contenidoHtml: `
          <h4>6.1. Motores vs Lenguajes: La Diferencia Fundamental</h4>
          <p>Un <strong>motor de base de datos</strong> (como Microsoft SQL Server, PostgreSQL o MySQL) es el software servidor responsable de gestionar el almacenamiento físico en disco, la memoria RAM (Buffer Pool), la concurrencia y las transacciones ACID. El <strong>lenguaje SQL</strong> (Structured Query Language) es el estándar formal de comunicación con ese motor, implementado en SQL Server a través del dialecto <strong>T-SQL (Transact-SQL)</strong> con soporte procedimental, variables y bucles.</p>

          <h4>6.2. Guía Oficial de Instalación Paso a Paso de SQL Server & SSMS</h4>
          <div class="callout-installation">
            <p><strong>1. Microsoft SQL Server 2022 Express / Developer:</strong><br>
            Edición gratuita recomendada para desarrollo empresarial y analítica.<br>
            👉 <a href="https://www.microsoft.com/es-es/sql-server/sql-server-downloads" target="_blank" class="text-info fw-bold">Descargar SQL Server 2022 (Microsoft Oficial)</a></p>
            <p><strong>2. SQL Server Management Studio (SSMS):</strong><br>
            El entorno de administración visual e inspección gráfica de Microsoft.<br>
            👉 <a href="https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms" target="_blank" class="text-info fw-bold">Descargar SSMS Oficial en Español</a></p>
          </div>

          <h4>6.3. Las 4 Familias del Lenguaje SQL</h4>
          <ul>
            <li><strong>DDL (Data Definition Language):</strong> Define la estructura física y lógica (<code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code>).</li>
            <li><strong>DML (Data Manipulation Language):</strong> Manipula los registros de datos (<code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>).</li>
            <li><strong>DCL (Data Control Language):</strong> Gestiona privilegios de seguridad (<code>GRANT</code>, <code>REVOKE</code>).</li>
            <li><strong>TCL (Transaction Control Language):</strong> Asegura la integridad atómica (<code>BEGIN TRANSACTION</code>, <code>COMMIT</code>, <code>ROLLBACK</code>).</li>
          </ul>

          <h4>6.4. Regla Canónica de Gobernanza de Bases de Datos JPV</h4>
          <p>Queda terminantemente prohibido el uso del patrón inseguro <code>SELECT MAX(id) + 1</code>. Toda tabla relacional en SQL Server debe nacer con <code>Id INT IDENTITY(1,1) PRIMARY KEY</code> atómico garantizado por el motor relacional.</p>
        `,
        codigoEjemplo: `-- =====================================================================
-- ESQUEMA COMERCIAL COMPLETO: RETAIL_ENTERPRISE_JPV (SQL SERVER T-SQL)
-- =====================================================================

-- 1. Creación de Tabla de Clientes con IDENTITY(1,1)
CREATE TABLE Clientes (
    ClienteID INT IDENTITY(1,1) PRIMARY KEY,
    NombreComercial NVARCHAR(150) NOT NULL,
    RNC NVARCHAR(20) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL,
    FechaRegistro DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 2. Tabla de Facturas con Llaves Foráneas Consistentes
CREATE TABLE Facturas (
    FacturaID INT IDENTITY(1,1) PRIMARY KEY,
    ClienteID INT NOT NULL,
    NCF NVARCHAR(20) NOT NULL,
    MontoSubtotal DECIMAL(18,2) NOT NULL,
    MontoITBIS DECIMAL(18,2) NOT NULL,
    MontoTotal AS (MontoSubtotal + MontoITBIS) PERSISTED,
    FechaEmision DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Facturas_Clientes FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- 3. Consulta Analítica Avanzada con Common Table Expressions (CTE) y Window Functions
WITH VentasPorCliente AS (
    SELECT 
        c.NombreComercial,
        f.FacturaID,
        f.MontoTotal,
        ROW_NUMBER() OVER(PARTITION BY c.ClienteID ORDER BY f.MontoTotal DESC) as RankingCompra,
        SUM(f.MontoTotal) OVER(PARTITION BY c.ClienteID) as TotalHistoricoCliente
    FROM Clientes c
    INNER JOIN Facturas f ON c.ClienteID = f.ClienteID
)
SELECT * FROM VentasPorCliente WHERE RankingCompra <= 3;`,
        reto: {
          titulo: "Reto #6: Stored Procedure Transaccional con Auditoría y Manejo de Errores",
          descripcion: "Escribe un Stored Procedure en T-SQL llamado `sp_RegistrarVentaEnterprise` que reciba el ClienteID, NCF y Monto. Debe abrir una transacción protegida (`BEGIN TRANSACTION`), insertar la factura, descontar el inventario de una tabla de productos, y si ocurre algún error de clave o saldo insuficiente, aplicar `ROLLBACK` y retornar el error mediante `THROW 50001, 'Error en venta', 1;`.",
          codigoInicial: `CREATE PROCEDURE sp_RegistrarVentaEnterprise
    @ClienteID INT,
    @NCF NVARCHAR(20),
    @Monto DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    -- Desarrolla la transacción protegida con TRY / CATCH
END;`
        }
      },
      {
        id: "mod-7",
        numero: "07",
        titulo: "Pipelines de Analítica, EDA, Visualización, Streamlit e IA Agéntica",
        descripcion: "Conexión Python a SQL Server con pyodbc, Exploratory Data Analysis (EDA), visualización ejecutiva, Dashboards en Streamlit y agentes conversacionales de IA.",
        contenidoHtml: `
          <h4>7.1. El Ciclo de Vida Completo del Dato: Del Motor Relacional a la IA</h4>
          <p>Un ingeniero contemporáneo conecta el almacenamiento relacional con modelos analíticos interactivos y agentes inteligentes:</p>
          <ol>
            <li><strong>Ingesta Segura:</strong> Conexión cifrada vía <code>pyodbc</code> o <code>SQLAlchemy</code> leyendo cursores optimizados sin contención de bloqueos (<code>READ UNCOMMITTED</code> en reportes analíticos).</li>
            <li><strong>Análisis Exploratorio (EDA):</strong> Cálculo de asimetría, curtosis, correlaciones lineales con Pearson/Spearman y detección de *outliers*.</li>
            <li><strong>Storytelling Visual:</strong> Presentación en tableros Bento Grid sin scroll con reglas IBCS y semáforos daltonismo-seguros.</li>
            <li><strong>Aplicaciones Operativas con Streamlit:</strong> Interfaces web interactivas desarrolladas 100% en Python nativo.</li>
            <li><strong>IA Agéntica Grounded:</strong> Integración de Modelos Gemini con llamadas a herramientas (*Function Calling*) para consultar bases de datos en lenguaje natural.</li>
          </ol>
        `,
        codigoEjemplo: `import streamlit as st
import pandas as pd
import numpy as np

# Estándar JPV: Dashboard Ejecutivo de Analítica en Streamlit
st.set_page_config(page_title="DataIADev Analytics", layout="wide")

st.title("📊 Cockpit Ejecutivo de Analítica & Ventas 360°")
st.caption("Arquitectura de Datos: Ing. Juancito Peña Vizcaíno • Estándar Enterprise 2026")

# KPIs en Bento Grid 1x3
col1, col2, col3 = st.columns(3)
col1.metric("Ingresos Totales", "RD$ 4,850,210", "+14.2% vs Meta")
col2.metric("Ticket Promedio", "RD$ 12,450", "+3.8%")
col3.metric("Cumplimiento DGII", "100%", "Cero Discrepancias")

# Gráfico de Tendencia
datos_mes = pd.DataFrame({
    "Semana": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    "Facturacion": [950000, 1200000, 1350000, 1350210]
})
st.bar_chart(datos_mes.set_index("Semana"))`,
        reto: {
          titulo: "Reto #7: Pipeline de Detección de Anomalías con Streamlit y Alerta IA",
          descripcion: "Crea una mini-aplicación en Streamlit que reciba un DataFrame de ventas, calcule las ventas que caen a más de 2 desviaciones estándar de la media (anomalías estadísticas) y las presente resaltadas en una tabla interactiva con semáforo rojo.",
          codigoInicial: `import streamlit as st
import pandas as pd
import numpy as np

# Desarrolla el pipeline interactivo de anomalías
`
        }
      }
    ]
  },

  taller_mapas_calor: {
    id: "taller_mapas_calor",
    titulo: "Taller Técnico Oficial: Mapas de Calor con Seaborn y Matplotlib",
    subtitulo: "Dominio de Matrices Numéricas, Correlaciones, Triage Hospitalario, Ciberseguridad y Dashboards Ejecutivos 2x2",
    categoria: "Taller Práctico Especializado",
    version: "Edición Master Class 2026",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#f59e0b",
    icono: "bi-grid-3x3-gap-fill",
    modulos: [
      {
        id: "tmc-1",
        numero: "01",
        titulo: "Fundamentos de Mapas de Calor: De Matrices a Percepción Visual",
        descripcion: "Uso de sns.heatmap, parámetros annot, cmap, cbar y cómo un analista de datos lee patrones visuales en menos de 10 segundos.",
        contenidoHtml: `
          <p>En este proyecto utilizamos Python junto con las librerías <strong>Seaborn y Matplotlib</strong> para transformar una matriz numérica en un mapa de calor (*Heatmap*). Este tipo de visualización permite identificar picos y caídas mediante gradientes cromáticos, facilitando auditorías sin leer fila por fila.</p>
        `,
        codigoEjemplo: `import seaborn as sns
import matplotlib.pyplot as plt

# 1. Matriz de calificaciones (Estudiantes x Materias)
calificaciones = [
    [85, 90, 78],
    [92, 88, 95],
    [65, 70, 60]
]

fig, ax = plt.subplots(figsize=(6, 4))
sns.heatmap(calificaciones, annot=True, fmt="d", cmap="YlGnBu", 
            xticklabels=["Matemáticas", "Física", "Química"],
            yticklabels=["Carlos", "Ana", "Pedro"], ax=ax)

ax.set_title("Calificaciones Académicas por Asignatura", fontweight="bold")
plt.tight_layout()
plt.show()`,
        reto: {
          titulo: "Reto: Mapa de Calor de Calificaciones con Línea de Corte",
          descripcion: "Modifica el mapa de calor para que destaque con un mapa de color divergente ('RdYlGn') a los alumnos con notas por debajo de 70 en rojo y por encima de 85 en verde brillante.",
          codigoInicial: `import seaborn as sns
import matplotlib.pyplot as plt
# Tu código aquí`
        }
      },
      {
        id: "tmc-2",
        numero: "02",
        titulo: "Radar de Ciberseguridad 24/7 y Triage Hospitalario",
        descripcion: "Mapas de calor multidimensionales con NumPy para monitoreo continuo de tráfico de red y picos de urgencias médicas.",
        contenidoHtml: `
          <p>Casos de estudio reales donde el calor visual salva vidas o previene ataques DDoS: matrices de 24 horas x 7 días de la semana con correlación temporal.</p>
        `,
        codigoEjemplo: `import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Matriz 24 horas x 7 días
np.random.seed(42)
trafico_red = np.random.poisson(lam=120, size=(24, 7))
# Simulación de ataque DDoS en la madrugada del sábado
trafico_red[2:5, 5] += 450

dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
horas = [f"{h:02d}:00" for h in range(24)]

fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(trafico_red, cmap="magma", cbar_kws={'label': 'Peticiones/segundo'},
            xticklabels=dias, yticklabels=horas, ax=ax)

ax.set_title("Radar de Ciberseguridad 24/7 (Detección de Anomalías DDoS)", fontweight="bold")
plt.tight_layout()
plt.show()`,
        reto: {
          titulo: "Reto: Triage Hospitalario por Urgencias",
          descripcion: "Construye una matriz de 7 días x 3 turnos (Mañana, Tarde, Noche) con la afluencia de heridos, etiquetando los valores con `annot=True` y configurando un color rojo intenso ('Reds') en el turno más crítico.",
          codigoInicial: `import seaborn as sns
# Desarrolla el triage hospitalario`
        }
      }
    ]
  },

  taller_apis_publicas: {
    id: "taller_apis_publicas",
    titulo: "Taller Técnico Oficial: Consumo de APIs Públicas en Python sin API Key",
    subtitulo: "Protocolo HTTP, REST APIs, JSON Parsing, Clima en Vivo, Criptomonedas y Proyectos 100% Gratuitos en Consola",
    categoria: "Taller Práctico Especializado",
    version: "Edición Master Class 2026",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#10b981",
    icono: "bi-cloud-arrow-down-fill",
    modulos: [
      {
        id: "tap-1",
        numero: "01",
        titulo: "El Clima en Vivo con Open-Meteo (Cero Registros, Cero Costo)",
        descripcion: "Conexión a servidores meteorológicos mundiales utilizando urllib y requests, parsing del JSON de respuesta y presentación en consola.",
        contenidoHtml: `
          <p>Conectamos Python directamente con la API meteorológica de <strong>Open-Meteo</strong> para consultar en tiempo real la temperatura, velocidad del viento y humedad en Santo Domingo sin contraseñas ni tarjetas de crédito.</p>
        `,
        codigoEjemplo: `import requests

# Consulta de Clima en Vivo (Santo Domingo: Lat 18.48, Lon -69.93)
url = "https://api.open-meteo.com/v1/forecast?latitude=18.48&longitude=-69.93&current_weather=true"

respuesta = requests.get(url).json()
clima = respuesta.get("current_weather", {})

print("🌤️ REPORTE DEL CLIMA EN VIVO — SANTO DOMINGO (DataIADev)")
print(f"🌡️ Temperatura Actual: {clima.get('temperature')} °C")
print(f"💨 Velocidad del Viento: {clima.get('windspeed')} km/h")
print(f"🧭 Código de Condición Meteorológica: {clima.get('weathercode')}")`,
        reto: {
          titulo: "Reto: Comparador Meteorológico Multi-Ciudad",
          descripcion: "Crea una función `comparar_clima(ciudades_dict)` que reciba un diccionario de ciudades con sus coordenadas (ej. Santiago de los Caballeros, Madrid, Nueva York, Tokio) e imprima una tabla ordenada de la ciudad más fría a la más calurosa.",
          codigoInicial: `def comparar_clima(ciudades):
    # Consume Open-Meteo para múltiples coordenadas
    pass`
        }
      },
      {
        id: "tap-2",
        numero: "02",
        titulo: "Cotización de Criptomonedas y Divisas en Tiempo Real",
        descripcion: "Consumo de endpoints públicos de Coinbase y CoinGecko para monitorear Bitcoin, Ethereum y paridades de divisas sin intermediarios.",
        contenidoHtml: `
          <p>Cómo las aplicaciones financieras obtienen información instantánea del mercado conectándose a APIs públicas de endpoints spot sin costos de suscripción.</p>
        `,
        codigoEjemplo: `import requests

# Cotización en Vivo de Bitcoin y Ethereum en USD
url_btc = "https://api.coinbase.com/v2/prices/BTC-USD/spot"
url_eth = "https://api.coinbase.com/v2/prices/ETH-USD/spot"

precio_btc = float(requests.get(url_btc).json()["data"]["amount"])
precio_eth = float(requests.get(url_eth).json()["data"]["amount"])

print("💎 MONITOR FINANCIERO CRIPTO EN VIVO (DataIADev)")
print(f"🪙 Bitcoin (BTC):  USD \${precio_btc:,.2f}")
print(f"⚡ Ethereum (ETH): USD \${precio_eth:,.2f}")
print(f"📈 Ratio BTC / ETH: {(precio_btc / precio_eth):.2f}x")`,
        reto: {
          titulo: "Reto: Alerta de Volatilidad de Criptomonedas",
          descripcion: "Escribe un script que consulte el precio de Bitcoin, espere 5 segundos, consulte de nuevo y calcule la variación porcentual y nominal en USD, mostrando un mensaje de ALERTA si la variación supera el 0.05%.",
          codigoInicial: `import requests, time
# Tu código aquí`
        }
      }
    ]
  }
};
