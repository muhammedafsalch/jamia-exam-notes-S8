import pypdfium2 as pdfium

pdf = pdfium.PdfDocument(r"d:\jjc\papers\thafseer\S 6 Thafseer LGL 2 Side.pdf")
print("Pages:", len(pdf))

for i, page in enumerate(pdf):
    # Try textpage
    textpage = page.get_textpage()
    text = textpage.get_text_range()
    print(f"Page {i+1} text length: {len(text)}")
    if text.strip():
        print(f"Page {i+1} sample text:\n", text[:400])
        with open(f"d:\\jjc\\scratch\\s6_page_{i+1}_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
    
    # Also render image
    bitmap = page.render(scale=2.0)
    pil_image = bitmap.to_pil()
    pil_image.save(f"d:\\jjc\\scratch\\s6_page_{i+1}.png")
    print(f"Saved d:\\jjc\\scratch\\s6_page_{i+1}.png")
