import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')
print('=== PAGE 418 (كتاب الرجعة) ===')
txt = doc[417].get_text()
print(txt[:1000])
