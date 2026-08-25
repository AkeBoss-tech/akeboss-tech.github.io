from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "output" / "pdf" / "akash-dubey-graduate-recommendation-brag-sheets.pdf"
NYL_LOGO_RAW = ROOT / "tmp" / "pdfs" / "nyl-recommender" / "new-york-life.svg.png"
NYL_LOGO = ROOT / "tmp" / "pdfs" / "nyl-recommender" / "new-york-life-cropped.png"
RUTGERS_LOGO = ROOT / "tmp" / "pdfs" / "nyl-recommender" / "rutgers-block-r.svg.png"

PAGE_W, PAGE_H = letter
MARGIN = 42

INK = HexColor("#142033")
MUTED = HexColor("#5E6B7C")
PALE = HexColor("#F4F7FB")
CARD = white
LINE = HexColor("#DCE4EE")
NYL_BLUE = HexColor("#0468FF")
NAVY = HexColor("#102A56")
RUTGERS_RED = HexColor("#CC0033")
TEAL = HexColor("#0E8074")
AMBER = HexColor("#D38920")


def wrap(text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, width, font="Helvetica", size=9, leading=12,
                 color=INK, max_lines=None):
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap(text, font, size, width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while stringWidth(last + "...", font, size) > width and last:
            last = last[:-1]
        lines[-1] = last.rstrip() + "..."
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def round_rect(c, x, y, w, h, fill=CARD, stroke=LINE, radius=12):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def draw_logo(c, path, x, y, size):
    c.drawImage(ImageReader(str(path)), x, y, size, size, mask="auto", preserveAspectRatio=True)


def prepare_nyl_logo():
    image = Image.open(NYL_LOGO_RAW).convert("RGBA")
    white_bg = Image.new("RGBA", image.size, (255, 255, 255, 255))
    difference = ImageChops.difference(image, white_bg).convert("RGB")
    bbox = difference.getbbox()
    if not bbox:
        raise ValueError("New York Life logo conversion is blank")
    cropped = image.crop(bbox)
    pad = 5
    padded = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (255, 255, 255, 0))
    padded.paste(cropped, (pad, pad), cropped)
    padded.save(NYL_LOGO)


def page_base(c, page_no, label):
    c.setFillColor(PALE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(NYL_BLUE)
    c.rect(0, 0, 8, PAGE_H, fill=1, stroke=0)

    draw_logo(c, RUTGERS_LOGO, MARGIN, PAGE_H - 58, 25)
    c.setFillColor(LINE)
    c.rect(MARGIN + 34, PAGE_H - 55, 1, 21, fill=1, stroke=0)
    draw_logo(c, NYL_LOGO, MARGIN + 46, PAGE_H - 59, 28)

    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 39, label.upper())

    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(MARGIN, 31, PAGE_W - MARGIN, 31)
    c.setFont("Helvetica", 6.8)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 18, "PRIVATE RECOMMENDER REFERENCE  |  FALL 2027 MASTER'S APPLICATIONS")
    c.drawRightString(PAGE_W - MARGIN, 18, f"AKASH DUBEY  |  {page_no} OF 2")


def title_block(c, eyebrow, title, subtitle):
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(NYL_BLUE)
    c.drawString(MARGIN, PAGE_H - 88, eyebrow.upper())
    c.setFont("Times-Bold", 25)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 117, title)
    draw_wrapped(c, subtitle, MARGIN, PAGE_H - 137, PAGE_W - 2 * MARGIN,
                 font="Helvetica", size=8.8, leading=11.5, color=MUTED, max_lines=2)


def bullet_list(c, bullets, x, y, width, size=8.2, leading=10.6, gap=4, color=INK):
    for item in bullets:
        c.setFillColor(NYL_BLUE)
        c.circle(x + 2.2, y + 2.5, 1.5, fill=1, stroke=0)
        y = draw_wrapped(c, item, x + 10, y, width - 10, size=size, leading=leading,
                         color=color)
        y -= gap
    return y


def section_label(c, text, x, y, color=NYL_BLUE):
    c.setFont("Helvetica-Bold", 7.2)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())


def arc_item(c, number, title, body, x, y, width):
    c.setFillColor(NYL_BLUE)
    c.circle(x + 12, y - 10, 11, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + 12, y - 13, str(number))
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9.1)
    c.drawString(x + 31, y - 5, title)
    draw_wrapped(c, body, x + 31, y - 18, width - 31,
                 size=7.7, leading=9.3, color=MUTED, max_lines=2)


def page_one(c):
    page_base(c, 1, "Overall recommendation flow")
    title_block(
        c,
        "Graduate recommendation brief",
        "The case for Akash",
        "Narrative guide for Samina's recommendation across CS, machine learning, robotics, and engineering programs.",
    )

    # Thesis banner
    x, y, w, h = MARGIN, 574, PAGE_W - 2 * MARGIN, 72
    round_rect(c, x, y, w, h, fill=NAVY, stroke=NAVY, radius=14)
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(HexColor("#9EC5FF"))
    c.drawString(x + 18, y + 49, "CORE THESIS")
    draw_wrapped(
        c,
        "Akash operated as an unusually independent early-career engineer who turned ambiguous enterprise problems into tested, documented, reusable AI systems.",
        x + 18,
        y + 32,
        w - 36,
        font="Helvetica-Bold",
        size=10.2,
        leading=13.5,
        color=white,
        max_lines=2,
    )

    left_x, left_w = MARGIN, 322
    right_x, right_w = 382, PAGE_W - MARGIN - 382
    section_label(c, "Suggested letter arc", left_x, 552)

    arc_item(c, 1, "Establish perspective", "Explain how closely you managed Akash, the internship scope, and your basis for evaluating him.", left_x, 534, left_w)
    arc_item(c, 2, "Anchor in Claims AI", "Show how he crossed application, AWS, knowledge, authentication, voice, testing, and readiness boundaries.", left_x, 478, left_w)
    arc_item(c, 3, "Add a second proof point", "Use knowledge governance, Pega modernization, AEM delivery, or infrastructure to show adaptability.", left_x, 422, left_w)
    arc_item(c, 4, "Describe how he worked", "Emphasize independence, evidence-based judgment, privacy awareness, testing, and clear handoffs.", left_x, 366, left_w)
    arc_item(c, 5, "Connect to graduate study", "Tie open-ended problem solving, rapid learning, and systems depth to advanced CS, ML, or robotics work.", left_x, 310, left_w)
    arc_item(c, 6, "Close directly", "State the strength of your recommendation, whether you would hire him again, and any honest peer comparison.", left_x, 254, left_w)

    # Right column cards
    round_rect(c, right_x, 394, right_w, 158, fill=CARD, stroke=LINE)
    section_label(c, "Qualities worth substantiating", right_x + 14, 532, color=TEAL)
    bullet_list(c, [
        "Unusual independence for an intern",
        "Rapid learning across unfamiliar systems",
        "Technical depth plus business awareness",
        "Honest treatment of evidence and limits",
        "Strong documentation and knowledge transfer",
        "Clear communication across stakeholders",
    ], right_x + 14, 512, right_w - 28, size=7.7, leading=9.4, gap=3)

    round_rect(c, right_x, 285, right_w, 94, fill=CARD, stroke=LINE)
    section_label(c, "Most valuable comparisons", right_x + 14, 359, color=AMBER)
    draw_wrapped(c, "If accurate, explain whether Akash performed beyond normal intern expectations, needed unusually little supervision, earned broader scope, or ranked among your strongest early-career engineers.", right_x + 14, 340, right_w - 28, size=7.7, leading=10.2, color=MUTED, max_lines=6)

    round_rect(c, right_x, 166, right_w, 104, fill=CARD, stroke=LINE)
    section_label(c, "Target programs", right_x + 14, 250)
    programs = ["Stanford", "CMU ML", "CMU Robotics", "Princeton", "Penn", "Berkeley", "Columbia"]
    px, py = right_x + 14, 225
    for index, program in enumerate(programs):
        chip_w = 73 if len(program) > 8 else 62
        if px + chip_w > right_x + right_w - 14:
            px = right_x + 14
            py -= 24
        c.setFillColor(PALE)
        c.setStrokeColor(LINE)
        c.roundRect(px, py, chip_w, 17, 8, fill=1, stroke=1)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 6.6)
        c.drawCentredString(px + chip_w / 2, py + 5.2, program)
        px += chip_w + 6

    round_rect(c, MARGIN, 62, PAGE_W - 2 * MARGIN, 96, fill=HexColor("#FFF8E9"), stroke=HexColor("#F0D79E"))
    section_label(c, "What makes the letter persuasive", MARGIN + 16, 138, color=AMBER)
    bullet_list(c, [
        "Two detailed stories are stronger than a long technology inventory.",
        "Specific observations about independence, judgment, and growth are stronger than generic praise.",
        "The conclusion should explicitly state readiness for rigorous graduate work and the strength of the recommendation.",
        "Use only facts personally observed; omit confidential details and unverified adoption, savings, ROI, or impact claims.",
    ], MARGIN + 16, 120, PAGE_W - 2 * MARGIN - 32, size=7.6, leading=9.6, gap=2.5)


def evidence_card(c, x, y, w, h, title, lead, bullets, accent=NYL_BLUE, compact=False):
    round_rect(c, x, y, w, h, fill=CARD, stroke=LINE)
    c.setFillColor(accent)
    c.roundRect(x, y, 5, h, 2.5, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10 if not compact else 9)
    c.setFillColor(INK)
    c.drawString(x + 16, y + h - 21, title)
    cursor = draw_wrapped(c, lead, x + 16, y + h - 38, w - 30, size=7.5 if compact else 7.8,
                          leading=9.3, color=MUTED, max_lines=2)
    cursor -= 4
    bullet_list(c, bullets, x + 16, cursor, w - 30, size=7.1 if compact else 7.4,
                leading=8.7 if compact else 9.1, gap=2.3, color=INK)


def page_two(c):
    page_base(c, 2, "New York Life evidence sheet")
    title_block(
        c,
        "Manager evidence page",
        "What Akash did at New York Life",
        "Software Engineering Intern, TDAV Team | May-August 2026 | A source-grounded set of memory prompts for Samina.",
    )

    round_rect(c, MARGIN, 592, PAGE_W - 2 * MARGIN, 54, fill=HexColor("#EAF2FF"), stroke=HexColor("#BFD5F7"))
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(NYL_BLUE)
    c.drawString(MARGIN + 16, 625, "ONE-SENTENCE SUMMARY")
    draw_wrapped(c, "Built applied-AI systems across claims, governed knowledge, legacy modernization, website engineering, cloud infrastructure, and business automation.", MARGIN + 16, 609, PAGE_W - 2 * MARGIN - 32, font="Helvetica-Bold", size=8.8, leading=11, color=INK, max_lines=2)

    evidence_card(
        c, MARGIN, 446, PAGE_W - 2 * MARGIN, 132,
        "Claims AI - primary recommendation story",
        "Worked across an AWS-based text and voice claims experience connecting application code, enterprise services, knowledge, forms, authentication, and business rules.",
        [
            "Mapped the end-to-end experience across routes, document preview, data, APIs, cloud services, and production risks.",
            "Improved privacy-conscious observability, isolated data handling, approval controls, content rendering, and voice-related tools.",
            "Diagnosed browser, API, streaming, authentication, permission, and cloud-configuration issues.",
            "Built readiness checks, test/fix/retest loops, UAT coverage, browser verification, and detailed handoff documentation.",
        ],
        accent=NYL_BLUE,
    )

    gap = 12
    col_w = (PAGE_W - 2 * MARGIN - gap) / 2
    left = MARGIN
    right = MARGIN + col_w + gap

    evidence_card(
        c, left, 304, col_w, 128,
        "Company Brain / NYL Knowledge",
        "Helped turn fragmented operational material into governed knowledge usable by people and AI.",
        [
            "Built ingestion and source-to-topic synthesis workflows.",
            "Added provenance, citations, freshness, review states, and usefulness gates.",
            "Separated raw evidence, durable knowledge, customer-safe guidance, and employee-only material.",
            "Created read-only connector tooling, dashboards, and executive summaries.",
        ],
        accent=TEAL,
        compact=True,
    )

    evidence_card(
        c, right, 304, col_w, 128,
        "Pega and legacy modernization",
        "Made opaque low-code and legacy artifacts inspectable, traceable, and understandable to reviewers.",
        [
            "Inspected exports, Java archives, XML, manifests, dependencies, and rule classes.",
            "Built resumable extraction and recovery workflows.",
            "Translated technical rules into business-readable logic.",
            "Supported impact, drift, test, approval, and audit workflows under read-only boundaries.",
        ],
        accent=HexColor("#7552B8"),
        compact=True,
    )

    evidence_card(
        c, left, 179, col_w, 111,
        "AEM website engineering",
        "Connected design and requirements to implementation and browser verification.",
        [
            "Worked from Jira/Figma context through repository setup, components, local preview, and testing.",
            "Created reusable workflows and documentation while navigating enterprise environment constraints.",
            "Used clean worktrees, feature tracking, and browser evidence to protect delivery quality.",
        ],
        accent=HexColor("#1E8AAF"),
        compact=True,
    )

    evidence_card(
        c, right, 179, col_w, 111,
        "Platform and business automation",
        "Supported the infrastructure and reusable operating artifacts around the AI work.",
        [
            "Contributed to infrastructure-as-code, email/streaming integration, configuration, and access diagnosis.",
            "Built reusable skills, connectors, scaffolds, setup notes, reports, dashboards, and review tools.",
            "Separated projected value from verified outcomes and left owner-ready handoffs.",
        ],
        accent=AMBER,
        compact=True,
    )

    round_rect(c, MARGIN, 62, PAGE_W - 2 * MARGIN, 102, fill=NAVY, stroke=NAVY)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(HexColor("#9EC5FF"))
    c.drawString(MARGIN + 16, 143, "WHAT THESE EXAMPLES DEMONSTRATE")
    bullet_list(c, [
        "Independent ownership, rapid learning, full-system thinking, and strong engineering judgment.",
        "Ability to translate between technical implementation, business rules, evidence, and stakeholder needs.",
        "A habit of verifying work, protecting data and permissions, documenting limitations, and enabling knowledge transfer.",
    ], MARGIN + 16, 124, PAGE_W - 2 * MARGIN - 32, size=7.6, leading=9.5, gap=3, color=white)
    c.setFont("Helvetica-Oblique", 6.8)
    c.setFillColor(HexColor("#BFD5F7"))
    c.drawString(MARGIN + 16, 72, "Verify before use: approximately 12,000 intended service representatives and approximately 13,000 source documents.")


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    prepare_nyl_logo()
    c = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1)
    c.setTitle("Akash Dubey - Graduate Recommendation Brag Sheets")
    c.setAuthor("Akash Dubey")
    c.setSubject("Private recommender reference for Fall 2027 master's applications")
    page_one(c)
    c.showPage()
    page_two(c)
    c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
