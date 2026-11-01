import sys
import io
import re
import json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r"d:\jjc\thafseer\data.js", "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r"const\s+TAFSEER_DATA\s*=\s*(\[.*?\])\s*;?\s*$", content, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print(f"Total Surahs: {len(data)}")
    total_ayahs = 0
    for s in data:
        ayah_count = len(s.get("ayahs", []))
        total_ayahs += ayah_count
        has_summary = bool(s.get("topPoints") or s.get("topQuestions"))
        has_asbab = bool(s.get("asbabAlNuzul"))
        print(f"Surah {s.get('surahNumber')}: {s.get('surahNameArabic')} | {s.get('surahNameMalayalam')} | Ayahs: {ayah_count} | Summary: {has_summary} | Asbab: {has_asbab}")
    print(f"Total Ayahs across all Surahs: {total_ayahs}")
else:
    print("Could not match TAFSEER_DATA regex")
