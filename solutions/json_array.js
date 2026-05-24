const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-array') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        
        // Перевіряємо, чи numbers - це масив, і чи всі його елементи є числами
        if (!Array.isArray(parsed.numbers) || !parsed.numbers.every(n => typeof n === 'number')) {
          res.statusCode = 422;
          return res.end('Invalid array');
        }

        const count = parsed.numbers.length;
        // Використовуємо reduce для підрахунку суми. Якщо масив порожній, reduce поверне 0
        const sum = parsed.numbers.reduce((acc, val) => acc + val, 0);
        const average = count === 0 ? 0 : sum / count;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ count, sum, average }));
      } catch (e) {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port);