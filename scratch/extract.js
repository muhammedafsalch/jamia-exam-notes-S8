const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\3fb8a582-847c-49f5-8efc-83c80ba14e56\\.system_generated\\steps\\96\\content.md', 'utf8');

// Look for data- attributes or JSON scripts
const dataAttrs = html.match(/data-[a-zA-Z0-9\-_]+="[^"]*"/g);
console.log('Data attrs:', dataAttrs ? dataAttrs.slice(0, 30) : 'none');

const scriptSrcs = html.match(/src="[^"]*"/g);
console.log('Script srcs:', scriptSrcs);

