const fs = require('fs');
const path = require('path');

const files = [
  { src: 'hadees_paper_2025.html', dest: 'papers/hadees/paper_2025.html' },
  { src: 'hadees_paper_2024.html', dest: 'papers/hadees/paper_2024.html' },
  { src: 'hadees_paper_2023.html', dest: 'papers/hadees/paper_2023.html' }
];

files.forEach(({ src, dest }) => {
  let content = fs.readFileSync(path.join('d:/jjc', src), 'utf8');
  content = content.replace(/href="css\/style\.css"/g, 'href="../../css/style.css"');
  content = content.replace(/href="hadees_index\.html"/g, 'href="../../hadees_index.html"');
  content = content.replace(/href="index\.html"/g, 'href="../../index.html"');
  content = content.replace(/href="fiqh2_index\.html"/g, 'href="../../fiqh2_index.html"');
  content = content.replace(/href="papers\/hadees\/index\.html"/g, 'href="index.html"');
  fs.writeFileSync(path.join('d:/jjc', dest), content, 'utf8');
  console.log(`Synced ${src} -> ${dest} (${fs.statSync(path.join('d:/jjc', dest)).size} bytes)`);
});
