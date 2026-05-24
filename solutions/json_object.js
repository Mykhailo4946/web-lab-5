const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-object') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        
        // Валідація: перевіряємо, чи існують поля і чи правильного вони типу
        if (typeof parsed.name !== 'string' || typeof parsed.age !== 'number') {
          res.statusCode = 422;
          return res.end('Invalid fields');
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          greeting: "Hello " + parsed.name,
          isAdult: parsed.age >= 18
        }));
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