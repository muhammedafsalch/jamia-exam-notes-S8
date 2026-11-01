import sys
sys.stdout.reconfigure(encoding='utf-8')
import re
from bs4 import BeautifulSoup

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)

print(f'Total parts: {len(parts)}')

# Check page 145 (part index 144)
p145_html = parts[144]

# Let's inspect how soup parses it
soup = BeautifulSoup(p145_html, 'html.parser')

print('Paragraphs in P145:', len(soup.find_all('p')))
for p in soup.find_all('p')[:5]:
    cls = p.get('class', [])
    print(f'  <p class="{cls}">{p.text[:80]}...</p>')

# Let's check how matn is tagged
matn_spans = soup.find_all('span', class_='rfdBold2')
print(f'Matn spans count in P145: {len(matn_spans)}')
for s in matn_spans[:3]:
    print('  Matn span:', s.text)
