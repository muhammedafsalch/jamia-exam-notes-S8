import glob
import sys

out_lines = []
for fpath in glob.glob('scratch/*USOOL*.txt') + glob.glob('scratch/*Usoolul*.txt'):
    out_lines.append(f"\n==========================================")
    out_lines.append(f"FILE: {fpath}")
    out_lines.append(f"==========================================")
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
        out_lines.extend(lines[:50])

with open('scratch/headers_summary.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(out_lines))

print("Saved scratch/headers_summary.txt successfully")
