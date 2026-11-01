import os
import pypdf

folder = r"d:\jjc\papers\thafseer"
output_file = r"d:\jjc\scratch\extracted_thafseer_papers.txt"

files = [
    "S 6 Thafseer LGL 2 Side.pdf",
    "S 8 & HS 6 Thafseer Thakassus A4 2 Side 130 Copy.pdf",
    "S 8 Thafseer LGL 2 Side.pdf"
]

with open(output_file, "w", encoding="utf-8") as out:
    for filename in files:
        filepath = os.path.join(folder, filename)
        out.write(f"\n\n{'='*60}\nFILE: {filename}\n{'='*60}\n")
        try:
            reader = pypdf.PdfReader(filepath)
            out.write(f"Total pages: {len(reader.pages)}\n\n")
            for i, page in enumerate(reader.pages):
                out.write(f"\n--- PAGE {i+1} ---\n\n")
                text = page.extract_text()
                out.write(text if text else "[No text extracted]\n")
        except Exception as e:
            out.write(f"Error reading {filename}: {e}\n")

print("Extraction complete. Check", output_file)
