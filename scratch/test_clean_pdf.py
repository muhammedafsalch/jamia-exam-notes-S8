import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import re

def clean_arabic_pdf_text(raw):
    # Fix space before harakat
    # e.g. "هِي َالرَّد ُّ" -> "هِيَ الرَّدُّ"
    text = re.sub(r'([^\s])\s+([\u064B-\u065F\u0670])', r'\1\2', raw)
    
    # Fix reverse parentheses: )text( -> (text)
    # In PDF dump: )شَرْط ُ... (
    text = re.sub(r'\)\s*([^\(\)]+?)\s*\(', r'(\1)', text)
    
    # Remove Shamela footer/header lines like "الجزء الرابع-شرح المحلي على المنهاج" and "Shamela.org"
    lines = []
    for line in text.split('\n'):
        l = line.strip()
        if not l:
            continue
        if any(h in l for h in ['الجزء الرابع-شرح المحلي', 'Shamela.org', '>ص:']):
            continue
        if re.match(r'^[٠-٩0-9\s]+$', l):
            continue
        lines.append(l)
    
    cleaned = '\n'.join(lines)
    return cleaned

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')
# Page 418
txt = doc[417].get_text()
# Slice from كتاب الرجعة
idx = txt.find('كتاب الرجعة')
if idx != -1:
    txt = txt[idx:]

cleaned = clean_arabic_pdf_text(txt)
print('=== CLEANED TEXT FOR PAGE 418 ===')
print(cleaned[:1200])
