import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}
url = 'https://shamela.ws/book/96155'
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Shamela 96155 loaded, len:', len(html))
        # Find chapter links or page links
        m = re.findall(r'/book/96155/(\d+)', html)
        print('Sample page links:', m[:10])
except Exception as e:
    print('Shamela error:', e)
