import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0'}

queries = ['قصر_العام', 'التخصيص_قصر', 'فصل_في_المخصص', 'المخصص_المتصل', 'الكتاب_الثاني', 'الكلام_في_السنة', 'الأخبار_جمع_خبر']

for q in queries:
    url = f'https://lib.efatwa.ir/search/43733/{urllib.parse.quote(q)}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            results = re.findall(r'/43733/(\d+)/(\d+)', html)
            unique_results = sorted(list(set((int(v), int(p)) for v, p in results)))
            print(f'Query: {q} -> count: {len(unique_results)}')
            for v, p in unique_results[:5]:
                print(f'   Vol {v}, Page {p}')
    except Exception as e:
        print(f'Error {q}: {e}')
