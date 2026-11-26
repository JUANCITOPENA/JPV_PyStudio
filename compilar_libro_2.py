import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from pdf_engine_core import (
    NumberedCanvas, get_editorial_styles, create_concept_box, create_case_box,
    create_challenge_box, add_code_block, build_cover_page
)

def generar_libro_2():
    pdf_path = "pdf/02_LIBRO_ANALISIS_DATOS_GRAFICOS_SEABORN_MATPLOTLIB_PRO.pdf"
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
        title="Analítica Visual y Ciencia de Datos con Python:<br/>Mapas de Calor, Dashboards Ejecutivos y Machine Learning",
        subtitle="Compendio Exhaustivo de Visualización Dimensional, Percepción Gráfica, Detección de Patrones y Modelado Predictivo",
        volume_tag="Volumen 2 de 3 • Taller Oficial de Alto Impacto",
        styles=styles
    ))

    # --------------------------------------------------------------------------
    # INTRODUCCIÓN Y ARQUITECTURA VISUAL
    # --------------------------------------------------------------------------
    story.append(Paragraph("Ecosistema Analítico, Teoría Cromática y Percepción Visual", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "El Poder de los Mapas de Calor (Heatmaps) y Atributos Preatentivos",
        "El cerebro humano tarda menos de <b>200 milisegundos</b> en procesar atributos preatentivos como el color, la luminosidad y la posición espacial, "
        "mientras que analizar una tabla numérica tradicional requiere un esfuerzo cognitivo serial y lento. "
        "Un <b>Mapa de Calor</b> proyecta una matriz bidimensional sobre una escala cromática graduada continua, convirtiendo densidades, correlaciones y frecuencias "
        "en patrones geométricos inmediatos para la toma de decisiones empresariales.",
        styles
    ))
    story.append(Spacer(1, 10))

    story.append(create_case_box(
        "Psicología del Color y Selección de Paletas",
        "• <b>Paletas Secuenciales (Blues, Greens, Purples):</b> Ideales para métricas continuas sin valor neutro (ventas, tráfico, calificaciones).<br/>"
        "• <b>Paletas Divergentes (Coolwarm, RdYlGn):</b> Claves cuando existe un punto medio crítico como cero, metas de rentabilidad o pérdidas/ganancias.<br/>"
        "• <b>Paletas de Alerta Crítica (YlOrRd, Reds, Magma):</b> Obligatorias para detección de anomalías, saturación hospitalaria y ciberseguridad.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # RETOS 1 AL 4
    # --------------------------------------------------------------------------
    # Reto 1
    story.append(Paragraph("Reto #1: Visualiza Datos como un Analista de Datos", styles['H1_Chapter']))
    story.append(Paragraph("Transformación de una matriz básica de calificaciones escolares en una visualización con anotaciones numéricas integradas.", styles['EditorialBody']))
    code_r1 = """import seaborn as sns
import matplotlib.pyplot as plt

# 1. Matriz numérica 3x3 de calificaciones
datos = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]

# 2. Generar mapa de calor con anotaciones de celda
sns.heatmap(datos, annot=True, cmap="Blues", fmt="d")
plt.title("Reto 1: Rendimiento Escolar por Módulos", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "reto1_matriz.py", code_r1, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto1_matriz3x3.png"):
        story.append(Image("pdf/images/reto1_matriz3x3.png", width=5.5*inch, height=3.6*inch))
    story.append(Spacer(1, 15))

    # Reto 2
    story.append(Paragraph("Reto #2: Descubre el Mejor Momento para Vender (Retail)", styles['H1_Chapter']))
    story.append(Paragraph("Análisis temporal semanal cruzado por turnos de trabajo (Mañana, Tarde y Noche) para identificar picos de recaudación.", styles['EditorialBody']))
    code_r2 = """import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Estructura tabular de ventas semanales por turno
datos_ventas = {
    "Mañana": [120, 150, 180, 200, 250, 300, 220],
    "Tarde":  [200, 220, 210, 290, 350, 420, 310],
    "Noche":  [310, 280, 300, 410, 500, 620, 450]
}
dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
tabla_ventas = pd.DataFrame(datos_ventas, index=dias)

# 2. Mapa de calor con paleta secuencial YlGnBu y bordes de celda
sns.heatmap(tabla_ventas, annot=True, fmt="d", cmap="YlGnBu", linewidths=0.5)
plt.title("Reto 2: Ventas Semanales por Turnos", fontsize=11, fontweight="bold")
plt.ylabel("Día de la Semana")
plt.show()"""
    add_code_block(story, "reto2_ventas.py", code_r2, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto2_ventas_turnos.png"):
        story.append(Image("pdf/images/reto2_ventas_turnos.png", width=5.8*inch, height=3.5*inch))
    story.append(Spacer(1, 15))

    # Reto 3
    story.append(Paragraph("Reto #3: Radar Climático Semanal en República Dominicana", styles['H1_Chapter']))
    story.append(Paragraph("Comparativa de temperaturas promedio en Santo Domingo, Santiago y Punta Cana con formateo de un decimal (fmt='.1f') y paleta YlOrRd.", styles['EditorialBody']))
    code_r3 = """import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

temperaturas = {
    "Santo Domingo": [29.5, 30.1, 31.0, 30.8, 32.2, 31.5, 29.8],
    "Santiago":      [31.2, 32.5, 33.1, 32.9, 34.0, 33.5, 31.0],
    "Punta Cana":    [28.8, 29.2, 29.9, 30.1, 30.5, 30.0, 28.5]
}
dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
df_clima = pd.DataFrame(temperaturas, index=dias)

sns.heatmap(df_clima, annot=True, fmt=".1f", cmap="YlOrRd", linewidths=0.5)
plt.title("Reto 3: Radar Climático Semanal en República Dominicana (°C)", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "reto3_clima.py", code_r3, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto3_radar_climatico_rd.png"):
        story.append(Image("pdf/images/reto3_radar_climatico_rd.png", width=5.8*inch, height=3.5*inch))
    story.append(Spacer(1, 15))

    # Reto 4
    story.append(Paragraph("Reto #4: Tráfico en Tienda Retail por Franja Horaria", styles['H1_Chapter']))
    story.append(Paragraph("Monitoreo de afluencia de clientes en tiendas departamentales durante días laborables para optimización del personal de caja.", styles['EditorialBody']))
    code_r4 = """import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

franjas = ["08-11h", "11-14h", "14-17h", "17-20h", "20-23h"]
dias_laborales = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

datos_trafico = [
    [45, 80, 110, 95, 140],
    [50, 85, 120, 100, 155],
    [55, 90, 115, 105, 160],
    [60, 95, 130, 115, 190],
    [70, 120, 160, 180, 260]
]
df_trafico = pd.DataFrame(datos_trafico, index=dias_laborales, columns=franjas)

sns.heatmap(df_trafico, annot=True, fmt="d", cmap="Greens", linewidths=0.5)
plt.title("Reto 4: Afluencia de Clientes por Franja Horaria", fontsize=11, fontweight="bold")
plt.xlabel("Franja Horaria")
plt.ylabel("Día de la Semana")
plt.show()"""
    add_code_block(story, "reto4_trafico.py", code_r4, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto4_trafico_retail.png"):
        story.append(Image("pdf/images/reto4_trafico_retail.png", width=5.8*inch, height=3.3*inch))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # RETOS 5 AL 7
    # --------------------------------------------------------------------------
    # Reto 5
    story.append(Paragraph("Reto #5: Analítica de Streaming Audiovisual por Género y Dispositivo", styles['H1_Chapter']))
    code_r5 = """import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

generos = ["Acción", "Comedia", "Drama", "Sci-Fi", "Terror"]
plataformas = ["Smart TV", "Móvil", "Tablet", "Consola"]
consumo = [
    [1200, 850, 430, 620],
    [980, 1100, 520, 310],
    [750, 420, 310, 180],
    [1450, 680, 590, 890],
    [890, 320, 210, 450]
]
df_streaming = pd.DataFrame(consumo, index=generos, columns=plataformas)

sns.heatmap(df_streaming, annot=True, fmt="d", cmap="Purples", cbar_kws={'label': 'Horas Vistas (Miles)'})
plt.title("Reto 5: Streaming por Género y Dispositivo", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "reto5_streaming.py", code_r5, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto5_streaming_genero.png"):
        story.append(Image("pdf/images/reto5_streaming_genero.png", width=5.8*inch, height=3.5*inch))
    story.append(Spacer(1, 15))

    # Reto 6
    story.append(Paragraph("Reto #6 (Nivel Pro): Triage Hospitalario y Picos de Urgencias", styles['H1_Chapter']))
    story.append(Paragraph("Cálculo dinámico de totales por fila con <code>df.sum(axis=1)</code> para alertar sobre la saturación crítica en centros clínicos.", styles['EditorialBody']))
    code_r6 = """import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

salas = ["Trauma", "Pediatría", "Med. Interna", "Ginecología", "Observación"]
franjas_triage = ["00-05h", "06-11h", "12-17h", "18-21h", "22-23h"]
triage = [
    [18, 25, 40, 35, 52],
    [12, 38, 45, 60, 48],
    [22, 30, 35, 42, 58],
    [8,  15, 20, 25, 18],
    [15, 28, 42, 50, 65]
]
df_triage = pd.DataFrame(triage, index=salas, columns=franjas_triage)
# Inyección de columna acumulada
df_triage["Total Urgencias"] = df_triage.sum(axis=1)

sns.heatmap(df_triage, annot=True, fmt="d", cmap="Reds", linewidths=0.5)
plt.title("Reto 6: Triage Hospitalario y Alertas Clínicas", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "reto6_triage.py", code_r6, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto6_triage_hospitalario.png"):
        story.append(Image("pdf/images/reto6_triage_hospitalario.png", width=5.8*inch, height=3.5*inch))
    story.append(Spacer(1, 15))

    # Reto 7
    story.append(Paragraph("Reto #7 (Nivel Maestro): Radar de Ciberseguridad 24/7 (168 Puntos)", styles['H1_Chapter']))
    story.append(Paragraph("Detección de ciberataques y anomalías en tiempo real con 168 puntos de telemetría y paleta Magma.", styles['EditorialBody']))
    code_r7 = """import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# 168 horas semanales (7 días x 24 horas)
np.random.seed(777)
telemetria = np.random.poisson(lam=12, size=(7, 24))
# Inyección de anomalía intencional (Ataque DDoS)
telemetria[4, 2] = 88
telemetria[5, 3] = 95

df_ciber = pd.DataFrame(telemetria, index=["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"], columns=[f"{h:02d}h" for h in range(24)])
sns.heatmap(df_ciber, cmap="magma", cbar_kws={'label': 'Eventos SOS/hora'}, linewidths=0.2)
plt.title("Reto 7: Telemetría de Ciberseguridad 24/7 (SOC Radar)", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "reto7_ciberseguridad.py", code_r7, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto7_ciberseguridad_168pts.png"):
        story.append(Image("pdf/images/reto7_ciberseguridad_168pts.png", width=6.0*inch, height=3.4*inch))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # RETOS 8 Y 9 (DASHBOARD 2x2 Y MACHINE LEARNING)
    # --------------------------------------------------------------------------
    story.append(Paragraph("Reto #8: Dashboard Ejecutivo 2x2 — Operaciones Integradas", styles['H1_Chapter']))
    story.append(Paragraph("Consolidación de múltiples áreas operativas en una sola vista de 4 cuadrantes con <code>plt.subplots(2, 2)</code>.", styles['EditorialBody']))
    if os.path.exists("pdf/images/reto8_dashboard_2x2.png"):
        story.append(Image("pdf/images/reto8_dashboard_2x2.png", width=6.2*inch, height=4.0*inch))
    story.append(Spacer(1, 15))

    story.append(Paragraph("Reto #9 (Machine Learning): Segmentación K-Means de Clientes", styles['H1_Chapter']))
    story.append(Paragraph("Agrupación no supervisada de clientes según gasto y frecuencia mensual para campañas automatizadas.", styles['EditorialBody']))
    code_r9 = """from sklearn.cluster import KMeans
import seaborn as sns
import matplotlib.pyplot as plt

# Modelo K-Means con k=3 clusters
X = df[["Gasto_Mensual", "Visitas_Mes"]]
modelo_kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df["Segmento_IA"] = modelo_kmeans.fit_predict(X)

sns.scatterplot(data=df, x="Gasto_Mensual", y="Visitas_Mes", hue="Segmento_IA", palette="Set1", s=90)
plt.scatter(modelo_kmeans.cluster_centers_[:, 0], modelo_kmeans.cluster_centers_[:, 1], s=250, c="black", marker="X", label="Centroides")
plt.title("Reto 9: Segmentación de Clientes con Algoritmo K-Means", fontsize=11, fontweight="bold")
plt.legend()
plt.show()"""
    add_code_block(story, "reto9_kmeans.py", code_r9, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/reto9_kmeans_clustering.png"):
        story.append(Image("pdf/images/reto9_kmeans_clustering.png", width=6.0*inch, height=3.8*inch))
    story.append(Spacer(1, 15))

    # Construir PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Libro 2 generado exitosamente en: {pdf_path}")

if __name__ == "__main__":
    generar_libro_2()
