import glob

out = []
for f in sorted(glob.glob('scratch/*Handasa*.txt') + glob.glob('scratch/*handasa*.txt')):
    out.append(f"\n==========================================")
    out.append(f"FILE: {f}")
    out.append(f"==========================================")
    with open(f, 'r', encoding='utf-8') as fl:
        lines = [l.strip() for l in fl.readlines() if l.strip()]
        out.extend(lines[:45])

with open('scratch/handasa_summary.txt', 'w', encoding='utf-8') as fl_out:
    fl_out.write('\n'.join(out))

print("Saved scratch/handasa_summary.txt")
