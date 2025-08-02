const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const server = http.createServer(async (req, res) => {
  try {
    // Always serve love_letter.html for root path
    const filePath = req.url === '/' 
      ? path.join(__dirname, 'love_letter.html')
      : path.join(__dirname, req.url);

    // Security: Prevent directory traversal
    if (!filePath.startsWith(__dirname + path.sep)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    const data = await fs.readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    console.error(err);
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});