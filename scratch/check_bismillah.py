import json
import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r"d:\jjc\thafseer_notes\thafseer_data.js", "r", encoding="utf-8") as f:
    raw = f.read()

json_str = raw.replace("window.TAFSEER_DATA = ", "").rstrip(";\n ")
data = json.loads(json_str)

for s in data:
    first_ayah = s['ayahs'][0]['quranText'].strip()
    has_bismillah = "بِسۡمِ" in first_ayah or "بسم" in first_ayah
    print(f"Surah {s['surahNumber']}: {s['surahNameArabic']} - Ayahs: {len(s['ayahs'])} - First Ayah starts with Bismillah: {has_bismillah}")
