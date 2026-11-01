import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Let's inspect the TOC at the end of the file
idx_toc = txt.find('الفصل والوصل............................................................... ١٤٥')
print('TOC snippet:')
print(txt[max(0, idx_toc-200):min(len(txt), idx_toc+1200)])

# Let's find all <br clear=all> or page break markers in the text
page_breaks = list(re.finditer(r'<br\s+clear=all>', txt, re.IGNORECASE))
print(f'Total <br clear=all> markers: {len(page_breaks)}')

# Check how headings are tagged
headings = re.findall(r'<p\s+class=[^>]*Heading[^>]*>(.*?)</p>', txt, re.IGNORECASE)
print(f'Total Headings: {len(headings)}')
for h in headings:
    print('  Heading:', h.strip())
