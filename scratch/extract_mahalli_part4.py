import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import re
import json
import os

PDF_PATH = r'd:\jjc\mahalli notes\mahalli.pdf'
OUTPUT_DIR = r'd:\jjc\mahalli notes'

CHAPTER_DEFS = [
    {
        "id": "rajah",
        "titleAr": "كِتَابُ الرَّجْعَةِ",
        "titleMl": "കിതാബുർറജ്അഃ (മടക്കിയെടുക്കൽ)",
        "startPage": 418,
        "endPage": 421
    },
    {
        "id": "ila",
        "titleAr": "كِتَابُ الْإِيلَاءِ",
        "titleMl": "കിതാബുൽ ഈലാഅ് (ലൈംഗിക ബന്ധം ഉപേക്ഷിക്കുമെന്ന ശപഥം)",
        "startPage": 421,
        "endPage": 424
    },
    {
        "id": "dhihar",
        "titleAr": "كِتَابُ الظِّهَارِ وَالْكَفَّارَةِ",
        "titleMl": "കിതാബുള്ളിഹാർ & കഫാറത്ത് (ഭാര്യയെ മാതാവിനോട് സാദൃശ്യപ്പെടുത്തൽ)",
        "startPage": 424,
        "endPage": 430
    },
    {
        "id": "lian",
        "titleAr": "كِتَابُ اللِّعَانِ",
        "titleMl": "കിതാബുല്ലിആൻ (വ്യഭിചാരാരോപണവും ശപഥവും)",
        "startPage": 430,
        "endPage": 436
    },
    {
        "id": "iddah",
        "titleAr": "كِتَابُ الْعِدَدِ وَالِاسْتِبْرَاءِ",
        "titleMl": "കിതാബുൽ ഇദ്ദഃ വൽ ഇസ്തിബ്‌റാഅ് (കാത്തിരിപ്പ് കാലാവധി)",
        "startPage": 436,
        "endPage": 448
    },
    {
        "id": "rida",
        "titleAr": "كِتَابُ الرَّضَاعِ",
        "titleMl": "കിതാബുർറദാഅ് (മുലകുടി ബന്ധവും നിയമങ്ങളും)",
        "startPage": 448,
        "endPage": 452
    },
    {
        "id": "nafaqat",
        "titleAr": "كِتَابُ النَّفَقَاتِ وَالْحَضَانَةِ",
        "titleMl": "കിതാബുന്നുഫഖാത് വൽ ഹദാനഃ (ചെലവ് നൽകലും സംരക്ഷണവും)",
        "startPage": 452,
        "endPage": 462
    }
]

def clean_arabic_text(raw_text):
    lines = raw_text.split('\n')
    cleaned_lines = []
    for l in lines:
        l = l.strip()
        if not l:
            continue
        # Skip Shamela headers/footers
        if 'الجزء الرابع-شرح المحلي على المنهاج' in l:
            continue
        if 'Shamela.org' in l:
            continue
        # Remove volume / page numbers like 4 with harakat: '٤ِ', '٤َ', '٤ُّ', '418', etc.
        if re.match(r'^[\d\u0660-\u0669\u064B-\u065F\u0670\s\.\-_]+$', l):
            continue
        cleaned_lines.append(l)
    text = ' '.join(cleaned_lines)
    
    # Normalize weird characters (like weird Allah ligature character)
    text = text.replace('\u19e6', '')
    text = text.replace('الل᧦ّٰه', 'اللَّه')
    
    # Detached harakah fix: ([^\s])\s+([\u064B-\u065F\u0670]+) -> \1\2 
    text = re.sub(r'([^\s])\s+([\u064B-\u065F\u0670]+)', r'\1\2 ', text)
    
    # Fix multiple spaces
    text = re.sub(r'[ ]+', ' ', text)
    
    # Fix reversed parentheses: )text( -> (text)
    text = re.sub(r'\)\s*([^\(\)]+?)\s*\(', r'(\1)', text)

    # Clean initial isolated harakat that might have remained at page start
    text = re.sub(r'^[\u064B-\u065F\u0670\s]+', '', text)
    
    return text.strip()

def get_chapter_for_page(page_num):
    for ch in CHAPTER_DEFS:
        if ch['startPage'] <= page_num <= ch['endPage']:
            return ch
    return CHAPTER_DEFS[-1]

def main():
    print(f'Opening {PDF_PATH}...')
    doc = pymupdf.open(PDF_PATH)
    
    pages_data = []
    full_text_lines = []
    
    full_text_lines.append("=" * 80)
    full_text_lines.append("كَنْزُ الرَّاغِبِينَ شَرْحُ مِنْهَاجِ الطَّالِبِينَ (شرح المحلي - الجزء الرابع)")
    full_text_lines.append("المقرر الدراسي: من كتاب الرجعة إلى نهاية كتاب النفقات والحضانة")
    full_text_lines.append("المتن للإمام النووي (بين قوسين) والشرح للإمام جلال الدين المحلي")
    full_text_lines.append("=" * 80)
    full_text_lines.append("")
    
    current_chap_id = None
    
    for p_idx in range(417, 462):
        page_num = p_idx + 1
        raw = doc[p_idx].get_text()
        
        # Boundary trims for page 418 and page 462
        if page_num == 418:
            idx_start = raw.find('كتاب الرجعة')
            if idx_start != -1:
                raw = raw[idx_start:]
        elif page_num == 462:
            idx_end = raw.find('كتاب الجراح')
            if idx_end != -1:
                raw = raw[:idx_end]
        
        cleaned = clean_arabic_text(raw)
        
        # Extract Shamela original page number if present (>ص: XX<)
        shamela_pages = re.findall(r'>ص:\s*([٠-٩\d]+)<', cleaned)
        
        # Clean out the raw >ص: XX< markers from display text or format them
        # Let's replace >ص: XX< with a clean note [ص: XX]
        cleaned_display = re.sub(r'>ص:\s*([٠-٩\d]+)<', r' [ص: \1] ', cleaned)
        cleaned_display = re.sub(r'[ ]+', ' ', cleaned_display).strip()
        
        # Extract matn phrases
        matn_matches = re.findall(r'\(([^\)]+)\)', cleaned_display)
        matn_clean_list = [m.strip() for m in matn_matches if len(m.strip()) > 1]
        matn_text = ' • '.join(matn_clean_list)
        
        chap = get_chapter_for_page(page_num)
        
        # If chapter changes, add banner to txt
        if chap['id'] != current_chap_id:
            current_chap_id = chap['id']
            full_text_lines.append("\n" + "#" * 60)
            full_text_lines.append(f"## {chap['titleAr']} - {chap['titleMl']}")
            full_text_lines.append(f"## (صفحات الكتاب: {chap['startPage']} - {chap['endPage']})")
            full_text_lines.append("#" * 60 + "\n")
        
        full_text_lines.append(f"--- [صفحة {page_num} | الشاملة ج 4] ---")
        full_text_lines.append(cleaned_display)
        full_text_lines.append("")
        
        pages_data.append({
            "page": page_num,
            "chapterId": chap['id'],
            "chapterTitleAr": chap['titleAr'],
            "chapterTitleMl": chap['titleMl'],
            "shamelaPages": shamela_pages,
            "combinedSharhMatn": cleaned_display,
            "matn": matn_text,
            "matnList": matn_clean_list
        })
    
    print(f'Successfully processed {len(pages_data)} pages (P418 to P462).')
    
    # 1. Save TXT
    txt_path = os.path.join(OUTPUT_DIR, 'mahalli_part4_text.txt')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(full_text_lines))
    print(f'Saved TXT: {txt_path} ({os.path.getsize(txt_path)} bytes)')
    
    # 2. Save JSON
    json_path = os.path.join(OUTPUT_DIR, 'mahalli_part4_text.json')
    data_obj = {
        "title": "كنز الراغبين شرح منهاج الطالبين (الجزء الرابع)",
        "subtitle": "من كتاب الرجعة إلى نهاية كتاب النفقات والحضانة",
        "authorMatn": "الإمام يحيى بن شرف النووي الشافعي (ت 676 هـ)",
        "authorSharh": "الإمام جلال الدين محمد بن أحمد المحلي الشافعي (ت 864 هـ)",
        "pageCount": len(pages_data),
        "startPage": 418,
        "endPage": 462,
        "chapters": CHAPTER_DEFS,
        "pages": pages_data
    }
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data_obj, f, ensure_ascii=False, indent=2)
    print(f'Saved JSON: {json_path} ({os.path.getsize(json_path)} bytes)')
    
    # 3. Save JS for browser loading without CORS issues
    js_path = os.path.join(OUTPUT_DIR, 'mahalli_part4_data.js')
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write("window.MAHALLI_PART4_DATA = ")
        json.dump(data_obj, f, ensure_ascii=False)
        f.write(";\n")
    print(f'Saved JS: {js_path} ({os.path.getsize(js_path)} bytes)')

if __name__ == '__main__':
    main()
