import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

for p in [178, 179, 180]:
    url = f'https://lib.efatwa.ir/43733/1/{p}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
        if m:
            clean = re.sub(r'<[^>]+>', ' ', m.group(1).split('ـــــQ')[0]).strip()
            print(f'=== Vol 1, Page {p} ===\n', clean[:450], '\n')
