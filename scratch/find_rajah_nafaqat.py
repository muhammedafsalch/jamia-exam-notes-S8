import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import re

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')

def strip_harakat(text):
    return re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)

print(f'Total pages: {len(doc)}')

for i in range(len(doc)):
    raw = doc[i].get_text()
    clean = strip_harakat(raw)
    clean = re.sub(r'\s+', ' ', clean)
    if 'كتاب الرجعة' in clean:
        print(f'Page {i+1} has "كتاب الرجعة":')
        idx = clean.find('كتاب الرجعة')
        print('  Snippet:', clean[max(0, idx-50):min(len(clean), idx+150)])
    if 'كتاب النفقات' in clean:
        print(f'Page {i+1} has "كتاب النفقات":')
        idx = clean.find('كتاب النفقات')
        print('  Snippet:', clean[max(0, idx-50):min(len(clean), idx+150)])
