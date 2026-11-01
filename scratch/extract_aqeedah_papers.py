import pymupdf
import json

files = [
    'd:/jjc/papers/adeeqah/S 8 & HS 6 Aqeeda A4 2 Side.pdf',
    'd:/jjc/papers/adeeqah/S 8 Aqeeda A4 2 Side.pdf'
]

results = {}
for fn in files:
    doc = pymupdf.open(fn)
    pages_text = []
    for i, page in enumerate(doc):
        t = page.get_text()
        pages_text.append(t)
    results[fn] = pages_text

with open('d:/jjc/scratch/extracted_aqeedah_papers.txt', 'w', encoding='utf-8') as f:
    for fn, pages in results.items():
        f.write(f"====================================\nFILE: {fn}\nPAGES: {len(pages)}\n====================================\n")
        for i, p in enumerate(pages):
            f.write(f"\n--- PAGE {i+1} ---\n")
            f.write(p)
            f.write("\n")

print("Successfully extracted to d:/jjc/scratch/extracted_aqeedah_papers.txt")
