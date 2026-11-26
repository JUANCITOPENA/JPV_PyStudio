import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from pdf_engine_core import (
    NumberedCanvas, get_editorial_styles, create_concept_box, create_case_box,
    create_challenge_box, add_code_block, create_output_block, build_cover_page
)

def generar_libro_1():
    pdf_path = "pdf/01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.85 * inch
    )

    styles = get_editorial_styles()
    story = []

    # 1. Portada Oficial
    story.extend(build_cover_page(
        title="Python Masterclass Integral:<br/>Desde la Consola y POO hasta SQL Server, Dashboards y Agentes de IA",
        subtitle="Manual Canónico de Programación Profesional, Arquitectura de Datos, Modelado Relacional y Soluciones de Inteligencia Artificial",
        volume_tag="Volumen 1 de 3 • Manual Académico & Corporativo",
        styles=styles
    ))

    # --------------------------------------------------------------------------
    # CAPÍTULO 1: ECOSISTEMA, HISTORIA Y MAPA DE LIBRERÍAS
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 1: Ecosistema, Historia y Taxonomía del Lenguaje", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "¿Qué es la Programación y por qué Python lidera la industria?",
        "La programación es el proceso estructurado de diseñar, codificar, depurar y mantener instrucciones lógicas que una computadora ejecuta para transformar datos en valor. "
        "Python es un lenguaje de programación de alto nivel, multiparadigma (orientado a objetos, imperativo y funcional), interpretado y con tipado dinámico fuerte. "
        "Creado por el matemático e informático neerlandés <b>Guido van Rossum</b> a finales de los años 80 y lanzado formalmente en <b>1991</b>, Python fue diseñado bajo el principio rector de que "
        "<i>«el código se lee muchas más veces de las que se escribe»</i>, priorizando la legibilidad radical sobre la sintaxis barroca.",
        styles
    ))
    story.append(Spacer(1, 10))

    story.append(create_case_box(
        "Adopción Corporativa Global de Python",
        "Hoy en día, Python es la columna vertebral de los mayores gigantes tecnológicos del planeta: "
        "<b>Google</b> lo utiliza en sus motores de indexación, APIs y TensorFlow; <b>Netflix</b> gestiona su infraestructura de distribución de contenidos (CDN) y algoritmos de recomendación con Python; "
        "la <b>NASA</b> procesa telemetría aeroespacial y fotografía cósmica del Telescopio James Webb; <b>Spotify</b> orquesta su analítica musical masiva; y en el sector financiero y bancario "
        "(JP Morgan, Goldman Sachs), Python es el estándar indiscutible para modelado cuantitativo, análisis de riesgo y trading algorítmico.",
        styles
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Taxonomía Integral de Librerías del Ecosistema Python</b>", styles['H2_Section']))
    story.append(Paragraph(
        "El éxito de Python no radica únicamente en su sintaxis limpia, sino en su gigantesco repositorio de paquetes (PyPI). A continuación se clasifica el stack maestro que todo profesional debe dominar:",
        styles['EditorialBody']
    ))

    # Tabla estilizada de librerías
    tabla_lib_data = [
        ["Área de Especialidad", "Librerías Oficiales", "Propósito y Escenario de Uso"],
        ["Programación General & APIs", "requests, httpx, fastapi, pydantic", "Desarrollo de microservicios REST, serialización y clientes HTTP"],
        ["Análisis y Manipulación", "pandas, numpy, polars, pyarrow", "Estructuras DataFrame, cómputo matricial SIMD y formatos Parquet"],
        ["Ingeniería de Datos & ETL", "sqlalchemy, pyodbc, duckdb, dbt", "Conexión a bases relacionales, staging columnar y transformaciones"],
        ["Ciencia de Datos & ML", "scikit-learn, statsmodels, xgboost", "Clasificación, regresión, clustering y validación estadística"],
        ["Deep Learning & Redes", "pytorch, tensorflow, keras, transformers", "Redes neuronales profundas, NLP y modelos fundacionales"],
        ["Visualización Ejecutiva", "matplotlib, seaborn, plotly, altair", "Gráficos estáticos de alta resolución y dashboards interactivos"],
        ["Formatos de Archivo & I/O", "openpyxl, reportlab, xml.etree, pypdf", "Lectura y generación de Excel, PDF, JSON, XML y CSV nativos"]
    ]
    t_lib = Table(tabla_lib_data, colWidths=[1.8*inch, 2.2*inch, 3.0*inch])
    t_lib.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_lib)
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 2: FUNDAMENTOS DEL LENGUAJE, TIPADO DINÁMICO Y OPERADORES
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 2: Fundamentos del Lenguaje, Tipado Dinámico y Operadores", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Variables, Tipos Escalares e Inmutabilidad",
        "En Python, las variables no son cajas que almacenan datos con tipo rígido, sino <b>referencias (punteros etiquetados)</b> a objetos en memoria dinámica (Heap). "
        "Python posee tipado dinámico (el intérprete deduce el tipo en tiempo de ejecución) y tipado fuerte (no realiza conversiones mágicas incoherentes entre tipos incompatibles). "
        "Los tipos primitivos fundamentales son: <code>int</code> (enteros de precisión arbitraria), <code>float</code> (punto flotante IEEE 754 de 64 bits), <code>str</code> (cadenas Unicode inmutables) y <code>bool</code> (booleanos True/False).",
        styles
    ))
    story.append(Spacer(1, 10))

    code_fundamentos = """# 01_fundamentos_tipado.py
# Asignación simple y asignación múltiple desempaquetada
tasa_itbis: float = 0.18
empresa_nombre, rnc_comercial = "Distribuidora Caribe SAS", "101-99887-2"
monto_subtotal = 145000.50

# Operadores aritméticos y de pertenencia
impuesto_calculado = monto_subtotal * tasa_itbis
total_a_pagar = monto_subtotal + impuesto_calculado

# Operadores de identidad (is) vs igualdad por valor (==)
lista_a = [10, 20, 30]
lista_b = [10, 20, 30]
son_iguales = (lista_a == lista_b)     # True (mismo contenido)
son_identicas = (lista_a is lista_b)   # False (diferente posición de memoria)

# Interpolación moderna con f-strings formateados
print(f"Factura para: {empresa_nombre} (RNC: {rnc_comercial})")
print(f"Subtotal:     RD$ {monto_subtotal:12,.2f}")
print(f"ITBIS (18%):  RD$ {impuesto_calculado:12,.2f}")
print(f"Total Neto:   RD$ {total_a_pagar:12,.2f}")"""

    add_code_block(story, "01_fundamentos_tipado.py", code_fundamentos, styles)
    story.append(Spacer(1, 8))

    salida_fundamentos = """Factura para: Distribuidora Caribe SAS (RNC: 101-99887-2)
Subtotal:     RD$   145,000.50
ITBIS (18%):  RD$    26,100.09
Total Neto:   RD$   171,100.59"""
    story.append(create_output_block(salida_fundamentos, styles))
    story.append(Spacer(1, 10))

    story.append(create_challenge_box(
        "Reto Práctico #1: Validador de Facturación y Descuentos Escalonados",
        "Diseña un script que reciba el monto de una compra y aplique: 0% si es menor a $10,000; 5% si está entre $10,000 y $50,000; y 10% si supera $50,000. "
        "Calcula el ITBIS (18%) sobre el monto neto descontado y presenta un ticket en consola con formato contable alineado a la derecha.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 3: CONTROL DE FLUJO Y BUCLES
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 3: Estructuras de Control de Flujo y Bucles", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Bifurcaciones Lógicas, Match-Case y Bucles Idiomáticos",
        "El control de flujo permite alterar la secuencia de ejecución lineal del programa. Python ofrece <code>if / elif / else</code> para condicionales booleanas y "
        "<code>match-case</code> (introducido en Python 3.10) para coincidencia de patrones estructurales. "
        "Para iteración existen dos bucles nativos: <code>for</code> (que funciona intrínsecamente como un <i>foreach</i> consumiendo un iterador) y <code>while</code> (controlado por condición). "
        "En Python no existe la palabra reservada <code>do-while</code>; su equivalencia idiomática perfecta es <code>while True: ... if condicion_salida: break</code>.",
        styles
    ))
    story.append(Spacer(1, 10))

    code_bucles = """# 02_control_flujo_bucles.py
# 1. Coincidencia de patrones con match-case
def clasificar_transaccion(codigo_estado: str) -> str:
    match codigo_estado.upper():
        case "APR": return "🟢 Transacción Aprobada Exitosamente"
        case "REJ": return "🔴 Rechazada por Límite de Crédito"
        case "REV": return "🟡 En Revisión de Fraude y Riesgo"
        case _:     return "⚪ Estado Desconocido"

# 2. Iteración foreach con enumeración y cálculo de acumulados
transacciones = [1250.00, 4800.50, 950.00, 15300.00, 320.00]
total_procesado = 0.0

print("--- AUDITORÍA DE LOTES DE VENTA ---")
for indice, monto in enumerate(transacciones, start=1):
    total_procesado += monto
    print(f"Item #{indice:02d}: Monto RD$ {monto:9,.2f} | Acumulado: RD$ {total_procesado:9,.2f}")

# 3. Simulación idiomática de Do-While para reintentos con backoff
intentos = 0
max_intentos = 3
conexion_exitosa = False

while True:
    intentos += 1
    # Simular intento de conexión a gateway de pagos
    if intentos == 2:
        conexion_exitosa = True
    print(f"Intento de conexión #{intentos} -> {'Conectado' if conexion_exitosa else 'Fallo'}")
    if conexion_exitosa or intentos >= max_intentos:
        break"""

    add_code_block(story, "02_control_flujo_bucles.py", code_bucles, styles)
    story.append(Spacer(1, 8))

    salida_bucles = """--- AUDITORÍA DE LOTES DE VENTA ---
Item #01: Monto RD$  1,250.00 | Acumulado: RD$  1,250.00
Item #02: Monto RD$  4,800.50 | Acumulado: RD$  6,050.50
Item #03: Monto RD$    950.00 | Acumulado: RD$  7,000.50
Item #04: Monto RD$ 15,300.00 | Acumulado: RD$ 22,300.50
Item #05: Monto RD$    320.00 | Acumulado: RD$ 22,620.50
Intento de conexión #1 -> Fallo
Intento de conexión #2 -> Conectado"""
    story.append(create_output_block(salida_bucles, styles))
    story.append(Spacer(1, 10))

    story.append(create_challenge_box(
        "Reto Práctico #2: Procesador de Nómina y Turnos Rotativos con Cláusula Else",
        "Construye un programa que itere una lista de empleados con sus horas laboradas. Las primeras 40 horas se pagan a tarifa regular ($250/h) y las horas excedentes al 150%. "
        "Utiliza la cláusula <code>for-else</code> para validar si la nómina completa se calculó sin interrupciones o si saltó por alguna anomalía.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 4: ESTRUCTURAS DE DATOS, FUNCIONES Y EXCEPCIONES
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 4: Estructuras de Datos, Funciones y Manejo de Excepciones", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Colecciones Nativas, Funciones de Primera Clase y Resiliencia",
        "Python cuenta con estructuras de datos de alto rendimiento optimizadas en C: "
        "<b>Listas</b> (mutables, ordenadas), <b>Tuplas</b> (inmutables, protegidas contra mutación accidental), <b>Conjuntos / Sets</b> (elementos únicos con operaciones matemáticas de álgebra de Boole en O(1)), y <b>Diccionarios</b> (tablas hash clave-valor en O(1)). "
        "Las funciones son <i>ciudadanos de primera clase</i> (pueden asignarse a variables, pasarse como argumentos y retornar de otras funciones). "
        "El manejo de excepciones con <code>try / except / else / finally</code> asegura la continuidad operativa y evita la caída del proceso ante fallos inesperados.",
        styles
    ))
    story.append(Spacer(1, 10))

    code_estructuras = """# 03_colecciones_funciones_excepciones.py
from typing import List, Dict, Any

# Excepción empresarial personalizada
class FondosInsuficientesError(Exception):
    def __init__(self, cuenta_id: str, balance: float, monto: float):
        self.mensaje = f"Error en {cuenta_id}: Balance RD${balance:,.2f} insuficiente para retiro de RD${monto:,.2f}"
        super().__init__(self.mensaje)

# Función con *args, **kwargs y decorador de auditoría
def auditar_operacion(funcion):
    def wrapper(*args, **kwargs):
        print(f"🔒 [AUDITORÍA] Ejecutando: {funcion.__name__}...")
        resultado = funcion(*args, **kwargs)
        print("✅ [AUDITORÍA] Operación confirmada en bitácora.")
        return resultado
    return wrapper

@auditar_operacion
def procesar_retiro(cuentas: Dict[str, float], cuenta_id: str, monto: float) -> float:
    if cuenta_id not in cuentas:
        raise KeyError(f"La cuenta {cuenta_id} no existe en el sistema.")
    balance_actual = cuentas[cuenta_id]
    if monto > balance_actual:
        raise FondosInsuficientesError(cuenta_id, balance_actual, monto)
    cuentas[cuenta_id] -= monto
    return cuentas[cuenta_id]

# Ejecución controlada con bloque try-except robusto
banco_datos = {"CTA-001": 50000.00, "CTA-002": 1200.00}

try:
    nuevo_bal = procesar_retiro(banco_datos, "CTA-001", 15000.00)
    print(f"Nuevo balance CTA-001: RD$ {nuevo_bal:,.2f}")
    # Intento de sobregiro que dispara excepción propia
    procesar_retiro(banco_datos, "CTA-002", 5000.00)
except FondosInsuficientesError as e_fondos:
    print(f"⚠️ Alerta Bancaria: {e_fondos}")
except Exception as e_gen:
    print(f"❌ Error Inesperado: {e_gen}")
finally:
    print("📋 Finalizado cierre de sesión bancaria.")"""

    add_code_block(story, "03_colecciones_funciones_excepciones.py", code_estructuras, styles)
    story.append(Spacer(1, 8))

    salida_estructuras = """🔒 [AUDITORÍA] Ejecutando: procesar_retiro...
✅ [AUDITORÍA] Operación confirmada en bitácora.
Nuevo balance CTA-001: RD$ 35,000.00
🔒 [AUDITORÍA] Ejecutando: procesar_retiro...
⚠️ Alerta Bancaria: Error en CTA-002: Balance RD$1,200.00 insuficiente para retiro de RD$5,000.00
📋 Finalizado cierre de sesión bancaria."""
    story.append(create_output_block(salida_estructuras, styles))
    story.append(Spacer(1, 10))

    story.append(create_challenge_box(
        "Reto Práctico #3: Deduplicador y Agrupador de Clientes Multi-Fuente",
        "Dado un lote de 1,000 registros con duplicados, utiliza conjuntos (<code>set</code>) y diccionarios para agrupar compras por cliente en tiempo O(N). "
        "Construye un generador (<code>yield</code>) que procese streaming de transacciones una a una sin desbordar la memoria RAM del servidor.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 5: PROGRAMACIÓN ORIENTADA A OBJETOS (POO)
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 5: Programación Orientada a Objetos (POO)", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Los 4 Pilares de la Programación Orientada a Objetos",
        "La POO es un paradigma que organiza el software en torno a entidades autocontenidas llamadas <b>Objetos</b>, que encapsulan estado (atributos) y comportamiento (métodos). "
        "Se fundamenta en 4 pilares: "
        "<b>1. Abstracción:</b> Ocultar la complejidad interna y exponer únicamente interfaces esenciales. "
        "<b>2. Encapsulamiento:</b> Proteger el acceso directo a los datos internos mediante atributos privados y propiedades controladas (<code>@property</code>). "
        "<b>3. Herencia:</b> Reutilizar y especializar lógica desde clases base hacia clases derivadas evitando duplicación (DRY). "
        "<b>4. Polimorfismo:</b> Capacidad de tratar objetos de diferentes clases mediante una misma interfaz común ejecutando comportamientos especializados.",
        styles
    ))
    story.append(Spacer(1, 10))

    code_poo = """# 04_arquitectura_poo_enterprise.py
from abc import ABC, abstractmethod

# 1. Abstracción: Clase Base Abstracta (Contrato)
class CuentaBancaria(ABC):
    def __init__(self, numero_cuenta: str, titular: str, saldo_inicial: float):
        self.numero_cuenta = numero_cuenta
        self.titular = titular
        self._saldo = saldo_inicial  # Encapsulamiento protegido

    @property
    def saldo(self) -> float:
        return self._saldo

    @abstractmethod
    def calcular_interes_mensual(self) -> float:
        \"\"\"Obliga a cada subclase a implementar su propia lógica de rentabilidad.\"\"\"
        pass

    def depositar(self, monto: float):
        if monto <= 0: raise ValueError("Monto debe ser positivo.")
        self._saldo += monto

# 2. Herencia y Polimorfismo: Cuentas Especializadas
class CuentaAhorro(CuentaBancaria):
    def __init__(self, numero: str, titular: str, saldo: float, tasa_anual: float = 0.045):
        super().__init__(numero, titular, saldo)
        self.tasa_anual = tasa_anual

    def calcular_interes_mensual(self) -> float:
        return self._saldo * (self.tasa_anual / 12)

class CuentaInversionFondo(CuentaBancaria):
    def __init__(self, numero: str, titular: str, saldo: float, rendimiento_variable: float):
        super().__init__(numero, titular, saldo)
        self.rendimiento_variable = rendimiento_variable

    def calcular_interes_mensual(self) -> float:
        # Los fondos de inversión liquidan dividendos con retención fiscal
        ganancia_bruta = self._saldo * (self.rendimiento_variable / 12)
        retencion_dgii = ganancia_bruta * 0.10  # 10% retención sobre intereses
        return ganancia_bruta - retencion_dgii

# 3. Demostración de Polimorfismo en Producción
cartera_cuentas = [
    CuentaAhorro("AHO-101", "María Santos", 150000.00),
    CuentaInversionFondo("INV-902", "Inversiones Caribe SRL", 850000.00, rendimiento_variable=0.115)
]

print("--- LIQUIDACIÓN MENSUAL DE RENDIMIENTOS ---")
for c in cartera_cuentas:
    interes = c.calcular_interes_mensual()
    c.depositar(interes)
    print(f"Cuenta: {c.numero_cuenta} ({c.titular}) | Interés Abonado: RD$ {interes:8,.2f} | Saldo Final: RD$ {c.saldo:10,.2f}")"""

    add_code_block(story, "04_arquitectura_poo_enterprise.py", code_poo, styles)
    story.append(Spacer(1, 8))

    salida_poo = """--- LIQUIDACIÓN MENSUAL DE RENDIMIENTOS ---
Cuenta: AHO-101 (María Santos) | Interés Abonado: RD$   562.50 | Saldo Final: RD$ 150,562.50
Cuenta: INV-902 (Inversiones Caribe SRL) | Interés Abonado: RD$ 7,331.25 | Saldo Final: RD$ 857,331.25"""
    story.append(create_output_block(salida_poo, styles))
    story.append(Spacer(1, 10))

    story.append(create_challenge_box(
        "Reto Práctico #4: E-Commerce y Pasarela de Pagos Multimoneda con POO",
        "Modela una clase base <code>MetodoPago</code> con subclases <code>TarjetaCredito</code>, <code>TransferenciaACH</code> y <code>Criptomoneda</code>. "
        "Aplica el principio de Sustitución de Liskov (LSP) y encapsula el CVV y tokenización en propiedades privadas de sólo escritura.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 6: BASES DE DATOS & SQL SERVER PROFESIONAL
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 6: Bases de Datos & SQL Server Profesional", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Bases de Datos Relacionales (RDBMS), Taxonomía SQL y Enlaces Oficiales",
        "Un Sistema Gestor de Bases de Datos Relacionales (RDBMS) garantiza las propiedades <b>ACID</b> (Atomicidad, Consistencia, Aislamiento y Durabilidad). "
        "El lenguaje SQL se clasifica en 4 sublenguajes maestros: "
        "<b>DDL (Data Definition Language):</b> CREATE, ALTER, DROP, TRUNCATE. "
        "<b>DML (Data Manipulation Language):</b> SELECT, INSERT, UPDATE, DELETE. "
        "<b>DCL (Data Control Language):</b> GRANT, REVOKE. "
        "<b>TCL (Transaction Control Language):</b> BEGIN TRANSACTION, COMMIT, ROLLBACK.<br/><br/>"
        "<b>📥 ENLACES OFICIALES DE INSTALACIÓN GRATUITA:</b><br/>"
        "• <b>Microsoft SQL Server 2022 Express:</b> <font color='#2563EB'><u>https://www.microsoft.com/en-us/sql-server/sql-server-downloads</u></font><br/>"
        "• <b>SQL Server Management Studio (SSMS 20):</b> <font color='#2563EB'><u>https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms</u></font>",
        styles
    ))
    story.append(Spacer(1, 10))

    code_sql = """-- 05_creacion_base_datos_comercial.sql
-- 1. DDL: Creación de Esquema Normalizado y Llaves Primarias IDENTITY(1,1)
CREATE DATABASE COMERCIO_JPV_PRO;
GO
USE COMERCIO_JPV_PRO;
GO

CREATE TABLE Clientes (
    ClienteID INT IDENTITY(1,1) PRIMARY KEY,
    NombreComercial VARCHAR(100) NOT NULL,
    RNC_Cedula VARCHAR(20) UNIQUE NOT NULL,
    LimiteCredito DECIMAL(12,2) DEFAULT 50000.00,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

CREATE TABLE Facturas (
    FacturaID INT IDENTITY(1,1) PRIMARY KEY,
    ClienteID INT NOT NULL FOREIGN KEY REFERENCES Clientes(ClienteID),
    NumeroNCF VARCHAR(19) NOT NULL UNIQUE,  -- E.g. B0100000001
    MontoBruto DECIMAL(12,2) NOT NULL,
    MontoITBIS DECIMAL(12,2) NOT NULL,
    TotalFactura AS (MontoBruto + MontoITBIS) PERSISTED,
    FechaEmision DATE DEFAULT CAST(GETDATE() AS DATE),
    Estado VARCHAR(20) CHECK (Estado IN ('EMITIDA', 'PAGADA', 'ANULADA'))
);

-- 2. DML Avanzado: Window Functions y Common Table Expressions (CTE)
WITH ReporteVentas_CTE AS (
    SELECT 
        C.NombreComercial,
        F.NumeroNCF,
        F.TotalFactura,
        ROW_NUMBER() OVER (PARTITION BY C.ClienteID ORDER BY F.TotalFactura DESC) AS RankVentaCliente,
        SUM(F.TotalFactura) OVER (PARTITION BY C.ClienteID) AS AcumuladoHistoricoCliente
    FROM Clientes C
    INNER JOIN Facturas F ON C.ClienteID = F.ClienteID
    WHERE F.Estado <> 'ANULADA'
)
SELECT * FROM ReporteVentas_CTE WHERE RankVentaCliente <= 3;

-- 3. Stored Procedure Transaccional con Manejo Atómico de Errores
CREATE PROCEDURE sp_RegistrarFacturaVenta
    @ClienteID INT,
    @NumeroNCF VARCHAR(19),
    @MontoBruto DECIMAL(12,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            DECLARE @ITBIS DECIMAL(12,2) = @MontoBruto * 0.18;
            INSERT INTO Facturas (ClienteID, NumeroNCF, MontoBruto, MontoITBIS, Estado)
            VALUES (@ClienteID, @NumeroNCF, @MontoBruto, @ITBIS, 'EMITIDA');
        COMMIT TRANSACTION;
        PRINT 'Factura timbrada exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO"""

    add_code_block(story, "05_creacion_base_datos_comercial.sql", code_sql, styles)
    story.append(Spacer(1, 10))

    story.append(create_case_box(
        "Integración Python + SQL Server con pyodbc y SQLAlchemy",
        "En un entorno productivo de alta concurrencia, Python consume SQL Server mediante <b>SQLAlchemy</b> y controladores <b>ODBC Driver 18 for SQL Server</b>. "
        "Las consultas se ejecutan con transacciones protegidas y se cargan directamente en DataFrames vectorizados de Pandas en milisegundos sin contención de bloqueos.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # CAPÍTULO 7: PIPELINES DE DATOS, STREAMLIT E IA AGÉNTICA
    # --------------------------------------------------------------------------
    story.append(Paragraph("Capítulo 7: Pipelines de Datos, Streamlit e IA Agéntica", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "Arquitectura End-to-End: De la Base Relacional al Dashboard y Agentes",
        "El ciclo moderno de ingeniería de software conecta el motor transaccional SQL Server con Python para tres propósitos simultáneos: "
        "<b>1. Pipelines ETL Automatizados:</b> Extracción, transformación con Pandas y persistencia en data lakehouses. "
        "<b>2. Aplicaciones Analíticas con Streamlit:</b> Generación de cockpits ejecutivos en tiempo real con Bento Grids y cero HTML manual. "
        "<b>3. Agentes Autónomos de Inteligencia Artificial:</b> Integración con modelos Gemini 2.5 / 3.x para consulta en lenguaje natural (NL-to-SQL) y ejecución de herramientas de sistema seguras.",
        styles
    ))
    story.append(Spacer(1, 10))

    code_pipeline = """# 06_pipeline_streamlit_agente_ia.py
import streamlit as st
import pandas as pd
from google import genai
from google.genai import types

# 1. Configuración de página y estética Bento Grid
st.set_page_config(page_title="Executive Analytics Cockpit", layout="wide")
st.title("🚀 Tablero Ejecutivo de Facturación & Analítica con IA")

# 2. Pipeline de Datos Simulado
@st.cache_data
def cargar_dataset_transaccional():
    return pd.DataFrame({
        "Cliente": ["Supermercado Central", "Ferretería Moderna", "Farmacia Nacional", "Hotel Del Sol"],
        "Ventas_RD": [1850000.0, 920000.0, 640000.0, 2150000.0],
        "Margen_Pct": [24.5, 18.2, 31.0, 42.8]
    })

df = cargar_dataset_transaccional()

# 3. Métricas Bento Cards
col1, col2, col3 = st.columns(3)
col1.metric("Ventas Totales", f"RD$ {df['Ventas_RD'].sum():,.2f}", "+14.2% vs SPLY")
col2.metric("Clientes Activos", f"{len(df)} Corporaciones", "100% Retención")
col3.metric("Margen Promedio", f"{df['Margen_Pct'].mean():.1f}%", "+2.4% vs Target")

st.bar_chart(df.set_index("Cliente")["Ventas_RD"])

# 4. Agente de IA Asistente Integrado
pregunta = st.text_input("💬 Pregunta al Agente Inteligente sobre tus datos:")
if pregunta and st.button("Consultar"):
    # Conexión directa a Google GenAI SDK 2026
    client = genai.Client()
    prompt = f"Contexto de negocio: {df.to_dict()}. Responde concisamente a la consulta: {pregunta}"
    respuesta = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    st.success(respuesta.text)"""

    add_code_block(story, "06_pipeline_streamlit_agente_ia.py", code_pipeline, styles)
    story.append(Spacer(1, 15))

    story.append(create_challenge_box(
        "Reto Maestro Final: Despliegue de un Agente NL-to-SQL con Memoria de Sesión",
        "Conecta el pipeline anterior a la base de datos `COMERCIO_JPV_PRO`. Crea una herramienta (Tool Calling) en Gemini que tome la pregunta en lenguaje natural, "
        "genere la consulta SQL de solo lectura (con cláusula WITH READ UNCOMMITTED), la ejecute de forma aislada en el servidor y grafique los resultados automáticamente en Streamlit.",
        styles
    ))

    # Construir PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Libro 1 generado exitosamente en: {pdf_path}")

if __name__ == "__main__":
    generar_libro_1()
