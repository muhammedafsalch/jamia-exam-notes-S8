import json, re

data = json.load(open(r"d:\jjc\balaga_text\balaga_data.json", encoding="utf-8"))
classes = set()
for p in data["pages"]:
    for c in re.findall(r'class=["\']?([a-zA-Z0-9_\-]+)', p["formattedHtml"]):
        classes.add(c)
print("Classes:", sorted(list(classes)))
