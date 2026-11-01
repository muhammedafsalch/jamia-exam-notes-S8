import sys
sys.stdout.reconfigure(encoding='utf-8')
import re
import json
import os

HTM_PATH = r'd:\jjc\scratch\balaga_extracted\mukhtasar-almaani.htm'
OUTPUT_DIR = r'd:\jjc\balaga_text'

CHAPTER_DEFS = [
    {
        "id": "fasl_wasl",
        "titleAr": "البَابُ السَّابِعُ: الفَصْلُ وَالوَصْلُ",
        "titleMl": "അൽ-ബാബുസ്സാബിഅ്: അൽ-ഫസ്വ്‌ലു വൽ-വസ്വ്‌ല് (ബന്ധിപ്പിക്കലും വിച്ഛേദിക്കലും)",
        "startPage": 145,
        "endPage": 168
    },
    {
        "id": "eejaz_itnab",
        "titleAr": "البَابُ الثَّامِنُ: الإِيجَازُ وَالإِطْنَابُ وَالمُسَاوَاةُ",
        "titleMl": "അൽ-ബാബുഥാമിൻ: അൽ-ഈജാസ്, അൽ-ഇത്വ്‌നാബ്, അൽ-മുസാവത്",
        "startPage": 169,
        "endPage": 182
    },
    {
        "id": "ilmul_bayan",
        "titleAr": "الفَنُّ الثَّانِي: عِلْمُ البَيَانِ (المُقَدِّمَةُ وَالدَّلَالَاتُ)",
        "titleMl": "ഇൽമുൽ ബയാൻ: നിർവചനവും ദലാലത്തുകളും (അഖ്‌ലിയ്യ, വദ്ഇയ്യ)",
        "startPage": 183,
        "endPage": 188
    },
    {
        "id": "tashbeeh",
        "titleAr": "المَقْصِدُ الأَوَّلُ مِنْ عِلْمِ البَيَانِ: التَّشْبِيهُ",
        "titleMl": "അത്തശ്ബീഹ്: സാദൃശ്യപ്പെടുത്തലും ഘടകങ്ങളും (അർകാനുത്തശ്ബീഹ്, അഖ്സാം)",
        "startPage": 189,
        "endPage": 214
    },
    {
        "id": "haqiqa_majaz",
        "titleAr": "المَقْصِدُ الثَّانِي مِنْ عِلْمِ البَيَانِ: الحَقِيقَةُ وَالمَجَازُ",
        "titleMl": "അൽ-ഹഖീഖത്തു വൽ-മജാസ് (യഥാർത്ഥ പ്രയോഗവും അലങ്കാരിക പ്രയോഗവും)",
        "startPage": 215,
        "endPage": 220
    }
]

def get_chapter_for_page(page_num):
    for ch in CHAPTER_DEFS:
        if ch['startPage'] <= page_num <= ch['endPage']:
            return ch
    if page_num > 220:
        return CHAPTER_DEFS[-1]
    return CHAPTER_DEFS[0]

def clean_page_content(raw_html, page_num):
    # Extract matn items: <span class=rfdBold2>(...)</span>
    matn_matches = re.findall(r'<span\s+class=["\']?rfdBold2["\']?>(.*?)</span>', raw_html, re.DOTALL)
    clean_matn_items = []
    for m in matn_matches:
        c = re.sub(r'<[^>]+>', '', m).strip()
        if c:
            clean_matn_items.append(c)

    # Format HTML for rich display:
    # 1. Transform Matn spans
    formatted_html = re.sub(
        r'<span\s+class=["\']?rfdBold2["\']?>(.*?)</span>',
        r'<span class="matn-phrase">\1</span>',
        raw_html,
        flags=re.DOTALL
    )
    # 2. Transform Quran verses
    formatted_html = re.sub(
        r'<span\s+class=["\']?rfdAie["\']?>(.*?)</span>',
        r'<span class="quran-ayah">﴿ \1 ﴾</span>',
        formatted_html,
        flags=re.DOTALL
    )
    # 3. Transform Poem lines
    formatted_html = re.sub(
        r'<p\s+class=["\']?rfdPoem["\']?>(.*?)</p>',
        r'<div class="arabic-poem">\1</div>',
        formatted_html,
        flags=re.DOTALL
    )
    # 4. Transform Section Headings
    formatted_html = re.sub(
        r'<p\s+class=["\']?Heading1Center["\']?>(.*?)</p>',
        r'<h3 class="section-heading">\1</h3>',
        formatted_html,
        flags=re.DOTALL
    )
    # 5. Transform bold headings
    formatted_html = re.sub(
        r'<p\s+class=["\']?rfdBold1["\']?>(.*?)</p>',
        r'<h4 class="sub-heading">\1</h4>',
        formatted_html,
        flags=re.DOTALL
    )

    # Clean empty spans/tags
    formatted_html = formatted_html.replace('<span></span>', '')
    formatted_html = re.sub(r'\n+', '\n', formatted_html).strip()

    # Plain text version
    clean_text = re.sub(r'<[^>]+>', ' ', raw_html)
    clean_text = re.sub(r'[ \t]+', ' ', clean_text)
    clean_text = re.sub(r'\n\s*\n+', '\n\n', clean_text).strip()

    return {
        "page": page_num,
        "url": f"https://lib.rafed.net/m/?type=c_fbook&b_id=2556&page={page_num}",
        "formattedHtml": formatted_html,
        "cleanText": clean_text,
        "matnList": clean_matn_items,
        "matnText": ' • '.join(clean_matn_items)
    }

def main():
    print(f'Reading {HTM_PATH}...')
    with open(HTM_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()

    parts = re.split(r'<br\s+clear=all>', txt, flags=re.IGNORECASE)
    print(f'Total parts in book: {len(parts)}')

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    pages_data = []
    txt_lines = []

    txt_lines.append("=" * 80)
    txt_lines.append("مُخْتَصَرُ المَعَانِي فِي عِلْمِ البَلَاغَةِ")
    txt_lines.append("للإمام سعد الدين مسعود بن عمر التفتازاني (ت 792 هـ)")
    txt_lines.append("شرح تلخيص المفتاح للخطيب القزويني (ت 739 هـ)")
    txt_lines.append("المقرر الدراسي: من باب الفصل والوصل إلى الحقيقة والمجاز (ص 145 - ص 220)")
    txt_lines.append("المصدر المعتمد: lib.rafed.net (كتاب رقم 2556)")
    txt_lines.append("=" * 80)
    txt_lines.append("")

    current_chap_id = None

    # Extract pages 145 to 220 (parts 144 to 219)
    for p_num in range(145, 221):
        raw_part = parts[p_num - 1]
        page_obj = clean_page_content(raw_part, p_num)

        chap = get_chapter_for_page(p_num)
        page_obj['chapterId'] = chap['id']
        page_obj['chapterTitleAr'] = chap['titleAr']
        page_obj['chapterTitleMl'] = chap['titleMl']

        pages_data.append(page_obj)

        if chap['id'] != current_chap_id:
            current_chap_id = chap['id']
            txt_lines.append("\n" + "#" * 65)
            txt_lines.append(f"## {chap['titleAr']}")
            txt_lines.append(f"## {chap['titleMl']}")
            txt_lines.append(f"## (الصفحات: ص {chap['startPage']} - ص {chap['endPage']})")
            txt_lines.append("#" * 65 + "\n")

        txt_lines.append(f"--- [صفحة {p_num}] --- ({page_obj['url']})")
        txt_lines.append(page_obj['cleanText'])
        txt_lines.append("")

    print(f'Successfully processed {len(pages_data)} pages (P145 to P220).')

    # 1. Save TXT
    txt_path = os.path.join(OUTPUT_DIR, 'balaga_text.txt')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(txt_lines))
    print(f'Saved TXT: {txt_path} ({os.path.getsize(txt_path)} bytes)')

    # 2. Save JSON
    json_path = os.path.join(OUTPUT_DIR, 'balaga_data.json')
    data_obj = {
        "bookTitle": "مختصر المعاني",
        "authorSharh": "سعد الدين مسعود بن عمر التفتازاني (ت 792 هـ)",
        "authorMatn": "جلال الدين محمد بن عبد الرحمن الخطيب القزويني (ت 739 هـ)",
        "sourceUrl": "https://lib.rafed.net/m/?type=c_fbook&b_id=2556&page=145",
        "pageRange": "145-220",
        "totalPages": len(pages_data),
        "startPage": 145,
        "endPage": 220,
        "chapters": CHAPTER_DEFS,
        "pages": pages_data
    }
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data_obj, f, ensure_ascii=False, indent=2)
    print(f'Saved JSON: {json_path} ({os.path.getsize(json_path)} bytes)')

    # 3. Save JS for web reader
    js_path = os.path.join(OUTPUT_DIR, 'balaga_data.js')
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write("window.BALAGA_DATA = ")
        json.dump(data_obj, f, ensure_ascii=False)
        f.write(";\n")
    print(f'Saved JS: {js_path} ({os.path.getsize(js_path)} bytes)')

if __name__ == '__main__':
    main()
