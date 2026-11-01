import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

all_jsonp = dict((int(p), h) for p, h in re.findall(r'https?://[^\s\'"<>]+/pages/(\d+)-([a-f0-9]+)\.jsonp', text))

print('Page 16 hash:', all_jsonp.get(16))
print('Page 18 hash:', all_jsonp.get(18))
print('Page 27 hash:', all_jsonp.get(27))
