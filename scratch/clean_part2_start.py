import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import json
import re

TARGET_DIR = r'd:\jjc\usool notes'
txt_path = os.path.join(TARGET_DIR, 'mahalli_usool_part2_text.txt')
json_path = os.path.join(TARGET_DIR, 'mahalli_usool_part2_text.json')

# 1. Clean JSON
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find page 31 and trim text before (التَّخْصِيصُ)
for p in data['pages']:
    if p['page'] == 31:
        text = p['combinedSharhMatn']
        # Find index of (التَّخْصِيصُ) or (التخصيص)
        match = re.search(r'\(التَّخْصِيصُ\)', text)
        if match:
            clean_text = text[match.start():].strip()
            p['combinedSharhMatn'] = clean_text
            p['matn'] = ' '.join(re.findall(r'\(([^)]+)\)', clean_text))
            print('Page 31 JSON cleaned. New start:', clean_text[:80])

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 2. Clean TXT
with open(txt_path, 'r', encoding='utf-8') as f:
    txt = f.read()

# Replace the text before (التَّخْصِيصُ) on page 31
pattern = r'(--- \[المجلد 2، صفحة 31\] ---)\s*\(أَنَّ نَحْوَ.*?(?=\(التَّخْصِيصُ\))'
new_txt = re.sub(pattern, r'\1\nبَابُ التَّخْصِيصِ\n\n', txt, flags=re.DOTALL)

with open(txt_path, 'w', encoding='utf-8') as f:
    f.write(new_txt)

print('Cleaned mahalli_usool_part2_text.txt successfully!')
