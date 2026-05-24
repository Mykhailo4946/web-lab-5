const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-calc') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        
        // Валідація наявності та типів даних (422)
        if (typeof parsed.a !== 'number' || typeof parsed.b !== 'number' || typeof parsed.operation !== 'string') {
          res.statusCode = 422;
          return res.end('Invalid data');
        }

        let result;
        
        // Виконуємо математику (switch)
        switch (parsed.operation) {
          case 'add':
            result = parsed.a + parsed.b;
            break;
          case 'subtract':
            result = parsed.a - parsed.b;
            break;
          case 'multiply':
            result = parsed.a * parsed.b;
            break;
          case 'divide':
            if (parsed.b === 0) {
              res.statusCode = 400; // Ділення на нуль
              return res.end('Division by zero');
            }
            result = parsed.a / parsed.b;
            break;
          default:
            res.statusCode = 400; // Невідома операція
            return res.end('Unknown operation');
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result }));
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