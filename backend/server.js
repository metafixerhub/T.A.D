const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const dotenv = require('dotenv');
const crypto = require('crypto');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// NOTE: Set MONGO_URI in .env file
const mongoURI = process.env.MONGO_URI || 'mongodb://metafixerhub_db_user:qerZYLxCqH7rO4A7@ac-tvsmqbz-shard-00-00.ekb4cia.mongodb.net:27017,ac-tvsmqbz-shard-00-02.ekb4cia.mongodb.net:27017,ac-tvsmqbz-shard-00-01.ekb4cia.mongodb.net:27017/lms_materials?ssl=true&authSource=admin&replicaSet=atlas-ouxnej-shard-0';

const conn = mongoose.createConnection(mongoURI);

let gfs;
let gridfsBucket;

conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('MongoDB Connected & GridFS initialized');
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ err: 'No file uploaded' });
  }

  const filename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
  
  const uploadStream = gridfsBucket.openUploadStream(filename, {
    metadata: {
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      size: req.file.size,
      timestamp: Date.now(),
      contentType: req.file.mimetype
    }
  });

  uploadStream.end(req.file.buffer);

  uploadStream.on('finish', () => {
    res.json({ file: { filename: filename } });
  });

  uploadStream.on('error', (err) => {
    res.status(500).json({ err: 'Error uploading file' });
  });
});

app.get('/api/materials', async (req, res) => {
  if (!gridfsBucket) return res.status(500).send("GridFS not initialized");
  
  try {
    const files = await gridfsBucket.find().toArray();
    if (!files || files.length === 0) {
      return res.status(200).json([]);
    }
    
    files.sort((a, b) => b.metadata?.timestamp - a.metadata?.timestamp);
    return res.json(files);
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ err: "Error fetching materials" });
  }
});

app.get('/api/materials/download/:filename', async (req, res) => {
  if (!gridfsBucket) return res.status(500).send("GridFS not initialized");

  try {
    const files = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const file = files[0];
    let cType = file.metadata?.contentType || file.contentType;
    if (!cType) {
      const ext = file.filename.toLowerCase();
      if (ext.endsWith('.png')) cType = 'image/png';
      else if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) cType = 'image/jpeg';
      else if (ext.endsWith('.gif')) cType = 'image/gif';
      else if (ext.endsWith('.pdf')) cType = 'application/pdf';
      else cType = 'application/octet-stream';
    }
    
    res.set('Content-Type', cType);
    
    // Check query param for download vs inline
    if (req.query.download === 'true') {
      res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.metadata?.originalName || file.filename)}"`);
    } else {
      res.set('Content-Disposition', `inline; filename="${encodeURIComponent(file.metadata?.originalName || file.filename)}"`);
    }
    
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ err: "Error downloading file" });
  }
});

// Hallo G - AI Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  // Ensure this is set in your .env or Render Environment Variables!
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OpenRouter API Key is missing in backend configuration." });
  }

  const systemPrompt = {
    role: "system",
    content: "You are Hallo G, a personal coding teacher and learning assistant for AI Web Academy. Your goal is to teach web development, programming, and cybersecurity. Follow the cycle: LEARN -> EXPLAIN -> DEMONSTRATE -> PRACTICE -> CHECK -> IMPROVE. Provide simple definitions, easy explanations, real-life examples, technical explanations, and example code. Never just give away the answer; guide the student to understand it. Never make fun of beginner questions. Do not reveal secret keys or admin credentials. Keep responses formatted in clean Markdown."
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [systemPrompt, ...messages],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      return res.status(500).json({ error: "AI Provider Error", details: errorData });
    }

    const data = await response.json();
    res.json({
      message: data.choices[0].message.content
    });
  } catch (error) {
    console.error("Error communicating with AI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
