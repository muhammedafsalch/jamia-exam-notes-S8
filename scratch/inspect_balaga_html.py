import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('scratch/balaga_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print('Length of balaga_full.html:', len(txt))
print('First 600 chars:')
print(txt[:600])

# Look for page markers
page_markers = re.findall(r'<div[^>]*class=["\'][^"\']*pgnum[^"\']*["\'][^>]*>(.*?)</div>', txt, re.IGNORECASE)
print('Found page markers count:', len(page_markers))
if page_markers:
    print('Sample markers:', page_markers[:10])

# Look for headers or divs
div_classes = set(re.findall(r'class=["\']([^"\']+)["\']', txt))
print('Div classes found:', list(div_classes)[:15])

# Search for الفصل والوصل
idx = txt.find('الفصل والوصل')
print('Index of الفصل والوصل:', idx)
if idx != -1:
    print('Context around الفصل والوصل:')
    print(txt[max(0, idx-100):min(len(txt), idx+300)])

# Search for الحقيقة والمجاز
idx2 = txt.find('الحقيقة والمجاز')
print('Index of الحقيقة والمجاز:', idx2)
if idx2 != -1:
    print('Context around الحقيقة والمجاز:')
    print(txt[max(0, idx2-100):min(len(txt), idx2+300)])
