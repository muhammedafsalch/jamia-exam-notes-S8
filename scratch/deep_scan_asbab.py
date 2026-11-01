import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r"d:\jjc\thafseer\data.js", "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r"const\s+TAFSEER_DATA\s*=\s*(\[.*?\])\s*;?\s*$", content, re.DOTALL)
surahs = json.loads(m.group(1))

# Check all ayahs for keywords
keywords = ["نزلت", "نزل", "أنزل", "انزل", "أسباب النزول", "سبب نزول", "سبب النزول", "فيمن نزلت"]

results = []

for s in surahs:
    s_num = s["surahNumber"]
    s_name = s["surahNameArabic"]
    s_ml = s["surahNameMalayalam"]
    for a in s.get("ayahs", []):
        a_num = a["ayahNumber"]
        jalal = a.get("jalalayn", "")
        ml = a.get("malayalam", "")
        quran = a.get("quranText", "").strip()
        
        # Strip diacritics for search
        def strip_tashkeel(text):
            return re.sub(r'[\u064B-\u0652\u0670\u0640]', '', text)
        
        clean_jalal = strip_tashkeel(jalal)
        
        # Specific revelation patterns in Jalalayn
        patterns = [
            r'نزلت في',
            r'نزل في',
            r'نزل لما',
            r'نزلت لما',
            r'سبب نزول',
            r'سبب ذلك',
            r'فنزل',
            r'فنزلت',
            r'أنزلت في',
            r'انزلت في',
            r'نزلت بمكة',
            r'نزلت بالمدينة',
            r'نزلت حين',
            r'نزل حين',
            r'نزلت اعتراضا',
            r'نزلت ردا'
        ]
        
        matched_patterns = []
        for pat in patterns:
            if re.search(pat, clean_jalal):
                matched_patterns.append(pat)
                
        if matched_patterns:
            results.append({
                "surahNumber": s_num,
                "surahName": s_name,
                "surahMalayalam": s_ml,
                "ayahNumber": a_num,
                "quran": quran,
                "jalalayn": jalal.strip(),
                "malayalam": ml.strip(),
                "patterns": matched_patterns
            })

print(f"Total matching ayahs with revelation context: {len(results)}")
for r in results:
    print(f"Surah {r['surahNumber']} ({r['surahName']}) Ayah {r['ayahNumber']} [{', '.join(r['patterns'])}]")
    print(f"   Jalalayn snippet: {r['jalalayn'][:120]}...")
    print(f"   Malayalam: {r['malayalam'][:120]}...")
    print("-" * 60)
