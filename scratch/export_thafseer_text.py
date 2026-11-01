import os
import re
import json

os.makedirs(r"d:\jjc\thafseer_notes", exist_ok=True)
os.makedirs(r"d:\jjc\thafseer notes", exist_ok=True)

with open(r"d:\jjc\thafseer\data.js", "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r"const\s+TAFSEER_DATA\s*=\s*(\[.*?\])\s*;?\s*$", content, re.DOTALL)
if not m:
    raise ValueError("Could not parse TAFSEER_DATA from data.js")

surahs = json.loads(m.group(1))

# Write pure Arabic thafseer_text.txt
txt_lines = []
txt_lines.append("=" * 80)
txt_lines.append("تَفْسِيرُ الجَلَالَيْنِ")
txt_lines.append("للإمامين: جلال الدين محمد بن أحمد المحلي وجلال الدين عبد الرحمن السيوطي")
txt_lines.append("المقرر الدراسي: من سورة النجم (53) إلى سورة الإنسان (76) - 24 سورة")
txt_lines.append("النص العربي الكامل (القرآن الكريم وتفسير الجلالين)")
txt_lines.append("=" * 80)
txt_lines.append("")

for s in surahs:
    s_num = s.get("surahNumber")
    s_ar = s.get("surahNameArabic")
    ayahs = s.get("ayahs", [])
    
    txt_lines.append("#" * 70)
    txt_lines.append(f"## {s_ar} (سورة رقم {s_num}) - عدد آياتها {len(ayahs)}")
    txt_lines.append("#" * 70)
    txt_lines.append("")
    
    for a in ayahs:
        a_num = a.get("ayahNumber")
        quran = a.get("quranText", "").strip()
        jalal = a.get("jalalayn", "").strip()
        
        txt_lines.append(f"[{a_num}] ﴿ {quran} ﴾")
        txt_lines.append(f"تفسير الجلالين: {jalal}")
        txt_lines.append("")
        
    txt_lines.append("\n")

full_text = "\n".join(txt_lines)

with open(r"d:\jjc\thafseer_notes\thafseer_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

with open(r"d:\jjc\thafseer notes\thafseer_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

# Also update thafseer_data.js to make sure window.TAFSEER_DATA is available
with open(r"d:\jjc\thafseer_notes\thafseer_data.js", "w", encoding="utf-8") as f:
    f.write("window.TAFSEER_DATA = " + json.dumps(surahs, ensure_ascii=False) + ";\n")

with open(r"d:\jjc\thafseer notes\thafseer_data.js", "w", encoding="utf-8") as f:
    f.write("window.TAFSEER_DATA = " + json.dumps(surahs, ensure_ascii=False) + ";\n")

print("Export completed: pure Arabic thafseer_text.txt generated!")
print(f"File size: {len(full_text.encode('utf-8')) / 1024:.1f} KB")
