import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

def check_page(vol, page):
    url = f'https://lib.efatwa.ir/43733/{vol}/{page}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
            if m:
                # get text before the footnote line ـــــQ
                content = m.group(1).split('ـــــQ')[0]
                clean = re.sub(r'<[^>]+>', ' ', content).strip()
                print(f'=== Vol {vol}, Page {page} ===')
                print(clean[:300])
                print('...')
    except Exception as e:
        print(f'Error Vol {vol} Page {page}: {e}')

check_page(1, 409)
check_page(1, 410)
check_page(1, 411)
check_page(2, 118)
check_page(2, 119)
check_page(2, 120)
check_page(2, 121)
