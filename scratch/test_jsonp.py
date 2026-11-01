import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import gzip

url = 'https://html.scribdassets.com/4ulr3ijby88w1uhk/pages/4-9ce5c600f3.jsonp'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    raw = resp.read()
    decomp = gzip.decompress(raw)
    print(decomp.decode('utf-8', errors='ignore'))
