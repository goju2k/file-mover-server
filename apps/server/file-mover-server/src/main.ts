import { Request } from "express";

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_req:Request, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('file'), (req: { file: { filename: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { message: string; filename: any; }) => void; }) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
