import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import json
import urllib.request

TARGET_DIR = r'd:\jjc\usool notes'
ORIGINAL_DIR = os.path.join(TARGET_DIR, 'original')
TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTUzMjQxNDMsImlhdCI6MTc5MjczMjE0MywiaXNzIjoic2NyaWJkLW1vbm9saXRoIiwiZm9ybWF0X3V1aWQiOiI0dWxyM2lqYnk4OHcxdWhrIiwieF9zY3JpYmRfdXVpZCI6IjIxMjcxZTI5LTVmMWYtNGM5YS1hYjQwLTY5ODAzOWJiMjVkZSIsInhfcmVxdWVzdF9pZCI6IjQ3MTEwNDEwMGE5MjYzY2RkNjQ0MGI0YTk4ODgwZTVhYzRkNjE4ZWVlYTc1ODYxMTExODU5MWZhZGNjOTAzMjAiLCJwYWdlX21pbiI6MSwicGFnZV9tYXgiOjExMywiZW5mb3JjZSI6dHJ1ZX0.LelvSgqU2lRK21hbXO1cxGtiLs2O0LlLCc4ukrzEWXc'
UUID = '4ulr3ijby88w1uhk'

# Specifically download page 113 as PNG
p113_orig = '113-fa4a9630e4.png'
p113_clean = 'page_113.png'
url_113 = f'https://html.scribdassets.com/{UUID}/images/{p113_orig}?token={TOKEN}'
req = urllib.request.Request(url_113, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = resp.read()
    with open(os.path.join(TARGET_DIR, p113_clean), 'wb') as f:
        f.write(data)
    with open(os.path.join(ORIGINAL_DIR, p113_orig), 'wb') as f:
        f.write(data)
    print(f'Downloaded Page 113 successfully ({len(data)} bytes)')

# Verify all 113 files in TARGET_DIR
all_pages = []
for p in range(1, 114):
    clean_png = f'page_{p:03d}.png'
    clean_jpg = f'page_{p:03d}.jpg'
    
    found_file = None
    if os.path.exists(os.path.join(TARGET_DIR, clean_png)):
        found_file = clean_png
    elif os.path.exists(os.path.join(TARGET_DIR, clean_jpg)):
        found_file = clean_jpg
        
    if not found_file:
        print(f'MISSING: Page {p}')
    else:
        sz = os.path.getsize(os.path.join(TARGET_DIR, found_file))
        if sz < 10000:
            print(f'SUSPICIOUS SMALL FILE: {found_file} ({sz} bytes)')
        all_pages.append({'page': p, 'file': found_file, 'sizeBytes': sz})

print(f'\nTotal verified files in {TARGET_DIR}: {len(all_pages)} / 113')

# Build comprehensive manifest.json
manifest_path = os.path.join(TARGET_DIR, 'manifest.json')
with open(manifest_path, 'r', encoding='utf-8') as f:
    old_manifest = json.load(f)

# Re-read scratch/embed_content.html to get original filenames
import re
with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

orig_map = {
    1: '1-a21fc908ce.png',
    2: '2-4f2fa079c0.jpg',
    3: '3-4817701d39.jpg',
    113: '113-fa4a9630e4.png'
}
for p, h in re.findall(r'https?://[^\s\'"<>]+/pages/(\d+)-([a-f0-9]+)\.jsonp', text):
    page_num = int(p)
    if page_num not in orig_map:
        orig_map[page_num] = f'{page_num}-{h}.jpg'

final_manifest = {
    'titleArabic': 'شرح جمع الجوامع للمحلي',
    'titleMalayalam': 'ശറഹു ജംഉൽ ജവാമിഅ് - ഇമാം ജലാലുദ്ദീൻ അൽ മഹല്ലി (റ)',
    'bookSubject': 'Usool al-Fiqh (ഉസൂലുൽ ഫിഖ്ഹ്)',
    'totalPages': 113,
    'formatUuid': UUID,
    'pages': [
        {
            'page': p,
            'file': f'page_{p:03d}.png' if p in [1, 113] else f'page_{p:03d}.jpg',
            'originalFile': orig_map[p],
            'url': f'https://html.scribdassets.com/{UUID}/images/{orig_map[p]}?token={TOKEN}',
            'sizeBytes': os.path.getsize(os.path.join(TARGET_DIR, f'page_{p:03d}.png' if p in [1, 113] else f'page_{p:03d}.jpg'))
        }
        for p in range(1, 114)
    ]
}

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(final_manifest, f, ensure_ascii=False, indent=2)

print('Updated manifest.json with all 113 pages!')
