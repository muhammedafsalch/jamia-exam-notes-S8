import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('Length of mukhtasar-almaani.htm:', len(txt))

# Search for page markers
pages = re.findall(r'<div[^>]*class=["\'][^"\']*pgnum[^"\']*["\'][^>]*>(.*?)</div>', txt, re.IGNORECASE)
print('Found pgnum markers count:', len(pages))
if pages:
    print('Sample markers:', pages[:10])

# Find all occurrences of page 145 and 215
for p in [145, 146, 214, 215, 216]:
    # Look for Eastern Arabic or Western Arabic digits or class
    matches = list(re.finditer(rf'pg(\d+)|data-text=["\']?{p}["\']?|>{p}<', txt))
    print(f'Matches for {p}: {len(matches)}')
    for m in matches[:3]:
        print('  Snippet:', txt[max(0, m.start()-50):min(len(txt), m.end()+50)])

# Search for الفصل والوصل
for m in re.finditer(r'الفصل والوصل', txt):
    print('Found "الفصل والوصل" at pos:', m.start())
    print('  Snippet:', txt[max(0, m.start()-100):min(len(txt), m.end()+250)])

# Search for الحقيقة والمجاز
for m in re.finditer(r'الحقيقة والمجاز|الحقيقة|المجاز', txt):
    if m.start() > 300000: # around the expected area
        print(f'Found "{m.group()}" at pos:', m.start())
        print('  Snippet:', txt[max(0, m.start()-50):min(len(txt), m.end()+150)])
        break
