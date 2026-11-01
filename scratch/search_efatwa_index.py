import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

# Check index page 517 of volume 1
url_idx = 'https://lib.efatwa.ir/43733/1/517'
try:
    req = urllib.request.Request(url_idx, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Index 517 loaded, len:', len(html))
        with open('scratch/efatwa_idx1.html', 'w', encoding='utf-8') as f:
            f.write(html)
except Exception as e:
    print('Error index 1:', e)

# Also check volume 2 page 1 and index
url_v2 = 'https://lib.efatwa.ir/43733/2/1'
try:
    req = urllib.request.Request(url_v2, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Vol 2 page 1 loaded, len:', len(html))
except Exception as e:
    print('Error vol 2:', e)
