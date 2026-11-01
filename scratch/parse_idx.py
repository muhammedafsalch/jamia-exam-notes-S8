import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('scratch/efatwa_idx1.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', text, re.DOTALL)
if m:
    content = m.group(1)
    clean = re.sub(r'<[^>]+>', '\n', content)
    lines = [l.strip() for l in clean.split('\n') if l.strip()]
    print('\n'.join(lines[:40]))
