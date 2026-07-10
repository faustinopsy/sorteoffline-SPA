#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Gera o PDF do livro "KiBusão Web — do zero à aplicação" a partir dos
capítulos em markdown (pasta capitulos/), na ordem numérica dos arquivos.
Pipeline: markdown -> HTML estilizado -> PDF via Chrome headless.
Diagramas são SVG inline nos capítulos (passam direto pelo markdown).
"""
import glob
import os
import re
import subprocess
import sys
import markdown

BASE = os.path.dirname(os.path.abspath(__file__))
CAP_DIR = os.path.join(BASE, "capitulos")
HTML_OUT = os.path.join(BASE, "Livro-LMania-React.html")
PDF_OUT = os.path.join(BASE, "Livro-LMania-React.pdf")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

CSS = r"""
@page { size: A4; margin: 19mm 17mm 20mm 17mm; @bottom-center { content: counter(page); } }
:root {
  --tinta: #16202e; --suave: #55617a; --borda: #e3e8f0;
  --laranja: #EA6D0C; --laranja2: #F59E0B; --azul: #2563eb; --marinho: #0F172A;
  --codigo-bg: #0f1b2d; --verde: #0f9d58; --roxo: #7c3aed;
}
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Georgia","Times New Roman",serif; color: var(--tinta); font-size: 10.7pt; line-height: 1.62; margin: 0; }
/* ---------- CAPA ---------- */
.capa { page-break-after: always; height: 250mm; background: linear-gradient(155deg,#0F172A 0%,#12233b 60%,#1b3a5c 100%); color:#fff; display:flex; flex-direction:column; justify-content:center; padding:0 20mm; }
.capa .kicker { color: var(--laranja2); letter-spacing:3px; font-size:12pt; text-transform:uppercase; font-family:Arial,sans-serif; }
.capa h1 { font-size:40pt; line-height:1.04; margin:12px 0 4px; font-family:Arial,sans-serif; font-weight:800; }
.capa h1 .d { color: var(--laranja2); }
.capa .sub { font-size:15pt; color:#c7d2e6; margin-top:8px; font-family:Arial,sans-serif; }
.capa .barra { width:92px; height:6px; background:var(--laranja); margin:24px 0; border-radius:3px; }
.capa .rodape { margin-top:auto; color:#8a97b1; font-size:10.5pt; font-family:Arial,sans-serif; }
.capa .ico { font-size:60pt; margin-bottom:8px; }
/* ---------- TIPOGRAFIA ---------- */
h1.cap { font-family:Arial,sans-serif; font-size:21pt; color:var(--marinho); border-bottom:3px solid var(--laranja); padding-bottom:8px; margin:0 0 4px; page-break-before:always; page-break-after:avoid; }
h1.cap .num { color:var(--laranja); }
h1.mod { font-family:Arial,sans-serif; font-size:15pt; color:#fff; background:linear-gradient(90deg,#0F172A,#1b3a5c); padding:16px 18px; border-radius:10px; margin:0 0 4px; page-break-before:always; }
h2 { font-family:Arial,sans-serif; font-size:14.5pt; color:var(--marinho); margin-top:22px; page-break-after:avoid; }
h3 { font-family:Arial,sans-serif; font-size:12pt; color:#22344d; margin-top:16px; page-break-after:avoid; }
p { margin:8px 0; text-align:justify; }
strong { color:#0b1524; }
a { color:var(--azul); text-decoration:none; }
ul,ol { margin:8px 0 8px 4px; padding-left:22px; } li { margin:4px 0; }
hr { border:none; border-top:1px solid var(--borda); margin:22px 0; }
/* ---------- CÓDIGO ---------- */
code { font-family:"Consolas","Courier New",monospace; font-size:9pt; background:#eef1f6; color:#b3391a; padding:1px 5px; border-radius:4px; }
pre { background:var(--codigo-bg); color:#e8eef7; padding:12px 14px; border-radius:8px; border-left:4px solid var(--laranja); overflow-x:auto; font-size:8.6pt; line-height:1.5; page-break-inside:avoid; margin:12px 0; }
pre code { background:none; color:inherit; padding:0; font-size:8.6pt; }
.codehilite .k,.codehilite .kd,.codehilite .kn { color:#ff9f6b; }
.codehilite .s,.codehilite .s1,.codehilite .s2 { color:#9ece6a; }
.codehilite .c,.codehilite .c1,.codehilite .cm { color:#7f8ba3; font-style:italic; }
.codehilite .nb,.codehilite .bp { color:#7dcfff; }
.codehilite .nf,.codehilite .fm { color:#7aa2f7; }
.codehilite .mi,.codehilite .mf { color:#ff9e64; }
.codehilite .o,.codehilite .p { color:#c0caf5; }
.codehilite .nt { color:#f7768e; } .codehilite .na { color:#bb9af7; }
/* ---------- CALLOUTS ---------- */
.callout { padding:11px 15px; border-radius:8px; margin:14px 0; page-break-inside:avoid; }
.callout .rot { font-family:Arial,sans-serif; font-weight:700; font-size:9.5pt; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px; }
.dica { background:#eafaf1; border-left:4px solid var(--verde); } .dica .rot { color:#0b7a43; }
.cuidado { background:#fdecec; border-left:4px solid #e53935; } .cuidado .rot { color:#c62828; }
.importante { background:#fff7ec; border-left:4px solid var(--laranja); } .importante .rot { color:#b35c00; }
.nota { background:#eaf1fb; border-left:4px solid var(--azul); } .nota .rot { color:#1d4ed8; }
.pratica { background:#f3edfd; border-left:4px solid var(--roxo); } .pratica .rot { color:#6d28d9; }
/* ---------- TABELAS ---------- */
table { border-collapse:collapse; width:100%; margin:14px 0; font-size:9.3pt; page-break-inside:avoid; }
th { background:var(--marinho); color:#fff; font-family:Arial,sans-serif; text-align:left; padding:7px 10px; }
td { border:1px solid var(--borda); padding:6px 10px; vertical-align:top; }
tr:nth-child(even) td { background:#f6f8fb; }
/* ---------- DIAGRAMAS ---------- */
.fig { text-align:center; margin:16px 0; page-break-inside:avoid; }
.fig svg { max-width:100%; height:auto; }
.fig .leg { font-family:Arial,sans-serif; font-size:8.8pt; color:var(--suave); margin-top:6px; font-style:italic; }
/* ---------- SUMÁRIO ---------- */
.sumario { page-break-after:always; }
.sumario h1 { font-family:Arial,sans-serif; color:var(--marinho); border-bottom:3px solid var(--laranja); padding-bottom:8px; font-size:20pt; }
.sumario .item { display:flex; justify-content:space-between; border-bottom:1px dotted #ccd3e0; padding:5px 0; font-family:Arial,sans-serif; font-size:10.4pt; }
.sumario .item.mod { font-weight:700; color:var(--laranja); margin-top:13px; border:none; font-size:11pt; }
.sumario .item .t { color:var(--tinta); }
"""


def build_toc(chapter_htmls):
    itens = []
    for html in chapter_htmls:
        for m in re.finditer(r'<h1 class="(cap|mod)"[^>]*>(.*?)</h1>', html, re.S):
            tipo = m.group(1)
            titulo = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            itens.append((tipo, titulo))
    linhas = ['<div class="sumario"><h1>Sumário</h1>']
    for tipo, it in itens:
        cls = "item mod" if tipo == "mod" else "item"
        linhas.append(f'<div class="{cls}"><span class="t">{it}</span></div>')
    linhas.append("</div>")
    return "\n".join(linhas)


def main():
    arquivos = sorted(glob.glob(os.path.join(CAP_DIR, "*.md")))
    if not arquivos:
        print("Nenhum capítulo em", CAP_DIR); sys.exit(1)
    md = markdown.Markdown(extensions=["fenced_code", "codehilite", "tables", "attr_list", "md_in_html"],
                           extension_configs={"codehilite": {"guess_lang": False, "noclasses": False}})
    capa_path = os.path.join(BASE, "capa.html")
    capa = open(capa_path, encoding="utf-8").read() if os.path.exists(capa_path) else ""
    chapter_htmls = []
    for a in arquivos:
        md.reset()
        chapter_htmls.append(md.convert(open(a, encoding="utf-8").read()))
    corpo = capa + build_toc(chapter_htmls) + "\n".join(chapter_htmls)
    doc = f'<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{corpo}</body></html>'
    with open(HTML_OUT, "w", encoding="utf-8") as f:
        f.write(doc)
    print("HTML:", HTML_OUT, f"({len(doc)//1024} KB)")
    url = "file:///" + HTML_OUT.replace("\\", "/")
    subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={PDF_OUT}", "--no-margins", url], check=False)
    if os.path.exists(PDF_OUT):
        print("PDF:", PDF_OUT, f"({os.path.getsize(PDF_OUT)//1024} KB)")
    else:
        print("Falha ao gerar PDF.")


if __name__ == "__main__":
    main()
