import os

years = ['2025', '2024', '2023']
for year in years:
    src = f'd:/jjc/fiqh2_paper_{year}.html'
    dest = f'd:/jjc/papers/fiqh-2/paper_{year}.html'
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('href="css/style.css"', 'href="../../css/style.css"')
    content = content.replace('href="fiqh2_index.html"', 'href="../../fiqh2_index.html"')
    content = content.replace('href="index.html"', 'href="../../index.html"')
    content = content.replace('href="fiqh2_paper_2025.html"', 'href="paper_2025.html"')
    content = content.replace('href="fiqh2_paper_2024.html"', 'href="paper_2024.html"')
    content = content.replace('href="fiqh2_paper_2023.html"', 'href="paper_2023.html"')
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Synced {dest}')

# Also update papers/fiqh-2/index.html links to point to the local paper_2025.html etc.
hub_path = 'd:/jjc/papers/fiqh-2/index.html'
with open(hub_path, 'r', encoding='utf-8') as f:
    hub_content = f.read()
hub_content = hub_content.replace('href="../../fiqh2_paper_2025.html"', 'href="paper_2025.html"')
hub_content = hub_content.replace('href="../../fiqh2_paper_2024.html"', 'href="paper_2024.html"')
hub_content = hub_content.replace('href="../../fiqh2_paper_2023.html"', 'href="paper_2023.html"')
with open(hub_path, 'w', encoding='utf-8') as f:
    hub_content = f.write(hub_content)
print("Updated papers/fiqh-2/index.html")
