import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')
txt_418 = doc[417].get_text() # 0-indexed: 417 is page 418
print('=== RAW TEXT FROM PAGE 418 ===')
for line in txt_418.split('\n')[:25]:
    if line.strip():
        print(line.strip())
