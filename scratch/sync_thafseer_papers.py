import re

def sync_paper(src_file, dest_file):
    with open(src_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace css link
    content = content.replace('href="css/style.css"', 'href="../../css/style.css"')
    # Replace js link
    content = content.replace('src="js/main.js"', 'src="../../js/main.js"')
    # Replace nav links to other subjects
    content = content.replace('href="index.html"', 'href="../../index.html"')
    content = content.replace('href="fiqh2_index.html"', 'href="../../fiqh2_index.html"')
    content = content.replace('href="hadees_index.html"', 'href="../../hadees_index.html"')
    content = content.replace('href="thafseer_index.html"', 'href="../../thafseer_index.html"')
    content = content.replace('href="papers/thafseer/index.html"', 'href="index.html"')

    # Replace year tab links
    content = content.replace('href="thafseer_paper_2025.html"', 'href="paper_2025.html"')
    content = content.replace('href="thafseer_paper_2024.html"', 'href="paper_2024.html"')
    content = content.replace('href="thafseer_paper_2023.html"', 'href="paper_2023.html"')

    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Synced {src_file} -> {dest_file}')

sync_paper('thafseer_paper_2025.html', 'papers/thafseer/paper_2025.html')
sync_paper('thafseer_paper_2024.html', 'papers/thafseer/paper_2024.html')
sync_paper('thafseer_paper_2023.html', 'papers/thafseer/paper_2023.html')
