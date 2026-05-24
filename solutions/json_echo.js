const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-echo') {
    let body = '';

    // Збираємо дані частинами (чанками)
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Коли всі дані отримані
    req.on('end', () => {
      if (!body) {
        res.statusCode = 400;
        return res.end('Empty body');
      }

      try {
        const parsedBody = JSON.parse(body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(parsedBody));
      } catch (e) {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else {
    // Запобіжник від зависання терміналу
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, () => console.log(`Сервер на порту ${port}`));