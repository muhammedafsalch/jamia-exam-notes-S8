const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\3fb8a582-847c-49f5-8efc-83c80ba14e56\\.system_generated\\steps\\89\\content.md', 'utf8');
const idx = html.indexOf('/ar/34775/65882/5');
console.log('Snippet before page 5 link:');
console.log(html.substring(Math.max(0, idx - 600), idx));


