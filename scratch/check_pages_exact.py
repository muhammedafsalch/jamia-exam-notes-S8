import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)
print(f'Total parts (pages): {len(parts)}')

# Part index: 0 is page 1, 144 is page 145, 214 is page 215, 215 is page 216
for p_idx in [144, 145, 213, 214, 215, 216, 217]:
    p_num = p_idx + 1
    content = parts[p_idx].strip()
    # Strip HTML tags for preview
    clean = re.sub(r'<[^>]+>', ' ', content)
    clean = re.sub(r'\s+', ' ', clean).strip()
    print(f'=== Page {p_num} (len HTML {len(content)}, len text {len(clean)}) ===')
    print(clean[:200] + ' ... ' + clean[-100:])
