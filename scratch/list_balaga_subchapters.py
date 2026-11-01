import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)

print('Listing chapters between page 145 and 216:')
for p_num in range(145, 217):
    p_content = parts[p_num - 1]
    # find headings
    headings = re.findall(r'<p\s+class=[^>]*Heading[^>]*>(.*?)</p>', p_content, re.IGNORECASE)
    # find bold headings or spans
    bolds = re.findall(r'<p\s+class=[^>]*Bold[^>]*>(.*?)</p>', p_content, re.IGNORECASE)
    if headings or bolds:
        print(f'Page {p_num}:')
        for h in headings:
            print('   [Heading]:', re.sub(r'<[^>]+>', '', h).strip())
        for b in bolds:
            print('   [Bold]:', re.sub(r'<[^>]+>', '', b).strip())
