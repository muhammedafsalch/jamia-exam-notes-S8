import re

def clean_paper(fpath):
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    # Remove dots and excessive whitespace
    text = re.sub(r'\.{3,}', '', text)
    text = re.sub(r'_{3,}', '', text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    return '\n'.join(lines)

with open('scratch/paper_2025_raw.txt', 'w', encoding='utf-8') as out:
    out.write(clean_paper('scratch/S_8_and_HS_6__USOOLUL_FIQH_LGL_2_Side.pdf.txt'))

with open('scratch/paper_2024_raw.txt', 'w', encoding='utf-8') as out:
    out.write(clean_paper('scratch/S_8_Usoolul_fiqh_A4_2_Side.pdf.txt'))

with open('scratch/paper_2023_raw.txt', 'w', encoding='utf-8') as out:
    out.write(clean_paper('scratch/S_8_and_HS_6_Usoolul_Fiqh_LGL_2_Side_535_Copy.pdf.txt'))

print("Cleaned all 3 papers to raw txt files.")
