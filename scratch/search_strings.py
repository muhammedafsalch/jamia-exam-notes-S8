import re

with open(r'd:\jjc\papers\thafseer\S 6 Thafseer LGL 2 Side.pdf', 'rb') as f:
    data = f.read()

# Find all printable strings of length >= 4
ascii_strings = re.findall(b'[\x20-\x7E]{4,}', data)
print(f"Total ASCII strings >= 4: {len(ascii_strings)}")

with open(r'd:\jjc\scratch\s6_ascii_strings.txt', 'w', encoding='utf-8', errors='ignore') as out:
    for s in ascii_strings:
        out.write(s.decode('latin1') + '\n')

# Also search for utf-8 decoded arabic strings
arabic_pattern = re.compile(r'[\u0600-\u06FF\s]{4,}')
text_utf8 = data.decode('utf-8', errors='ignore')
arabic_strings = arabic_pattern.findall(text_utf8)
print(f"Total Arabic strings >= 4: {len(arabic_strings)}")

with open(r'd:\jjc\scratch\s6_arabic_strings.txt', 'w', encoding='utf-8') as out:
    for a in arabic_strings:
        if a.strip():
            out.write(a.strip() + '\n')

print("Saved s6_ascii_strings.txt and s6_arabic_strings.txt")
