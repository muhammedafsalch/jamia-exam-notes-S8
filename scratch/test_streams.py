import re
import zlib

with open(r'd:\jjc\papers\thafseer\S 6 Thafseer LGL 2 Side.pdf', 'rb') as f:
    content = f.read()

streams = re.findall(rb'stream[\r\n]+(.*?)[\r\n]+endstream', content, re.DOTALL)
print(f"Found {len(streams)} streams.")

extracted_texts = []
for idx, s in enumerate(streams):
    # Try raw decompression
    try:
        decomp = zlib.decompress(s)
        # Check if contains text operator like BT ... ET or readable text
        if b'BT' in decomp and b'ET' in decomp:
            print(f"Stream {idx}: contains text! Length {len(decomp)}")
            # Try to decode or find text
            extracted_texts.append(decomp)
        elif b'Tj' in decomp or b'TJ' in decomp:
            print(f"Stream {idx}: contains Tj/TJ! Length {len(decomp)}")
            extracted_texts.append(decomp)
    except Exception as e:
        # maybe it has extra bytes or deflate with -15
        try:
            decomp = zlib.decompress(s, -15)
            if b'BT' in decomp:
                print(f"Stream {idx} (-15): contains text!")
                extracted_texts.append(decomp)
        except:
            pass

print(f"Found {len(extracted_texts)} text streams.")
with open(r'd:\jjc\scratch\raw_text_streams.txt', 'wb') as f:
    for t in extracted_texts:
        f.write(b"\n--- STREAM ---\n" + t + b"\n")

print("Saved raw text streams.")
