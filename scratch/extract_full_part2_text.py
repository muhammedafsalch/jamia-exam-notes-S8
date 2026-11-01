import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

TARGET_DIR = r'd:\jjc\usool notes'
os.makedirs(TARGET_DIR, exist_ok=True)

START_PAGE = 31
END_PAGE = 208
VOL = 2
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_page_content(page_num):
    url = f'https://lib.efatwa.ir/43733/{VOL}/{page_num}'
    max_retries = 3
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
            
            m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
            if not m:
                return {'page': page_num, 'error': 'No page content found'}
            
            raw = m.group(1)
            # Split off footnote (Hashiyat al-Attar)
            parts = re.split(r'ــــــــــــــــــــــــ|ـــــQ', raw)
            top_text = parts[0]
            # Remove toolbar buttons
            top_text = re.sub(r'<div class="sticky-menue">.*?</div>', '', top_text, flags=re.DOTALL)
            # Format newlines
            clean = re.sub(r'<br\s*/?>', '\n', top_text)
            clean = re.sub(r'<[^>]+>', '', clean).strip()
            
            # Extract matn in brackets
            matn_pieces = re.findall(r'\(([^)]+)\)', clean)
            
            return {
                'page': page_num,
                'url': url,
                'combinedSharhMatn': clean,
                'matn': ' '.join(matn_pieces)
            }
        except Exception as e:
            if attempt == max_retries - 1:
                return {'page': page_num, 'error': str(e)}
            time.sleep(1 + attempt)

print(f'Fetching Part 2: Pages {START_PAGE} to {END_PAGE} (Total: {END_PAGE - START_PAGE + 1} pages)...')
start_time = time.time()
pages_data = []

with ThreadPoolExecutor(max_workers=10) as executor:
    future_to_page = {executor.submit(fetch_page_content, p): p for p in range(START_PAGE, END_PAGE + 1)}
    done_count = 0
    total = len(future_to_page)
    for future in as_completed(future_to_page):
        res = future.result()
        pages_data.append(res)
        done_count += 1
        if done_count % 25 == 0 or done_count == total:
            print(f'Progress: {done_count}/{total} pages extracted... ({time.time()-start_time:.1f}s)')

pages_data.sort(key=lambda x: x['page'])
print(f'Extraction completed in {time.time()-start_time:.2f}s!')

# Save as JSON
json_path = os.path.join(TARGET_DIR, 'mahalli_usool_part2_text.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump({
        'bookTitle': 'شرح الجلال المحلي على جمع الجوامع',
        'part': 'الجزء الثاني (من باب التخصيص إلى نهاية كتاب الأخبار)',
        'source': 'https://lib.efatwa.ir/43733/2/',
        'pageRange': f'Volume {VOL}, Pages {START_PAGE} - {END_PAGE}',
        'totalPages': len(pages_data),
        'pages': pages_data
    }, f, ensure_ascii=False, indent=2)

# Save clean combined text file
txt_path = os.path.join(TARGET_DIR, 'mahalli_usool_part2_text.txt')
with open(txt_path, 'w', encoding='utf-8') as f:
    f.write('========================================================================\n')
    f.write('شرح الإمام جلال الدين المحلي على جمع الجوامع للتاج السبكي (الجزء الثاني)\n')
    f.write('من باب التخصيص إلى نهاية مباحث الأخبار والسنة (المجلد 2، ص 31 - ص 208)\n')
    f.write('ملاحظة: المتن بين القوسين (...)، والشرح للمحلي خارج القوسين.\n')
    f.write('========================================================================\n\n')
    for p in pages_data:
        f.write(f'\n--- [المجلد {VOL}، صفحة {p["page"]}] ---\n')
        f.write(p.get('combinedSharhMatn', '') + '\n')

print(f'Saved JSON to: {json_path}')
print(f'Saved TXT to: {txt_path}')
