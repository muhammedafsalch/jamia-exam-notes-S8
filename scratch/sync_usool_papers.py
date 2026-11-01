import os

years = ['2025', '2024', '2023']
for year in years:
    src = f'd:/jjc/usool_paper_{year}.html'
    dest = f'd:/jjc/papers/usoolul fiqh/paper_{year}.html'
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('href="css/style.css"', 'href="../../css/style.css"')
    content = content.replace('href="usool_index.html"', 'href="../../usool_index.html"')
    content = content.replace('href="index.html"', 'href="../../index.html"')
    content = content.replace('href="fiqh2_index.html"', 'href="../../fiqh2_index.html"')
    content = content.replace('href="hadees_index.html"', 'href="../../hadees_index.html"')
    content = content.replace('href="thafseer_index.html"', 'href="../../thafseer_index.html"')
    content = content.replace('href="handasa_index.html"', 'href="../../handasa_index.html"')
    content = content.replace('href="papers/usoolul fiqh/index.html"', 'href="index.html"')
    content = content.replace('href="usool_paper_2025.html"', 'href="paper_2025.html"')
    content = content.replace('href="usool_paper_2024.html"', 'href="paper_2024.html"')
    content = content.replace('href="usool_paper_2023.html"', 'href="paper_2023.html"')
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Synced {dest}')
print('Usool papers synced successfully!')
