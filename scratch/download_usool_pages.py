import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

TARGET_DIR = r'd:\jjc\usool notes'
ORIGINAL_DIR = os.path.join(TARGET_DIR, 'original')
os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(ORIGINAL_DIR, exist_ok=True)

TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTUzMjQxNDMsImlhdCI6MTc5MjczMjE0MywiaXNzIjoic2NyaWJkLW1vbm9saXRoIiwiZm9ybWF0X3V1aWQiOiI0dWxyM2lqYnk4OHcxdWhrIiwieF9zY3JpYmRfdXVpZCI6IjIxMjcxZTI5LTVmMWYtNGM5YS1hYjQwLTY5ODAzOWJiMjVkZSIsInhfcmVxdWVzdF9pZCI6IjQ3MTEwNDEwMGE5MjYzY2RkNjQ0MGI0YTk4ODgwZTVhYzRkNjE4ZWVlYTc1ODYxMTExODU5MWZhZGNjOTAzMjAiLCJwYWdlX21pbiI6MSwicGFnZV9tYXgiOjExMywiZW5mb3JjZSI6dHJ1ZX0.LelvSgqU2lRK21hbXO1cxGtiLs2O0LlLCc4ukrzEWXc'
UUID = '4ulr3ijby88w1uhk'

with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Map page number to scribd filename
page_files = {
    1: '1-a21fc908ce.png',
    2: '2-4f2fa079c0.jpg',
    3: '3-4817701d39.jpg'
}

for p, h in re.findall(r'https?://[^\s\'"<>]+/pages/(\d+)-([a-f0-9]+)\.jsonp', text):
    page_files[int(p)] = f'{p}-{h}.jpg'

print(f'Total pages to download: {len(page_files)}')

def download_page(page_num, scribd_name):
    ext = scribd_name.split('.')[-1]
    clean_name = f'page_{page_num:03d}.{ext}'
    clean_path = os.path.join(TARGET_DIR, clean_name)
    orig_path = os.path.join(ORIGINAL_DIR, scribd_name)
    
    # Check if already downloaded and valid
    if os.path.exists(clean_path) and os.path.getsize(clean_path) > 10000:
        return {
            'page': page_num,
            'cleanName': clean_name,
            'originalName': scribd_name,
            'size': os.path.getsize(clean_path),
            'status': 'cached'
        }
        
    url = f'https://html.scribdassets.com/{UUID}/images/{scribd_name}?token={TOKEN}'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.scribd.com/'
    }
    
    max_retries = 4
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
                if len(data) < 5000:
                    raise Exception(f'File too small: {len(data)} bytes')
                
                # Write clean path
                with open(clean_path, 'wb') as f_out:
                    f_out.write(data)
                
                # Write orig path
                with open(orig_path, 'wb') as f_out:
                    f_out.write(data)
                
                return {
                    'page': page_num,
                    'cleanName': clean_name,
                    'originalName': scribd_name,
                    'size': len(data),
                    'status': 'downloaded'
                }
        except Exception as e:
            if attempt == max_retries - 1:
                return {
                    'page': page_num,
                    'cleanName': clean_name,
                    'originalName': scribd_name,
                    'error': str(e),
                    'status': 'failed'
                }
            time.sleep(1 + attempt)

start_time = time.time()
results = []
# Use 8 concurrent threads for fast, reliable downloading
with ThreadPoolExecutor(max_workers=8) as executor:
    future_to_page = {executor.submit(download_page, p, page_files[p]): p for p in sorted(page_files.keys())}
    completed_count = 0
    for future in as_completed(future_to_page):
        res = future.result()
        results.append(res)
        completed_count += 1
        if completed_count % 10 == 0 or completed_count == len(page_files):
            print(f'Progress: {completed_count}/{len(page_files)} downloaded... (Elapsed: {time.time()-start_time:.1f}s)')

results.sort(key=lambda x: x['page'])

# Check for failures
failed = [r for r in results if r.get('status') == 'failed']
print(f'\nFinished in {time.time()-start_time:.2f}s!')
print(f'Successful: {len(results) - len(failed)}/{len(page_files)}')
if failed:
    print('Failed pages:', [f['page'] for f in failed])
else:
    print('ALL 113 PAGES DOWNLOADED SUCCESSFULLY!')

# Save manifest.json
manifest = {
    'titleArabic': 'شرح جمع الجوامع للمحلي',
    'titleMalayalam': 'ശറഹു ജംഉൽ ജവാമിഅ് - ഇമാം ജലാലുദ്ദീൻ അൽ മഹല്ലി (റ)',
    'totalPages': len(results),
    'formatUuid': UUID,
    'pages': [
        {
            'page': r['page'],
            'file': r['cleanName'],
            'originalFile': r['originalName'],
            'url': f'https://html.scribdassets.com/{UUID}/images/{r["originalName"]}?token={TOKEN}',
            'sizeBytes': r.get('size', 0)
        }
        for r in results if r.get('status') != 'failed'
    ]
}

with open(os.path.join(TARGET_DIR, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print('Saved manifest.json successfully!')
