import os
import pymupdf

pdf_dir = 'papers/usoolul fiqh'
for fname in sorted(os.listdir(pdf_dir)):
    if fname.endswith('.pdf'):
        fpath = os.path.join(pdf_dir, fname)
        safe_name = fname.replace(' ', '_').replace('&', 'and')
        out_txt = os.path.join('scratch', safe_name + '.txt')
        
        doc = pymupdf.open(fpath)
        full_text = []
        full_text.append(f"=== {fname} (Pages: {len(doc)}) ===\n")
        
        for i, page in enumerate(doc):
            full_text.append(f"\n--- PAGE {i+1} ---\n")
            full_text.append(page.get_text())
            
        with open(out_txt, 'w', encoding='utf-8') as f:
            f.write('\n'.join(full_text))
            
        print(f"Extracted {fname} -> {out_txt} ({len(''.join(full_text))} chars)")
