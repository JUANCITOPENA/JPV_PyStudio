import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from pdf_engine_core import (
    NumberedCanvas, get_editorial_styles, create_concept_box, create_case_box,
    create_challenge_box, add_code_block, create_output_block, build_cover_page
)

def generar_libro_3():
    pdf_path = "pdf/03_LIBRO_CONSUMO_APIS_PUBLICAS_PYTHON_SIN_KEY_PRO.pdf"
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
        title="Integración de Datos en Tiempo Real:<br/>Consumo Profesional de APIs Públicas en Python (Sin API Key)",
        subtitle="Manual Integral de Arquitectura Web, Protocolo HTTP, Procesamiento JSON en Memoria y Visualización de Feeds en Vivo",
        volume_tag="Volumen 3 de 3 • Taller Oficial de Alto Impacto",
        styles=styles
    ))

    # --------------------------------------------------------------------------
    # INTRODUCCIÓN A LAS APIS Y ARQUITECTURA REST
    # --------------------------------------------------------------------------
    story.append(Paragraph("Fundamentos de Arquitecturas Web y Protocolo HTTP/REST", styles['H1_Chapter']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    story.append(create_concept_box(
        "¿Qué es una API REST y cómo se comunican las aplicaciones modernas?",
        "Una <b>API (Application Programming Interface)</b> es un conjunto de reglas y protocolos que permite a dos sistemas de software comunicarse entre sí de forma estandarizada. "
        "La arquitectura <b>REST (Representational State Transfer)</b> opera sobre el protocolo HTTP/HTTPS utilizando verbos estándar: "
        "<code>GET</code> (consultar información), <code>POST</code> (crear registros), <code>PUT/PATCH</code> (actualizar) y <code>DELETE</code> (eliminar). "
        "Las respuestas viajan habitualmente serializadas en formato <b>JSON (JavaScript Object Notation)</b>, el cual Python mapea de forma nativa a diccionarios y listas.",
        styles
    ))
    story.append(Spacer(1, 10))

    story.append(create_case_box(
        "Manejo Seguro con .get() y Código Defensivo",
        "En producción, las APIs externas pueden cambiar su esquema o devolver campos nulos. "
        "El uso del operador rígido <code>diccionario['clave']</code> genera una excepción <code>KeyError</code> fatal que aborta el programa si el campo falta. "
        "El estándar empresarial exige utilizar siempre <b><code>diccionario.get('clave', valor_por_defecto)</code></b> para garantizar la continuidad del flujo.",
        styles
    ))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # RETOS API 1 AL 3
    # --------------------------------------------------------------------------
    # Reto 1
    story.append(Paragraph("Reto API #1: El Clima en Vivo en Santo Domingo (Open-Meteo)", styles['H1_Chapter']))
    code_api1 = """import requests

# 1. Endpoint meteorológico público sin clave
url = "https://api.open-meteo.com/v1/forecast?latitude=18.48&longitude=-69.93&current_weather=true"

# 2. Descarga y serialización JSON
respuesta = requests.get(url, timeout=10).json()
clima = respuesta.get("current_weather", {})

# 3. Presentación formateada
print("🌤️ REPORTE DEL CLIMA EN VIVO (SANTO DOMINGO)")
print("Temperatura actual:", clima.get("temperature"), "°C")
print("Velocidad del viento:", clima.get("windspeed"), "km/h")"""
    add_code_block(story, "api_reto1_clima.py", code_api1, styles)
    story.append(Spacer(1, 6))
    out_api1 = """🌤️ REPORTE DEL CLIMA EN VIVO (SANTO DOMINGO)
Temperatura actual: 30.4 °C
Velocidad del viento: 14.8 km/h"""
    story.append(create_output_block(out_api1, styles))
    story.append(Spacer(1, 15))

    # Reto 2
    story.append(Paragraph("Reto API #2: Cotización de Criptoactivos en Tiempo Real (Coinbase)", styles['H1_Chapter']))
    code_api2 = """import requests

# Consulta de cotización spot de Bitcoin
url_btc = "https://api.coinbase.com/v2/prices/BTC-USD/spot"
datos_btc = requests.get(url_btc, timeout=10).json()
precio_btc = float(datos_btc["data"]["amount"])

url_eth = "https://api.coinbase.com/v2/prices/ETH-USD/spot"
datos_eth = requests.get(url_eth, timeout=10).json()
precio_eth = float(datos_eth["data"]["amount"])

print("💰 MERCADO FINANCIERO CRIPTO EN VIVO (COINBASE)")
print(f"Bitcoin (BTC):  USD ${precio_btc:,.2f}")
print(f"Ethereum (ETH): USD ${precio_eth:,.2f}")"""
    add_code_block(story, "api_reto2_cripto.py", code_api2, styles)
    story.append(Spacer(1, 6))
    out_api2 = """💰 MERCADO FINANCIERO CRIPTO EN VIVO (COINBASE)
Bitcoin (BTC):  USD $96,450.00
Ethereum (ETH): USD $3,620.50"""
    story.append(create_output_block(out_api2, styles))
    story.append(Spacer(1, 15))

    # Reto 3
    story.append(Paragraph("Reto API #3: Monitor de Terremotos Regionales en Vivo (USGS)", styles['H1_Chapter']))
    story.append(Paragraph("Consumo de feed GeoJSON del Servicio Geológico de EE.UU. (USGS) y renderizado de gráfico de magnitudes.", styles['EditorialBody']))
    code_api3 = """import requests
import matplotlib.pyplot as plt

# Feed GeoJSON de sismos de las últimas 24 horas
url_usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
feed = requests.get(url_usgs, timeout=10).json()

eventos = feed.get("features", [])[:10]
lugares = [e["properties"]["place"] for e in eventos]
magnitudes = [e["properties"]["mag"] for e in eventos]

plt.barh(lugares, magnitudes, color="#DC2626")
plt.xlabel("Magnitud Richter")
plt.title("Monitor Sísmico en Vivo (USGS GeoJSON)", fontsize=11, fontweight="bold")
plt.show()"""
    add_code_block(story, "api_reto3_terremotos.py", code_api3, styles)
    story.append(Spacer(1, 6))
    if os.path.exists("pdf/images/api_reto3_terremotos.png"):
        story.append(Image("pdf/images/api_reto3_terremotos.png", width=6.0*inch, height=3.3*inch))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # RETOS API 4 AL 6
    # --------------------------------------------------------------------------
    # Reto 4
    story.append(Paragraph("Reto API #4: Monitor de Criptoactivos Multi-Asset en Tiempo Real", styles['H1_Chapter']))
    if os.path.exists("pdf/images/api_reto4_cripto.png"):
        story.append(Image("pdf/images/api_reto4_cripto.png", width=6.0*inch, height=3.3*inch))
    story.append(Spacer(1, 15))

    # Reto 5
    story.append(Paragraph("Reto API #5: Catálogo de Cine Animado (Studio Ghibli API)", styles['H1_Chapter']))
    code_api5 = """import requests

url_ghibli = "https://ghibliapi.vercel.app/films"
peliculas = requests.get(url_ghibli, timeout=10).json()[:5]

print("🎬 CATÁLOGO DE ANIMACIÓN (STUDIO GHIBLI)")
for p in peliculas:
    print(f"• {p.get('title')} ({p.get('release_date')}) — Score: {p.get('rt_score')}/100")"""
    add_code_block(story, "api_reto5_ghibli.py", code_api5, styles)
    story.append(Spacer(1, 6))
    out_api5 = """🎬 CATÁLOGO DE ANIMACIÓN (STUDIO GHIBLI)
• Castle in the Sky (1986) — Score: 95/100
• Grave of the Fireflies (1988) — Score: 97/100
• My Neighbor Totoro (1988) — Score: 93/100
• Kiki's Delivery Service (1989) — Score: 96/100
• Only Yesterday (1991) — Score: 100/100"""
    story.append(create_output_block(out_api5, styles))
    story.append(Spacer(1, 15))

    # Reto 6
    story.append(Paragraph("Reto API #6: Ranking Oficial de Series Audiovisuales (TVMaze)", styles['H1_Chapter']))
    if os.path.exists("pdf/images/api_reto6_series.png"):
        story.append(Image("pdf/images/api_reto6_series.png", width=6.0*inch, height=3.3*inch))
    story.append(Spacer(1, 15))

    # --------------------------------------------------------------------------
    # VERSIONES MODERNAS CON PÓSTERS EN MEMORIA (PILLOW)
    # --------------------------------------------------------------------------
    story.append(Paragraph("Versiones Modernas: Descarga y Procesamiento de Imágenes en Memoria", styles['H1_Chapter']))
    story.append(create_concept_box(
        "Procesamiento Efímero en RAM con PIL (Pillow) e io.BytesIO",
        "En arquitecturas cloud sin almacenamiento persistente (Serverless, AWS Lambda, Cloud Run), guardar imágenes temporales en disco satura el I/O. "
        "El patrón canónico consiste en descargar el flujo binario con <code>requests.get(url).content</code>, cargarlo en un búfer de bytes en memoria RAM con "
        "<code>io.BytesIO(contenido)</code> y abrirlo directamente con <b><code>PIL.Image.open(buffer)</code></b> para renderizarlo con Matplotlib.",
        styles
    ))
    story.append(Spacer(1, 10))

    code_moderna = """import io
import requests
from PIL import Image
import matplotlib.pyplot as plt

# 1. Búsqueda en Apple Movies / iTunes Search API
url_api = "https://itunes.apple.com/search?term=inception&entity=movie&limit=1"
resultado = requests.get(url_api).json()
pelicula = resultado["results"][0]

url_poster = pelicula["artworkUrl100"].replace("100x100bb", "600x600bb")
titulo = pelicula["trackName"]

# 2. Descarga binaria y decodificación en memoria RAM
img_bytes = requests.get(url_poster).content
imagen = Image.open(io.BytesIO(img_bytes))

# 3. Presentación gráfica
plt.imshow(imagen)
plt.axis("off")
plt.title(f"Póster Oficial: {titulo}", fontsize=11, fontweight="bold")
plt.show()"""

    add_code_block(story, "api_moderna_posters_ram.py", code_moderna, styles)
    story.append(Spacer(1, 15))

    story.append(create_challenge_box(
        "Reto Maestro de Integración: Monitor Multi-API Financiero con Alertas en Vivo",
        "Diseña un script que consulte simultáneamente Open-Meteo, Coinbase y REST Countries usando <code>concurrent.futures.ThreadPoolExecutor</code>. "
        "Consolida las respuestas en un único reporte JSON estructurado con tiempo de respuesta total inferior a 800 milisegundos.",
        styles
    ))

    # Construir PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Libro 3 generado exitosamente en: {pdf_path}")

if __name__ == "__main__":
    generar_libro_3()
