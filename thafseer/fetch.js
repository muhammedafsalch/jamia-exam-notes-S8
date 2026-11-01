const fs = require('fs');

async function fetchPages(bookId, offset, limit) {
  const url = 'https://api.thahabi.org/query';
  const payload = {
    operationName: "PAGES",
    variables: { bookId, offset, limit },
    query: "query PAGES($bookId: Int!, $offset: Int!, $limit: Int!) { Pages(bookId: $bookId, offset: $offset, limit: $limit) { number bookId content __typename } }"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function findSurah(startOffset) {
  const data = await fetchPages(1490, startOffset, 5);
  if (data && data.data && data.data.Pages) {
      console.log(`Offset ${startOffset}:`);
      data.data.Pages.forEach(p => console.log(p.content.substring(0, 100)));
  }
}

async function main() {
    await findSurah(4780);
    await findSurah(4790);
    await findSurah(4800);
}

main();
