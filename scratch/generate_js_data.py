import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('usool notes/mahalli_usool_part2_text.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Write as js
with open('usool notes/mahalli_part2_data.js', 'w', encoding='utf-8') as f:
    f.write('window.MAHALLI_PART2_DATA = ')
    json.dump(data, f, ensure_ascii=False)
    f.write(';\n')

print('Generated usool notes/mahalli_part2_data.js successfully!')
