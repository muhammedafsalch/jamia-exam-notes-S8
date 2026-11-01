import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open(r'scratch\balaga_extracted\mukhtasar-almaani.htm', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)

p145_raw = parts[144]
print('=== RAW P145 ===')
print(p145_raw[:800])

# Let's test a clean parser for a page:
def process_balaga_page(raw_html, page_num):
    # Extract matn items: <span class=rfdBold2>(...)</span>
    matn_items = re.findall(r'<span\s+class=rfdBold2>(.*?)</span>', raw_html, re.DOTALL)
    clean_matn = []
    for m in matn_items:
        c = re.sub(r'<[^>]+>', '', m).strip()
        if c:
            clean_matn.append(c)

    # Clean HTML for display:
    # 1. Replace <span class=rfdBold2>(...)</span> with <span class="matn-phrase">(...)</span>
    display_html = re.sub(
        r'<span\s+class=rfdBold2>(.*?)</span>',
        r'<span class="matn-phrase">\1</span>',
        raw_html,
        flags=re.DOTALL
    )
    # 2. Replace <span class=rfdAie>(...)</span> with <span class="quran-ayah">\1</span>
    display_html = re.sub(
        r'<span\s+class=rfdAie>(.*?)</span>',
        r'<span class="quran-ayah">\1</span>',
        display_html,
        flags=re.DOTALL
    )
    # 3. Replace <p class=rfdPoem>(...)</p> with <div class="arabic-poem">\1</div>
    display_html = re.sub(
        r'<p\s+class=rfdPoem>(.*?)</p>',
        r'<div class="arabic-poem">\1</div>',
        display_html,
        flags=re.DOTALL
    )
    # 4. Replace <p class=Heading1Center>(...)</p> with <h3 class="section-heading">\1</h3>
    display_html = re.sub(
        r'<p\s+class=Heading1Center>(.*?)</p>',
        r'<h3 class="section-heading">\1</h3>',
        display_html,
        flags=re.DOTALL
    )

    # Clean up excess whitespace/newlines
    display_html = re.sub(r'\n+', '\n', display_html).strip()

    # Plain text version
    clean_text = re.sub(r'<[^>]+>', ' ', raw_html)
    clean_text = re.sub(r'[ \t]+', ' ', clean_text)
    clean_text = re.sub(r'\n\s*\n+', '\n\n', clean_text).strip()

    return {
        "page": page_num,
        "displayHtml": display_html,
        "cleanText": clean_text,
        "matnList": clean_matn,
        "matnText": ' '.join(clean_matn)
    }

res = process_balaga_page(p145_raw, 145)
print('\n=== CLEAN TEXT P145 ===')
print(res['cleanText'][:400])
print('\n=== MATN P145 ===')
print(res['matnText'][:300])
