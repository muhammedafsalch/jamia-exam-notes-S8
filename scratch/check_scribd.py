import re

with open('scratch/embed_content.html', 'r', encoding='utf-8') as f:
    text = f.read()

images = re.findall(r'4ulr3ijby88w1uhk/images/([a-zA-Z0-9_\-\.]+)', text)
unique_images = sorted(list(set(images)))
print('Total unique images found in embed:', len(unique_images))
print('Unique images sample:')
for img in unique_images[:30]:
    print(' ', img)

# Also let's check for page divs or page numbers
page_divs = re.findall(r'id=[\'"]outer_page_(\d+)[\'"]', text)
print('Page divs found:', len(page_divs))
if page_divs:
    print('Range:', min(map(int, page_divs)), 'to', max(map(int, page_divs)))

# Check script tags or JSON data
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
print('Script tags count:', len(scripts))
for idx, s in enumerate(scripts):
    if 'pages' in s or 'images' in s or '4ulr3' in s:
        print(f'Script {idx} length: {len(s)}')
        lines = [line.strip() for line in s.split('\n') if any(k in line for k in ['4ulr3', 'image', 'page', 'docJson', 'view'])]
        for l in lines[:15]:
            print('   ', l[:120])
