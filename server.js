const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const server = http.createServer(async (req, res) => {
    try {
        // Map root request to index.html
        let filePath = req.url === '/' ? 'index.html' : req.url;
        filePath = path.join(__dirname, filePath);

        // Security check
        if (!filePath.startsWith(__dirname + path.sep)) {
            res.writeHead(403);
            return res.end('Forbidden');
        }

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/html';
        
        switch (ext) {
            case '.css': contentType = 'text/css'; break;
            case '.js': contentType = 'application/javascript'; break;
            case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
            case '.png': contentType = 'image/png'; break;
            case '.mp3': contentType = 'audio/mpeg'; break;
        }

        // Set cache control headers
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Type', contentType);

        // Read and serve file
        const data = await fs.readFile(filePath);
        res.writeHead(200);
        res.end(data);
    } catch (err) {
        console.error(`Error serving ${req.url}:`, err.message);
        if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});