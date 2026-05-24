const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-nested') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        
        // Глибока валідація вкладених полів
        if (
          !parsed || 
          typeof parsed !== 'object' || 
          !parsed.user || 
          typeof parsed.user !== 'object' ||
          typeof parsed.user.name !== 'string' ||
          !Array.isArray(parsed.user.roles)
        ) {
          res.statusCode = 422;
          return res.end('Invalid nested structure');
        }

        const name = parsed.user.name;
        const roleCount = parsed.user.roles.length;
        const isAdmin = parsed.user.roles.includes('admin');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ name, roleCount, isAdmin }));
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