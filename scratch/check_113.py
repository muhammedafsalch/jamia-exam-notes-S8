import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTUzMjQxNDMsImlhdCI6MTc5MjczMjE0MywiaXNzIjoic2NyaWJkLW1vbm9saXRoIiwiZm9ybWF0X3V1aWQiOiI0dWxyM2lqYnk4OHcxdWhrIiwieF9zY3JpYmRfdXVpZCI6IjIxMjcxZTI5LTVmMWYtNGM5YS1hYjQwLTY5ODAzOWJiMjVkZSIsInhfcmVxdWVzdF9pZCI6IjQ3MTEwNDEwMGE5MjYzY2RkNjQ0MGI0YTk4ODgwZTVhYzRkNjE4ZWVlYTc1ODYxMTExODU5MWZhZGNjOTAzMjAiLCJwYWdlX21pbiI6MSwicGFnZV9tYXgiOjExMywiZW5mb3JjZSI6dHJ1ZX0.LelvSgqU2lRK21hbXO1cxGtiLs2O0LlLCc4ukrzEWXc'
UUID = '4ulr3ijby88w1uhk'

with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

m113 = re.findall(r'113-[a-zA-Z0-9_\-\.]+', text)
print('Page 113 matches in embed HTML:', m113)

# Let's check page 113 jsonp
for name in m113:
    if name.endswith('.jsonp'):
        url = f'https://html.scribdassets.com/{UUID}/pages/{name}'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            import gzip
            with urllib.request.urlopen(req) as resp:
                decomp = gzip.decompress(resp.read()).decode('utf-8', errors='ignore')
                print('jsonp for 113:', decomp)
        except Exception as e:
            print('Error fetching 113 jsonp:', e)
