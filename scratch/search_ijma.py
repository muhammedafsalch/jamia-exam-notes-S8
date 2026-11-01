import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

for p in [208, 209, 210]:
    url = f'https://lib.efatwa.ir/43733/2/{p}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
        if m:
            clean = re.sub(r'<[^>]+>', ' ', m.group(1).split('ـــــQ')[0]).strip()
            print(f'=== Page {p} ===\n', clean[:350], '\n')
