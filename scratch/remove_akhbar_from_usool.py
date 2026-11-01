import json
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re
import os

JSON_PATH = r'd:\jjc\usool notes\mahalli_usool_part2_text.json'
JS_PATH = r'd:\jjc\usool notes\mahalli_part2_data.js'
TXT_PATH = r'd:\jjc\usool notes\mahalli_usool_part2_text.txt'

CHAPTERS = [
    { "id": "takhsis", "titleAr": "بَابُ التَّخْصِيصِ", "titleMl": "ബാബുത്തഖ്‌സ്വീസ്വ് (നിർവചനം, മുത്തസ്വിൽ, മുൻഫസ്വിൽ)", "startPage": 31, "endPage": 64 },
    { "id": "mutlaq", "titleAr": "الْمُطْلَقُ وَالْمُقَيَّدُ", "titleMl": "മുത്വ്‌ലഖും മുഖയ്യദും", "startPage": 65, "endPage": 75 },
    { "id": "mujmal", "titleAr": "الْمُجْمَلُ وَالْمُبَيَّنُ", "titleMl": "മുജ്‌മലും മുബയ്യനും", "startPage": 76, "endPage": 88 },
    { "id": "zahir", "titleAr": "الظَّاهِرُ وَالْمُؤَوَّلُ", "titleMl": "ളാഹിറും മുഅവ്വലും", "startPage": 89, "endPage": 95 },
    { "id": "naskh", "titleAr": "كِتَابُ النَّسْخِ", "titleMl": "കിതാബുന്നസ്ഖ്", "startPage": 96, "endPage": 127 },
    { "id": "sunnah", "titleAr": "الْكِتَابُ الثَّانِي فِي السُّنَّةِ", "titleMl": "കിതാബുസ്സുന്ന (അഫ്ആലുന്നബി ﷺ)", "startPage": 128, "endPage": 132 }
]

def main():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    original_count = len(data['pages'])
    # Keep only pages <= 132
    filtered_pages = [p for p in data['pages'] if p['page'] <= 132]

    # Clean the end of page 132
    for p in filtered_pages:
        if p['page'] == 132:
            txt = p['combinedSharhMatn']
            idx_akhbar = txt.find('(الْكَلَامُ فِي الْأَخْبَارِ)')
            if idx_akhbar != -1:
                p['combinedSharhMatn'] = txt[:idx_akhbar].strip()
            # Clean matn in page 132
            matn = p.get('matn', '')
            idx_m = matn.find('الْكَلَامُ فِي الْأَخْبَارِ')
            if idx_m != -1:
                p['matn'] = matn[:idx_m].strip()

    data['pages'] = filtered_pages
    data['totalPages'] = len(filtered_pages)
    data['pageRange'] = '31-132'

    # Save JSON
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Updated JSON: {len(filtered_pages)} pages (was {original_count}).')

    # Save JS
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write("window.MAHALLI_PART2_DATA = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")
    print(f'Updated JS: {JS_PATH}')

    # Save TXT
    txt_lines = []
    txt_lines.append("=" * 80)
    txt_lines.append("شَرْحُ جَمْعِ الْجَوَامِعِ لِلْمَحَلِّي (الجزء الثاني)")
    txt_lines.append("المقرر الدراسي: من باب التخصيص إلى نهاية الكتاب الثاني في السنة (أفعال النبي ﷺ)")
    txt_lines.append("الصفحات: ص 31 إلى ص 132")
    txt_lines.append("=" * 80)
    txt_lines.append("")

    current_chap_id = None
    for p in filtered_pages:
        num = p['page']
        # Find chapter
        chap = None
        for c in CHAPTERS:
            if c['startPage'] <= num <= c['endPage']:
                chap = c
                break
        if not chap:
            chap = CHAPTERS[-1]

        if chap['id'] != current_chap_id:
            current_chap_id = chap['id']
            txt_lines.append("\n" + "#" * 60)
            txt_lines.append(f"## {chap['titleAr']} - {chap['titleMl']}")
            txt_lines.append(f"## (صفحات: ص {chap['startPage']} - ص {chap['endPage']})")
            txt_lines.append("#" * 60 + "\n")

        txt_lines.append(f"--- [المجلد 2، صفحة {num}] --- ({p.get('url', '')})")
        txt_lines.append(p['combinedSharhMatn'])
        txt_lines.append("")

    with open(TXT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(txt_lines))
    print(f'Updated TXT: {TXT_PATH} ({os.path.getsize(TXT_PATH)} bytes)')

if __name__ == '__main__':
    main()
