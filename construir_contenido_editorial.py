# -*- coding: utf-8 -*-
"""
Generador Maestro del Contenido Editorial y Bloc de Notas
Proyecto: JPV PyStudio
Autor: Ing. Juancito Peña Vizcaíno (DataIADev)
"""

import os
import re
import json

def leer_archivo(ruta):
    with open(ruta, 'r', encoding='utf-8', errors='replace') as f:
        return f.read()

# 1. Leer los 3 archivos de texto
raw1 = leer_archivo('talleres_txt/01_fundamentos_programacion_python_modulos_1_al_5.txt')
raw2 = leer_archivo('talleres_txt/02_taller_mapas_de_calor_seaborn_matplotlib.txt')
raw3 = leer_archivo('talleres_txt/03_taller_consumo_apis_publicas_sin_key.txt')

# -------------------------------------------------------------
# PARSER 1: FUNDAMENTOS DE PYTHON (MÓDULOS 1 AL 5)
# -------------------------------------------------------------
modulos_doc1 = []

# Módulos 1 al 5
mod_splits = re.split(r'={10,}\s*\n(?:[^\n]*\n)?(?=[^\n]*MÓDULO\s+\d+:)', raw1)
# mod_splits[0] es la cabecera
for idx, split in enumerate(mod_splits[1:], start=1):
    lineas = split.strip().splitlines()
    header_line = lineas[0] if lineas else f"MÓDULO {idx}"
    titulo_limpio = re.sub(r'^[^\w]*MÓDULO\s*\d+:\s*', '', header_line, flags=re.IGNORECASE).strip()
    
    # Separar secciones
    texto_completo = "\n".join(lineas[1:])
    
    # Didáctica
    didactica_match = re.search(r'1\.\s*PRESENTACIÓN DIDÁCTICA:\s*\n(.*?)(?=\n2\.|\n🚀|\Z)', texto_completo, re.DOTALL)
    didactica = didactica_match.group(1).strip() if didactica_match else ""
    
    # Conceptualización
    concepto_match = re.search(r'2\.\s*DEFINICIÓN.*?:(.*?)(?=\n3\.|\n🚀|\Z)', texto_completo, re.DOTALL)
    concepto = concepto_match.group(1).strip() if concepto_match else ""
    
    # Explicación / Escenarios / Código central
    explicacion_match = re.search(r'3\.\s*.*?:(.*?)(?=\n🚀|\Z)', texto_completo, re.DOTALL)
    explicacion_bloque = explicacion_match.group(1).strip() if explicacion_match else ""
    
    # Extraer código principal si existe en la sección 3 o 4
    cod_match = re.search(r'```python\s*(.*?)\s*```', explicacion_bloque, re.DOTALL)
    if cod_match:
        codigo_principal = cod_match.group(1).strip()
    else:
        # Extraer líneas de código indentadas o bloque entre imports y print
        codigo_lines = []
        for l in explicacion_bloque.splitlines():
            if any(l.startswith(k) for k in ('import ', 'from ', 'def ', 'class ', 'print(', 'for ', 'if ', 'with ', '# ', 'datos =', 'registro =', 'total =', 'precio =')):
                codigo_lines.append(l)
            elif codigo_lines and (l.startswith('    ') or l.startswith('\t') or not l.strip()):
                codigo_lines.append(l)
        codigo_principal = "\n".join(codigo_lines).strip()
    
    # Ejercicios del mundo real
    ejercicios_match = re.search(r'🚀\s*3 EJERCICIOS DEL MUNDO REAL.*?\n(.*)', texto_completo, re.DOTALL)
    ejercicios = []
    if ejercicios_match:
        ej_texto = ejercicios_match.group(1).strip()
        ej_splits = re.split(r'(?=\*?\*?Ejercicio\s*\d+:)', ej_texto, flags=re.IGNORECASE)
        for ej_s in ej_splits:
            if not ej_s.strip(): continue
            ej_lineas = ej_s.strip().splitlines()
            ej_tit = ej_lineas[0].strip(' *:')
            # Extraer código y descripción
            ej_desc = []
            ej_cod = []
            es_cod = False
            for el in ej_lineas[1:]:
                if any(el.startswith(k) for k in ('import ', 'from ', 'def ', 'class ', 'print(', 'for ', 'if ', 'with ', '#', 'datos =', 'saldo =', 'horas =', 'temperatura =', 'estudiantes =', 'inventario =', 'pedidos =')):
                    es_cod = True
                if es_cod:
                    ej_cod.append(el)
                else:
                    ej_desc.append(el)
            ejercicios.append({
                "titulo": ej_tit,
                "descripcion": "\n".join(ej_desc).strip(),
                "codigo": "\n".join(ej_cod).strip()
            })

    modulos_doc1.append({
        "id": f"mod-{idx}",
        "numero": f"Módulo {idx}",
        "titulo": titulo_limpio,
        "categoria": "Fundamentos & Lógica de Programación",
        "didactica": didactica,
        "concepto": concepto,
        "explicacion": explicacion_bloque[:500] if len(explicacion_bloque) > 500 else explicacion_bloque,
        "codigo": codigo_principal or (ejercicios[0]["codigo"] if ejercicios else "# Script del Módulo"),
        "ejercicios": ejercicios
    })

print(f"Doc 1 parsed: {len(modulos_doc1)} modulos.")

# -------------------------------------------------------------
# PARSER 2: MAPAS DE CALOR SEABORN & MATPLOTLIB (9 RETOS)
# -------------------------------------------------------------
modulos_doc2 = []
splits2 = re.split(r'(?=[🔥🎯]\s*RETO\s*#\d+)', raw2)
# Usamos los retos finales 8 al 16 (que contienen la versión pulida con niveles y código completo)
retos_completos = [s for s in splits2 if '🎬 Reto para el video' in s and 'import ' in s]
if len(retos_completos) < 9:
    # Tomar todos los retos únicos
    retos_completos = [s for s in splits2 if len(s.strip()) > 100]

vistos = set()
for s in retos_completos:
    lineas = s.strip().splitlines()
    if not lineas: continue
    tit = lineas[0].strip()
    # Extraer número de reto
    num_m = re.search(r'RETO\s*#(\d+)', tit)
    num = num_m.group(1) if num_m else str(len(modulos_doc2)+1)
    if num in vistos and len(vistos) >= 9:
        continue
    vistos.add(num)
    
    # Reto video
    rv_m = re.search(r'🎬 Reto para el video:\s*(.*?)(?=\n\n|\nimport|\Z)', s, re.DOTALL)
    reto_video = rv_m.group(1).strip() if rv_m else ""
    
    # Didáctica / Explicación
    cuerpo = "\n".join(lineas[1:])
    exp_m = re.search(r'^(.*?)(?=🎬|import|\Z)', cuerpo, re.DOTALL)
    didactica = exp_m.group(1).strip() if exp_m else ""
    
    # Código Python
    cod_m = re.search(r'((?:import\s+|from\s+).*)', s, re.DOTALL)
    codigo = cod_m.group(1).strip() if cod_m else ""
    
    modulos_doc2.append({
        "id": f"reto-{num}",
        "numero": f"Reto #{num}",
        "titulo": re.sub(r'^[🔥🎯]\s*RETO\s*#\d+:\s*', '', tit).strip(),
        "categoria": "Analítica Visual & Ciencia de Datos",
        "didactica": didactica,
        "reto_video": reto_video,
        "codigo": codigo
    })

print(f"Doc 2 parsed: {len(modulos_doc2)} retos.")

# -------------------------------------------------------------
# PARSER 3: CONSUMO DE APIS PÚBLICAS (6 RETOS)
# -------------------------------------------------------------
modulos_doc3 = []
splits3 = re.split(r'(?=[🌐📊🎬🍿]\s*RETO\s*API\s*#\d+)', raw3)
for s in splits3:
    if not s.strip(): continue
    lineas = s.strip().splitlines()
    tit = lineas[0].strip()
    num_m = re.search(r'RETO\s*API\s*#(\d+)', tit)
    num = num_m.group(1) if num_m else str(len(modulos_doc3)+1)
    
    rv_m = re.search(r'🎬 Reto para el video:\s*(.*?)(?=\n\n|\nimport|\Z)', s, re.DOTALL)
    reto_video = rv_m.group(1).strip() if rv_m else ""
    
    cuerpo = "\n".join(lineas[1:])
    exp_m = re.search(r'^(.*?)(?=🎬|import|\Z)', cuerpo, re.DOTALL)
    didactica = exp_m.group(1).strip() if exp_m else ""
    
    cod_m = re.search(r'((?:import\s+|from\s+).*)', s, re.DOTALL)
    codigo = cod_m.group(1).strip() if cod_m else ""
    
    modulos_doc3.append({
        "id": f"api-{num}",
        "numero": f"Reto API #{num}",
        "titulo": re.sub(r'^[🌐📊🎬🍿]\s*RETO\s*API\s*#\d+:\s*', '', tit).strip(),
        "categoria": "Integración REST & Tiempo Real",
        "didactica": didactica,
        "reto_video": reto_video,
        "codigo": codigo
    })

print(f"Doc 3 parsed: {len(modulos_doc3)} retos.")

# -------------------------------------------------------------
# CONSTRUCCIÓN DEL OBJETO COMPLETO JS
# -------------------------------------------------------------
js_content = f"""// =====================================================================
// CONTENIDO EDITORIAL & BLOC DE NOTAS MAESTRO DATAIADEV
// Autor: Ing. Juancito Peña Vizcaíno
// Acreditación Oficial República Dominicana (MESCyT, CODIA, Maestría Gerencial)
// =====================================================================

const RUBRICA_OFICIAL_JPV = {{
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
  contacto: {{
    correo: "juancitope@gmail.com",
    canal: "https://youtube.com/@JuancitoDevV",
    github: "https://github.com/JUANCITOPENA",
    linkedin: "https://linkedin.com/in/juancitopena",
    pais: "Santo Domingo, República Dominicana"
  }},
  notaEditorial: "Extractos del Libro Oficial: 'Lo que nadie te enseña de Python y su ecosistema' — Edición Exclusiva para la Comunidad DataIADev"
}};

// Textos íntegros de los Bloc de Notas Originales (para Vista TXT y Descarga)
const TALLERES_TXT_RAW = {{
  libro_maestro_python: {json.dumps(raw1, ensure_ascii=False)},
  taller_mapas_calor: {json.dumps(raw2, ensure_ascii=False)},
  taller_apis_publicas: {json.dumps(raw3, ensure_ascii=False)}
}};

const BIBLIOTECA_DOCUMENTOS = {{
  libro_maestro_python: {{
    id: "libro_maestro_python",
    archivoTxt: "01_fundamentos_programacion_python_modulos_1_al_5.txt",
    titulo: "Fundamentos de Programación con Python (Módulos 1 al 5)",
    subtitulo: "Lógica Computacional, Variables, Tipado Dinámico, Estructuras de Control, Bucles, Matrices y 15 Casos del Mundo Real",
    categoria: "Guía Didáctica & Bloc de Notas Oficial",
    version: "Edición 2026 - DataIADev",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#38bdf8",
    icono: "bi-journal-code",
    lineasTxt: {len(raw1.splitlines())},
    modulos: {json.dumps(modulos_doc1, ensure_ascii=False, indent=2)}
  }},
  taller_mapas_calor: {{
    id: "taller_mapas_calor",
    archivoTxt: "02_taller_mapas_de_calor_seaborn_matplotlib.txt",
    titulo: "Taller Técnico: Mapas de Calor con Seaborn & Matplotlib",
    subtitulo: "Visualización Avanzada de Datos, Matrices de Turnos, Radar Climático RD, Triage de Emergencias, Ciberseguridad y Clustering K-Means",
    categoria: "Taller Práctico de Ciencia de Datos",
    version: "Edición 2026 - DataIADev",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#f59e0b",
    icono: "bi-fire",
    lineasTxt: {len(raw2.splitlines())},
    modulos: {json.dumps(modulos_doc2, ensure_ascii=False, indent=2)}
  }},
  taller_apis_publicas: {{
    id: "taller_apis_publicas",
    archivoTxt: "03_taller_consumo_apis_publicas_sin_key.txt",
    titulo: "Taller Técnico: Consumo de APIs Públicas en Python (Sin Key)",
    subtitulo: "Integración REST en Tiempo Real: Clima Open-Meteo, Criptomonedas, Sensores Sísmicos USGS, Población y Series TVMaze con Gráficos",
    categoria: "Taller de Integración & APIs REST",
    version: "Edición 2026 - DataIADev",
    fechaPublicacion: "Noviembre 2026",
    colorAcento: "#10b981",
    icono: "bi-globe2",
    lineasTxt: {len(raw3.splitlines())},
    modulos: {json.dumps(modulos_doc3, ensure_ascii=False, indent=2)}
  }}
}};
"""

with open('js/editorial-content.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"js/editorial-content.js generado con éxito ({len(js_content)} caracteres).")
