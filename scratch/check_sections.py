import re

with open('thafseer_paper_2024.html', 'r', encoding='utf-8') as f:
    text = f.read()

headers = re.findall(r'<div class="section-group-title-ar">(.*?)</div>\s*<div class="section-group-title-ml">(.*?)</div>\s*</div>\s*<span class="section-group-badge">(.*?)</span>', text)
for ar, ml, badge in headers:
    print(f'[{badge}] {ar} | {ml}')
