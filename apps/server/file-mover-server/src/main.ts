import { Request } from "express";
import { MoveConsumer } from "./worker/move-consumer";

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const consumer = new MoveConsumer();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_req:Request, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create WebSocket Server
const wss = new WebSocketServer({ port: 5001 }); // WebSocket server on port 5001
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

// Function to broadcast messages to all clients
const broadcast = (message:Object) => {
  clients.forEach((client) => {
      if (client.readyState === 1) {
          client.send(JSON.stringify(message));
      }
  });
};

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const userName = req.body?.username || 'noname'
    consumer.addItem({
      fileName: req.file.filename,
      userName,
    },
    (item)=>{
      const uploadedFile = {
        message: "File Move Request",
        filename: item.fileName,
        timestamp: Date.now(),
        username: item.userName,
        seq: item.seq,
    };
      broadcast(uploadedFile);
    },);

    return res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
