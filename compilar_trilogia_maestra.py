import os, sys, json, datetime
from compilar_libro_1 import generar_libro_1
from compilar_libro_2 import generar_libro_2
from compilar_libro_3 import generar_libro_3

print("=" * 80)
print("🚀 COMPILADOR MAESTRO DE LA TRILOGÍA TÉCNICA EN PDF — JPV PYSTUDIO")
print("Autor: Ing. Juancito Peña Vizcaíno (DataIADev)")
print("=" * 80)

os.makedirs("pdf", exist_ok=True)

try:
    print("\n[1/3] Compilando Libro 1: Fundamentos, POO, SQL Server e IA...")
    generar_libro_1()
    
    print("\n[2/3] Compilando Libro 2: Analítica Visual, Seaborn, Matplotlib y ML...")
    generar_libro_2()
    
    print("\n[3/3] Compilando Libro 3: Consumo Profesional de APIs Públicas sin Key...")
    generar_libro_3()

    # Actualizar estado de memoria de gobernanza
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    estado_path = ".governance/ESTADO_MEMORIA.json"
    if os.path.exists(estado_path):
        with open(estado_path, "r", encoding="utf-8") as f:
            estado = json.load(f)
        
        estado["timestamp"] = ts
        estado["etapa_actual"] = "TRILOGIA_PDF_COMPILADA_CON_EXITO"
        estado["libros"]["libro_1"]["estado"] = "COMPILADO_OK"
        estado["libros"]["libro_1"]["size_bytes"] = os.path.getsize("pdf/01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf")
        estado["libros"]["libro_2"]["estado"] = "COMPILADO_OK"
        estado["libros"]["libro_2"]["size_bytes"] = os.path.getsize("pdf/02_LIBRO_ANALISIS_DATOS_GRAFICOS_SEABORN_MATPLOTLIB_PRO.pdf")
        estado["libros"]["libro_3"]["estado"] = "COMPILADO_OK"
        estado["libros"]["libro_3"]["size_bytes"] = os.path.getsize("pdf/03_LIBRO_CONSUMO_APIS_PUBLICAS_PYTHON_SIN_KEY_PRO.pdf")

        with open(estado_path, "w", encoding="utf-8") as f:
            json.dump(estado, f, indent=2)

    print("\n" + "=" * 80)
    print("✨ ¡TRILOGÍA EDITORIAL COMPLETA GENERADA CON ÉXITO!")
    for l in [
        "pdf/01_LIBRO_PYTHON_FUNDAMENTOS_POO_SQL_IA_PRO.pdf",
        "pdf/02_LIBRO_ANALISIS_DATOS_GRAFICOS_SEABORN_MATPLOTLIB_PRO.pdf",
        "pdf/03_LIBRO_CONSUMO_APIS_PUBLICAS_PYTHON_SIN_KEY_PRO.pdf"
    ]:
        kb = os.path.getsize(l) / 1024
        print(f"📦 {l} -> {kb:.1f} KB")
    print("=" * 80)

except Exception as e:
    print(f"❌ Error durante la compilación: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
