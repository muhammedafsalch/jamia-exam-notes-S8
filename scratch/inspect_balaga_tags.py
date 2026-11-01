import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)

print('Inspecting pages 145 to 150 for formatting tags...')
sample_page = parts[144] # page 145

print('Page 145 raw HTML:')
print(sample_page[:1000])

# Check all span classes in pages 145 to 220
all_span_classes = set()
for p in range(144, 220):
    classes = re.findall(r'<span\s+class=([^\s>]+)', parts[p])
    all_span_classes.update(classes)

print('Span classes found:', all_span_classes)

# Check all p classes in pages 145 to 220
all_p_classes = set()
for p in range(144, 220):
    classes = re.findall(r'<p\s+class=([^\s>]+)', parts[p])
    all_p_classes.update(classes)

print('P classes found:', all_p_classes)
