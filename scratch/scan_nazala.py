import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r"d:\jjc\thafseer\data.js", "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r"const\s+TAFSEER_DATA\s*=\s*(\[.*?\])\s*;?\s*$", content, re.DOTALL)
surahs = json.loads(m.group(1))

print(f"Total surahs: {len(surahs)}")

# 1. Check existing asbabAlNuzul fields
existing_asbab_count = 0
for s in surahs:
    asbab = s.get("asbabAlNuzul", [])
    if asbab:
        existing_asbab_count += len(asbab)
        print(f"Surah {s['surahNumber']} ({s['surahNameArabic']}): has {len(asbab)} asbab items")

print(f"Total existing asbabAlNuzul items: {existing_asbab_count}")

# 2. Search for all occurrences of 'نزل' / 'نزلت' / 'أنزل' in jalalayn commentary across all ayahs
found_instances = []
for s in surahs:
    for a in s.get("ayahs", []):
        jalal = a.get("jalalayn", "")
        # Look for forms of nazala/anzala/nuzzilat
        # e.g. "نزلت", "نزل", "أنزل", "نزلت في", "نزل في", "نزل لما", "نزلت لما"
        patterns = [r"نَزَلَتْ", r"نَزَلَ", r"نَزَلَت", r"نَزَل", r"نُزِلَت", r"أُنْزِلَت", r"أنزلت", r"أنزل"]
        matches = []
        for pat in patterns:
            if re.search(pat, jalal):
                matches.append(pat)
        if matches:
            found_instances.append({
                "surahNumber": s["surahNumber"],
                "surahName": s["surahNameArabic"],
                "ayahNumber": a["ayahNumber"],
                "quran": a.get("quranText", "").strip(),
                "jalalayn": jalal.strip(),
                "malayalam": a.get("malayalam", "").strip()
            })

print(f"\nTotal ayahs mentioning 'نزل' or 'أنزل' in Jalalayn: {len(found_instances)}")
for item in found_instances[:15]:
    print(f"Surah {item['surahNumber']} Ayah {item['ayahNumber']}: {item['jalalayn'][:80]}...")
