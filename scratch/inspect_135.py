import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

def print_page(vol, page):
    url = f'https://lib.efatwa.ir/43733/{vol}/{page}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
            if m:
                content = m.group(1).split('ـــــQ')[0]
                content = re.sub(r'<div class="sticky-menue">.*?</div>', '', content, flags=re.DOTALL)
                clean = re.sub(r'<br\s*/?>', '\n', content)
                clean = re.sub(r'<[^>]+>', '', clean).strip()
                print(f'=== VOL {vol}, PAGE {page} ===')
                print(clean[:450])
                print('\n')
    except Exception as e:
        print(f'Error: {e}')

for p in [131, 132, 133]:
    print_page(2, p)
