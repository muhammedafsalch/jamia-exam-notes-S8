import os

for yr in ['2025', '2024', '2023']:
    src = f'd:/jjc/aqeedah_paper_{yr}.html'
    dst = f'd:/jjc/papers/adeeqah/paper_{yr}.html'
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('href="css/style.css"', 'href="../../css/style.css"')
    content = content.replace('href="aqeedah_index.html"', 'href="../../aqeedah_index.html"')
    content = content.replace('href="papers/adeeqah/index.html"', 'href="index.html"')
    content = content.replace('href="aqeedah_paper_', 'href="paper_')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote {dst}')

print('Subfolder paper HTML files generated successfully!')
