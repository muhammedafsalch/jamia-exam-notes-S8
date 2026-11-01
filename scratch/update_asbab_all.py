import json
import re

# Load compile_asbab
from compile_asbab import asbab_master

# Update thafseer_notes/thafseer_data.js
for path in [
    r"d:\jjc\thafseer_notes\thafseer_data.js",
    r"d:\jjc\thafseer notes\thafseer_data.js",
    r"d:\jjc\thafseer\data.js"
]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # parse
    m = re.search(r"(?:const|window\.)TAFSEER_DATA\s*=\s*(\[.*?\])\s*;?\s*$", content, re.DOTALL)
    if not m:
        print(f"Skipping {path}, regex didn't match")
        continue
    
    data = json.loads(m.group(1))
    
    for s in data:
        s_num = s["surahNumber"]
        if s_num in asbab_master:
            s["asbabAlNuzul"] = asbab_master[s_num]
        else:
            s["asbabAlNuzul"] = []
            
    prefix = "window.TAFSEER_DATA = " if "thafseer_notes" in path or "thafseer notes" in path else "const TAFSEER_DATA = "
    with open(path, "w", encoding="utf-8") as f:
        f.write(prefix + json.dumps(data, ensure_ascii=False) + ";\n")
    print(f"Updated {path} successfully!")

# Also save standalone ASBAB_DATA in thafseer_notes/asbab_data.js
with open(r"d:\jjc\thafseer_notes\asbab_data.js", "w", encoding="utf-8") as f:
    f.write("window.ASBAB_DATA = " + json.dumps(asbab_master, ensure_ascii=False) + ";\n")

with open(r"d:\jjc\thafseer notes\asbab_data.js", "w", encoding="utf-8") as f:
    f.write("window.ASBAB_DATA = " + json.dumps(asbab_master, ensure_ascii=False) + ";\n")

print("Saved asbab_data.js successfully!")
