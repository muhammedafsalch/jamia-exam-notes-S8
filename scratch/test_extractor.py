import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0'}

def extract_sharh_and_matn(vol, page):
    url = f'https://lib.efatwa.ir/43733/{vol}/{page}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    
    m = re.search(r'<td class="book-page-show"[^>]*>(.*?)</td>', html, re.DOTALL)
    if not m:
        return None
    
    raw = m.group(1)
    # Split by footnote line
    parts = re.split(r'ــــــــــــــــــــــــ|ـــــQ', raw)
    top_text = parts[0]
    # Remove tools bar
    top_text = re.sub(r'<div class="sticky-menue">.*?</div>', '', top_text, flags=re.DOTALL)
    # Replace br with newline
    clean = re.sub(r'<br\s*/?>', '\n', top_text)
    clean = re.sub(r'<[^>]+>', '', clean).strip()
    
    # Extract matn in parentheses
    matn_pieces = re.findall(r'\(([^)]+)\)', clean)
    
    return {
        'page': page,
        'combinedText': clean,
        'matnPieces': matn_pieces
    }

for p in [31, 32, 33]:
    res = extract_sharh_and_matn(2, p)
    print(f'*** PAGE {p} ***')
    print('FULL TEXT (Sharh + Matn):')
    print(res['combinedText'])
    print('EXTRACTED MATN ONLY:')
    for m in res['matnPieces']:
        print('  •', m)
    print('\n' + '='*50 + '\n')
