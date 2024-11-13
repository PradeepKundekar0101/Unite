import { WebSocketServer } from 'ws';
import { User } from './services/User';
import { createServer } from 'http';

const server = createServer();

const wss = new WebSocketServer({ 
  server,
  path: '/ws-connect' 
});

wss.on('connection', function connection(ws, req) {
  try {
    console.log('New connection added from:', req.socket.remoteAddress);
    let user = new User(ws);
    user.initHandlers();
  } catch (error) {
    console.log("Failed to initialize user:", error);
    ws.close();
  }
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});


server.listen(8001, () => {
  console.log('WebSocket server is running on port 8001');
});


server.on('error', (err) => {
  console.error('HTTP server error:', err);
});


server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end();
  }
});