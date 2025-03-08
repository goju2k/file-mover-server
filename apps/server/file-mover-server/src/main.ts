import { Request } from "express";
import { MoveConsumer } from "./worker/move-consumer";

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';

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

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const userName = req.body?.username || 'noname'
    consumer.addItem({
      fileName: req.file.filename,
      userName
    });

    return res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
