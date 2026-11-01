import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0'}

queries = ['التخصيص', 'باب_التخصيص', 'الكلام_في_الأخبار', 'الأخبار', 'الكتاب_الثاني_في_السنة']

for q in queries:
    url = f'https://lib.efatwa.ir/search/43733/{urllib.parse.quote(q)}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f'Query: {q} -> length: {len(html)}')
            results = re.findall(r'/43733/(\d+)/(\d+)', html)
            unique_results = sorted(list(set((int(v), int(p)) for v, p in results)))
            print(f'   Results count: {len(unique_results)}')
            for v, p in unique_results[:10]:
                print(f'      Vol {v}, Page {p}')
    except Exception as e:
        print(f'Query error: {e}')
