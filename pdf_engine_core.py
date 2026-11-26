import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

# ==============================================================================
# CANVAS DE DOS PASADAS PARA NUMERACIÓN EXACTA "Página X de Y"
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # En la portada no se dibujan encabezados ni pie de página
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))

        page_w, page_h = letter
        margin = 0.75 * inch

        # Encabezado (Header)
        self.drawString(margin, page_h - 0.55 * inch, "DataIADev — Estándar Editorial y Profesional de Software & IA")
        doc_title = getattr(self, "doc_short_title", "Extractos del libro: Lo que nadie te enseña de Python")
        self.drawRightString(page_w - margin, page_h - 0.55 * inch, doc_title)
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(margin, page_h - 0.62 * inch, page_w - margin, page_h - 0.62 * inch)

        # Pie de Página (Footer)
        self.line(margin, 0.65 * inch, page_w - margin, 0.65 * inch)
        self.drawString(margin, 0.48 * inch, "DataIADev | for: Juancito Peña")
        self.drawCentredString(page_w / 2.0, 0.48 * inch, 'Nota: Extractos del libro "Lo que nadie te enseña de Python y su ecosistema"')
        self.drawRightString(page_w - margin, 0.48 * inch, f"Página {self._pageNumber} de {page_count}")

        self.restoreState()


# ==============================================================================
# GESTIÓN Y ESTILOS EDITORIALES
# ==============================================================================
def get_editorial_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name='EditorialTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        name='EditorialSubtitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),
        spaceAfter=15
    ))

    styles.add(ParagraphStyle(
        name='H1_Chapter',
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='H2_Section',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='H3_SubSection',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='EditorialBody',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        name='BoxTitleConcept',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#1D4ED8")
    ))

    styles.add(ParagraphStyle(
        name='BoxTitleCase',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#047857")
    ))

    styles.add(ParagraphStyle(
        name='BoxTitleChallenge',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#B45309")
    ))

    styles.add(ParagraphStyle(
        name='BoxBody',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0F172A")
    ))

    styles.add(ParagraphStyle(
        name='CodeTerminalTitle',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#94A3B8")
    ))

    styles.add(ParagraphStyle(
        name='CodeText',
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#E2E8F0")
    ))

    styles.add(ParagraphStyle(
        name='OutputText',
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#10B981")
    ))

    return styles


# ==============================================================================
# COMPONENTES FLOWABLES REUTILIZABLES
# ==============================================================================
def create_concept_box(title, text, styles, width=7.0*inch):
    content = [
        Paragraph(f"<b>📘 DEFINICIÓN & FUNDAMENTO:</b> {title}", styles['BoxTitleConcept']),
        Spacer(1, 3),
        Paragraph(text, styles['BoxBody'])
    ]
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('LINEBEFORE', (0,0), (0,-1), 3.5, colors.HexColor("#2563EB")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

def create_case_box(title, text, styles, width=7.0*inch):
    content = [
        Paragraph(f"<b>🏢 ESCENARIO EMPRESARIAL EN PRODUCCIÓN:</b> {title}", styles['BoxTitleCase']),
        Spacer(1, 3),
        Paragraph(text, styles['BoxBody'])
    ]
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('LINEBEFORE', (0,0), (0,-1), 3.5, colors.HexColor("#059669")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

def create_challenge_box(title, text, styles, width=7.0*inch):
    content = [
        Paragraph(f"<b>🔥 RETO PRÁCTICO & DESAFÍO TÉCNICO:</b> {title}", styles['BoxTitleChallenge']),
        Spacer(1, 3),
        Paragraph(text, styles['BoxBody'])
    ]
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFBEB")),
        ('LINEBEFORE', (0,0), (0,-1), 3.5, colors.HexColor("#D97706")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

def create_code_block(filename, code_text, styles, width=7.0*inch):
    raw_lines = code_text.strip().splitlines()
    max_chunk_lines = 26

    if len(raw_lines) <= max_chunk_lines:
        # Encabezado estilo terminal
        header_content = Paragraph(f"● ● ●  <b>{filename}</b>", styles['CodeTerminalTitle'])
        header_table = Table([[header_content]], colWidths=[width])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))

        code_lines = [line.replace(" ", "&nbsp;").replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;") for line in raw_lines]
        code_html = "<br/>".join(code_lines)
        code_p = Paragraph(code_html, styles['CodeText'])
        
        body_table = Table([[code_p]], colWidths=[width])
        body_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0B1120")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))

        return KeepTogether([header_table, body_table])
    
    # División inteligente anti-truncamiento para scripts extensos
    flowables = []
    total_parts = (len(raw_lines) + max_chunk_lines - 1) // max_chunk_lines

    for idx in range(total_parts):
        start = idx * max_chunk_lines
        end = min((idx + 1) * max_chunk_lines, len(raw_lines))
        chunk = raw_lines[start:end]

        tag = f"● ● ●  <b>{filename} (Parte {idx+1}/{total_parts})</b>" if idx == 0 else f"🔄 [Continuación del script {filename} — Parte {idx+1}/{total_parts}]"
        h_p = Paragraph(tag, styles['CodeTerminalTitle'])
        h_table = Table([[h_p]], colWidths=[width])
        h_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))

        code_lines = [line.replace(" ", "&nbsp;").replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;") for line in chunk]
        if idx < total_parts - 1:
            code_lines.append("<br/><font color='#F59E0B'><b>⚠️ [Continúa en la siguiente página — Parte " + str(idx+1) + "/" + str(total_parts) + "]</b></font>")

        code_html = "<br/>".join(code_lines)
        code_p = Paragraph(code_html, styles['CodeText'])
        
        b_table = Table([[code_p]], colWidths=[width])
        b_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0B1120")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))

        if idx > 0:
            flowables.append(PageBreak())
        flowables.append(KeepTogether([h_table, b_table]))

    return flowables

def add_code_block(story, filename, code_text, styles, width=7.0*inch):
    res = create_code_block(filename, code_text, styles, width)
    if isinstance(res, list):
        story.extend(res)
    else:
        story.append(res)

def create_output_block(output_text, styles, width=7.0*inch):
    out_lines = [line.replace(" ", "&nbsp;").replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;") for line in output_text.strip().splitlines()]
    out_html = "<b>[Salida en Consola / Terminal]:</b><br/>" + "<br/>".join(out_lines)
    p = Paragraph(out_html, styles['OutputText'])
    t = Table([[p]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#022C22")),
        ('LINEBEFORE', (0,0), (0,-1), 3, colors.HexColor("#10B981")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

def build_cover_page(title, subtitle, volume_tag, styles, width=7.0*inch):
    elements = []
    
    # Barra superior ceremonial
    badge_p = Paragraph(f"<b>{volume_tag.upper()} • ESTÁNDAR ACADÉMICO INTERNACIONAL Y ENTERPRISE</b>", styles['BoxTitleConcept'])
    t_badge = Table([[badge_p]], colWidths=[width])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#DBEAFE")),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_badge)
    elements.append(Spacer(1, 25))

    # Título Principal y Subtítulo
    elements.append(Paragraph(title, styles['EditorialTitle']))
    elements.append(Paragraph(subtitle, styles['EditorialSubtitle']))
    elements.append(HRFlowable(width="100%", thickness=3, color=colors.HexColor("#1E3A8A"), spaceAfter=20, spaceBefore=5))

    # Resumen descriptivo de la obra
    desc_text = (
        "Esta obra técnica de nivel universitario y corporativo proporciona una inmersión completa y exhaustiva en el desarrollo "
        "de software moderno con Python, análisis dimensional de datos, bases de datos empresariales e inteligencia artificial aplicada. "
        "Estructurada bajo el estándar de Educación Superior MESCyT para carreras y maestrías computacionales, cada capítulo "
        "sintetiza fundamentos conceptuales rigurosos, arquitecturas en producción, código fuente comentado libre de cortes y retos de aplicación real."
    )
    elements.append(Paragraph(desc_text, styles['EditorialBody']))
    elements.append(Spacer(1, 35))

    # Cuadro institucional de autoría y rúbrica profesional
    autor_box = [
        Paragraph("<b>AUTORÍA Y DIRECCIÓN EDITORIAL</b>", styles['H3_SubSection']),
        Paragraph("<b>Ing. Juancito Peña Vizcaíno</b>", styles['H2_Section']),
        Paragraph("• Ingeniero en Sistemas y Computación (Magna Cum Laude)", styles['EditorialBody']),
        Paragraph("• Especialista en Desarrollo de Software & Arquitectura Cloud", styles['EditorialBody']),
        Paragraph("• Magíster en Sistemas Computacionales (Mención Gerencial)", styles['EditorialBody']),
        Paragraph("• Fundador & Lead Software Architect en <b>DataIADev</b>", styles['EditorialBody']),
        Paragraph("• Santo Domingo, República Dominicana | YouTube: <b>@JuancitoDevV</b> | GitHub: <b>JUANCITOPENA</b>", styles['EditorialBody']),
        Spacer(1, 6),
        Paragraph("<b>SELLO Y NOTA EDITORIAL:</b>", styles['BoxTitleChallenge']),
        Paragraph('<i>"Nota: Extractos del libro oficial «Lo que nadie te enseña de Python y su ecosistema»"</i>', styles['EditorialBody'])
    ]
    t_autor = Table([[autor_box]], colWidths=[width])
    t_autor.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#0F172A")),
        ('LINEBEFORE', (0,0), (0,-1), 5, colors.HexColor("#1E3A8A")),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    elements.append(t_autor)

    elements.append(Spacer(1, 30))
    elements.append(Paragraph("<b>Edición 2026 — Distribución Oficial DataIADev Academic Suite</b>", styles['BoxTitleConcept']))
    elements.append(PageBreak())
    
    return elements
