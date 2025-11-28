// server.js

import express from 'express';
import path from 'path';
import { createServer } from 'http'; 
import { WebSocketServer } from 'ws'; 
import { PORT } from './config/constants.js';

const app = express();

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log("WebSocket client connected"); 
});

app.use(express.static('dist'));

app.use((req, res) => {
    res.sendFile(path.resolve("dist/index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
