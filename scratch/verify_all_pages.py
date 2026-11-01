import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import urllib.request
import concurrent.futures

TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTUzMjQxNDMsImlhdCI6MTc5MjczMjE0MywiaXNzIjoic2NyaWJkLW1vbm9saXRoIiwiZm9ybWF0X3V1aWQiOiI0dWxyM2lqYnk4OHcxdWhrIiwieF9zY3JpYmRfdXVpZCI6IjIxMjcxZTI5LTVmMWYtNGM5YS1hYjQwLTY5ODAzOWJiMjVkZSIsInhfcmVxdWVzdF9pZCI6IjQ3MTEwNDEwMGE5MjYzY2RkNjQ0MGI0YTk4ODgwZTVhYzRkNjE4ZWVlYTc1ODYxMTExODU5MWZhZGNjOTAzMjAiLCJwYWdlX21pbiI6MSwicGFnZV9tYXgiOjExMywiZW5mb3JjZSI6dHJ1ZX0.LelvSgqU2lRK21hbXO1cxGtiLs2O0LlLCc4ukrzEWXc'
UUID = '4ulr3ijby88w1uhk'

with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Build mapping of page_num -> filename
pages = {}
pages[1] = '1-a21fc908ce.png'
pages[2] = '2-4f2fa079c0.jpg'
pages[3] = '3-4817701d39.jpg'

for p, h in re.findall(r'https?://[^\s\'"<>]+/pages/(\d+)-([a-f0-9]+)\.jsonp', text):
    page_num = int(p)
    pages[page_num] = f'{page_num}-{h}.jpg'

print(f'Total pages mapped: {len(pages)}')
missing = [i for i in range(1, 114) if i not in pages]
print(f'Missing pages: {missing}')

# Let's verify sample
for p in [1, 2, 3, 16, 27, 72, 113]:
    print(f'Page {p}: {pages.get(p)}')
