const fs = require('fs');

const files = [
  'd:/jjc/papers/paper_2025.html',
  'd:/jjc/papers/paper_2024.html',
  'd:/jjc/papers/paper_2023.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace('href="css/style.css"', 'href="../css/style.css"');
  content = content.replace('href="index.html"', 'href="../index.html"');
  fs.writeFileSync(f, content, 'utf8');
});

console.log('Successfully adjusted relative paths in papers folder!');
