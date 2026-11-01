import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import re

doc = pymupdf.open(r'd:\jjc\mahalli notes\mahalli.pdf')

chapters = [
    'كتاب الرجعة',
    'كتاب الإيلاء',
    'كتاب الظهار',
    'كتاب اللعان',
    'كتاب العدة',
    'كتاب الرضاع',
    'كتاب النفقات',
    'كتاب الحضانة',
    'كتاب الجراح',
    'كتاب الديات'
]

found_locations = {}

for p in range(417, len(doc)):
    txt = doc[p].get_text()
    for ch in chapters:
        # Match with or without tashkeel
        ch_regex = re.sub(r'[\s]+', r'\\s+', ch)
        if re.search(ch_regex, txt) or re.search(ch.replace(' ', r'\s+'), txt):
            if ch not in found_locations:
                found_locations[ch] = []
            found_locations[ch].append(p + 1)

print('Chapter mentions in Part 4 (from page 418 onwards):')
for ch, pages in found_locations.items():
    print(f'  {ch}: Pages {pages[:5]}')
