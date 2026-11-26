import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

os.makedirs("pdf/images", exist_ok=True)
dpi_val = 300

print("Generando recursos visuales para Libro 2 y Libro 3...")

# -------------------------------------------------------------
# LIBRO 2: RECURSOS VISUALES SEABORN & MATPLOTLIB
# -------------------------------------------------------------

# Reto 1
plt.figure(figsize=(6, 4))
datos1 = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]
sns.heatmap(datos1, annot=True, cmap="Blues", fmt="d", cbar=True)
plt.title("Reto 1: Matriz de Rendimiento Escolar (3x3)", fontsize=11, fontweight="bold", pad=12)
plt.tight_layout()
plt.savefig("pdf/images/reto1_matriz3x3.png", dpi=dpi_val)
plt.close()

# Reto 2
plt.figure(figsize=(7, 4.2))
datos_ventas = {
    "Mañana": [120, 150, 180, 200, 250, 300, 220],
    "Tarde":  [200, 220, 210, 290, 350, 420, 310],
    "Noche":  [310, 280, 300, 410, 500, 620, 450]
}
dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
df_ventas = pd.DataFrame(datos_ventas, index=dias)
sns.heatmap(df_ventas, annot=True, fmt="d", cmap="YlGnBu", linewidths=0.5)
plt.title("Reto 2: Ventas Semanales por Turnos (Comercio Retail)", fontsize=11, fontweight="bold", pad=12)
plt.ylabel("Día de la Semana")
plt.tight_layout()
plt.savefig("pdf/images/reto2_ventas_turnos.png", dpi=dpi_val)
plt.close()

# Reto 3
plt.figure(figsize=(7, 4.2))
temperaturas = {
    "Santo Domingo": [29.5, 30.1, 31.0, 30.8, 32.2, 31.5, 29.8],
    "Santiago":      [31.2, 32.5, 33.1, 32.9, 34.0, 33.5, 31.0],
    "Punta Cana":    [28.8, 29.2, 29.9, 30.1, 30.5, 30.0, 28.5]
}
df_clima = pd.DataFrame(temperaturas, index=dias)
sns.heatmap(df_clima, annot=True, fmt=".1f", cmap="YlOrRd", linewidths=0.5)
plt.title("Reto 3: Radar Climático Semanal en República Dominicana (°C)", fontsize=11, fontweight="bold", pad=12)
plt.ylabel("Día de Medición")
plt.tight_layout()
plt.savefig("pdf/images/reto3_radar_climatico_rd.png", dpi=dpi_val)
plt.close()

# Reto 4
plt.figure(figsize=(7.5, 4.2))
franjas = ["08-11h", "11-14h", "14-17h", "17-20h", "20-23h"]
dias_laborales = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
np.random.seed(42)
datos_trafico = np.array([
    [45, 80, 110, 95, 140],
    [50, 85, 120, 100, 155],
    [55, 90, 115, 105, 160],
    [60, 95, 130, 115, 190],
    [70, 120, 160, 180, 260]
])
df_trafico = pd.DataFrame(datos_trafico, index=dias_laborales, columns=franjas)
sns.heatmap(df_trafico, annot=True, fmt="d", cmap="Greens", linewidths=0.5)
plt.title("Reto 4: Tráfico de Clientes en Tienda Retail por Franja Horaria", fontsize=11, fontweight="bold", pad=12)
plt.ylabel("Día Laboral")
plt.xlabel("Franja Horaria")
plt.tight_layout()
plt.savefig("pdf/images/reto4_trafico_retail.png", dpi=dpi_val)
plt.close()

# Reto 5
plt.figure(figsize=(7, 4.2))
generos = ["Acción", "Comedia", "Drama", "Sci-Fi", "Terror"]
plataformas = ["Smart TV", "Móvil", "Tablet", "Consola"]
consumo_streaming = [
    [1200, 850, 430, 620],
    [980, 1100, 520, 310],
    [750, 420, 310, 180],
    [1450, 680, 590, 890],
    [890, 320, 210, 450]
]
df_streaming = pd.DataFrame(consumo_streaming, index=generos, columns=plataformas)
sns.heatmap(df_streaming, annot=True, fmt="d", cmap="Purples", cbar_kws={'label': 'Horas Vistas (Miles)'})
plt.title("Reto 5: Consumo de Streaming Audiovisual por Género y Dispositivo", fontsize=11, fontweight="bold", pad=12)
plt.tight_layout()
plt.savefig("pdf/images/reto5_streaming_genero.png", dpi=dpi_val)
plt.close()

# Reto 6
plt.figure(figsize=(7.5, 4.5))
salas = ["Trauma", "Pediatría", "Medicina Interna", "Ginecología", "Observación"]
np.random.seed(101)
triage_data = np.array([
    [18, 25, 40, 35, 52],
    [12, 38, 45, 60, 48],
    [22, 30, 35, 42, 58],
    [8,  15, 20, 25, 18],
    [15, 28, 42, 50, 65]
])
df_triage = pd.DataFrame(triage_data, index=salas, columns=["00-05h", "06-11h", "12-17h", "18-21h", "22-23h"])
df_triage["Total Urgencias"] = df_triage.sum(axis=1)
sns.heatmap(df_triage, annot=True, fmt="d", cmap="Reds", linewidths=0.5)
plt.title("Reto 6: Triage Hospitalario y Picos de Urgencias Médicas", fontsize=11, fontweight="bold", pad=12)
plt.ylabel("Sala Médica")
plt.tight_layout()
plt.savefig("pdf/images/reto6_triage_hospitalario.png", dpi=dpi_val)
plt.close()

# Reto 7
plt.figure(figsize=(8, 4.5))
np.random.seed(777)
eventos_seg = np.random.poisson(lam=12, size=(7, 24))
# Inyectar anomalía simulada
eventos_seg[4, 2] = 88
eventos_seg[5, 3] = 95
dias_sem = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
horas_dia = [f"{h:02d}h" for h in range(24)]
df_ciber = pd.DataFrame(eventos_seg, index=dias_sem, columns=horas_dia)
sns.heatmap(df_ciber, cmap="magma", cbar_kws={'label': 'Eventos SOS / hora'}, linewidths=0.2)
plt.title("Reto 7: Radar de Ciberseguridad 24/7 (168 Puntos de Telemetría SOC)", fontsize=11, fontweight="bold", pad=12)
plt.ylabel("Día")
plt.xlabel("Hora del Día (UTC-4)")
plt.tight_layout()
plt.savefig("pdf/images/reto7_ciberseguridad_168pts.png", dpi=dpi_val)
plt.close()

# Reto 8
fig, axs = plt.subplots(2, 2, figsize=(8.5, 5.5))
sns.heatmap(df_ventas.T, annot=True, fmt="d", cmap="YlGnBu", ax=axs[0, 0], cbar=False)
axs[0, 0].set_title("A: Ventas por Turno", fontsize=9, fontweight="bold")

sns.heatmap(df_clima.T, annot=True, fmt=".1f", cmap="YlOrRd", ax=axs[0, 1], cbar=False)
axs[0, 1].set_title("B: Temperatura RD (°C)", fontsize=9, fontweight="bold")

sns.heatmap(df_trafico, annot=True, fmt="d", cmap="Greens", ax=axs[1, 0], cbar=False)
axs[1, 0].set_title("C: Afluencia Retail", fontsize=9, fontweight="bold")

sns.heatmap(df_streaming, annot=True, fmt="d", cmap="Purples", ax=axs[1, 1], cbar=False)
axs[1, 1].set_title("D: Horas Streaming", fontsize=9, fontweight="bold")

plt.suptitle("Reto 8: Dashboard Ejecutivo 2x2 — Análisis Multidimensional de Operaciones", fontsize=11, fontweight="bold")
plt.tight_layout()
plt.savefig("pdf/images/reto8_dashboard_2x2.png", dpi=dpi_val)
plt.close()

# Reto 9 (K-Means Clustering)
from sklearn.cluster import KMeans
plt.figure(figsize=(7, 4.5))
np.random.seed(42)
gasto = np.concatenate([np.random.normal(25, 6, 25), np.random.normal(70, 10, 25), np.random.normal(140, 15, 25)])
frecuencia = np.concatenate([np.random.normal(3, 1, 25), np.random.normal(8, 2, 25), np.random.normal(16, 3, 25)])
metodo_pago = ["Efectivo"]*25 + ["Tarjeta Débito"]*25 + ["Tarjeta Crédito VIP"]*25
X = np.column_stack([gasto, frecuencia])
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10).fit(X)
df_cluster = pd.DataFrame({"Gasto_Mensual": gasto, "Visitas_Mes": frecuencia, "Cluster": [f"Segmento {c+1}" for c in kmeans.labels_], "Pago": metodo_pago})

sns.scatterplot(data=df_cluster, x="Gasto_Mensual", y="Visitas_Mes", hue="Cluster", style="Pago", s=90, palette=["#2563EB", "#059669", "#D97706"])
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=250, c="#DC2626", marker="X", label="Centroides IA")
plt.title("Reto 9: Segmentación de Clientes con Machine Learning (K-Means)", fontsize=11, fontweight="bold", pad=12)
plt.xlabel("Gasto Promedio Mensual ($ USD)")
plt.ylabel("Frecuencia de Compra (Visitas al Mes)")
plt.legend(bbox_to_anchor=(1.02, 1), loc="upper left", fontsize=8)
plt.tight_layout()
plt.savefig("pdf/images/reto9_kmeans_clustering.png", dpi=dpi_val)
plt.close()

# -------------------------------------------------------------
# LIBRO 3: RECURSOS VISUALES CONSUMO DE APIS
# -------------------------------------------------------------

# Reto API 3 (Terremotos)
plt.figure(figsize=(7.5, 4.2))
lugares_sismos = ["Puerto Plata, RD", "Mona Passage", "Enriquillo Fault", "Samaná Bay", "Azua Valley", "Muertos Trough"]
magnitudes = [4.8, 5.2, 3.9, 4.3, 3.5, 5.6]
colores_sismos = ["#F59E0B" if m < 4.0 else ("#EA580C" if m < 5.0 else "#DC2626") for m in magnitudes]
y_pos = np.arange(len(lugares_sismos))
plt.barh(y_pos, magnitudes, color=colores_sismos, edgecolor="black", height=0.55)
plt.yticks(y_pos, lugares_sismos)
plt.xlabel("Magnitud Richter (Mw)")
plt.title("Reto API #3: Monitor Sísmico Regional en Vivo (Feed GeoJSON USGS)", fontsize=11, fontweight="bold", pad=12)
for i, v in enumerate(magnitudes):
    plt.text(v + 0.1, i, f"{v:.1f} Mw", va="center", fontweight="bold", fontsize=9)
plt.xlim(0, 7)
plt.tight_layout()
plt.savefig("pdf/images/api_reto3_terremotos.png", dpi=dpi_val)
plt.close()

# Reto API 4 (Cripto Multi-Asset)
plt.figure(figsize=(7.5, 4.2))
activos = ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)", "Cardano (ADA)", "Tether (USDT)"]
precios_usd = [96450.00, 3620.50, 184.20, 0.92, 1.00]
cambio_24h = [3.4, 5.1, -1.8, 8.2, 0.0]
colores_cambio = ["#059669" if c >= 0 else "#DC2626" for c in cambio_24h]
plt.bar(activos, cambio_24h, color=colores_cambio, edgecolor="black", width=0.5)
plt.axhline(0, color="black", linewidth=1)
plt.ylabel("Variación 24h (%)")
plt.title("Reto API #4: Monitor de Criptoactivos en Tiempo Real (Coinbase API)", fontsize=11, fontweight="bold", pad=12)
for i, v in enumerate(cambio_24h):
    plt.text(i, v + (0.4 if v >= 0 else -0.8), f"{v:+.1f}%", ha="center", fontweight="bold", fontsize=9)
plt.tight_layout()
plt.savefig("pdf/images/api_reto4_cripto.png", dpi=dpi_val)
plt.close()

# Reto API 6 (Series TV)
plt.figure(figsize=(7.5, 4.2))
series = ["Breaking Bad", "Stranger Things", "Game of Thrones", "Black Mirror", "The Boys"]
ratings = [9.5, 8.7, 9.3, 8.8, 8.7]
y_s = np.arange(len(series))
plt.barh(y_s, ratings, color="#6366F1", edgecolor="black", height=0.5)
plt.yticks(y_s, series)
plt.xlabel("Calificación Media (TVMaze / IMDb)")
plt.title("Reto API #6: Ranking Oficial de Series Audiovisuales (TVMaze API)", fontsize=11, fontweight="bold", pad=12)
for i, v in enumerate(ratings):
    plt.text(v + 0.1, i, f"⭐ {v}/10", va="center", fontweight="bold", fontsize=9)
plt.xlim(0, 11)
plt.tight_layout()
plt.savefig("pdf/images/api_reto6_series.png", dpi=dpi_val)
plt.close()

print("¡Todos los recursos visuales a 300 DPI han sido generados exitosamente en pdf/images/!")
