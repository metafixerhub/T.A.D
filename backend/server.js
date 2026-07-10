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

// NOTE: Set MONGO_URI in .env file (e.g. MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/test)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_materials';

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
      timestamp: Date.now()
    },
    contentType: req.file.mimetype
  });

  uploadStream.end(req.file.buffer);

  uploadStream.on('finish', (file) => {
    res.json({ file: file });
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
    res.set('Content-Type', file.contentType);
    
    // Check query param for download vs inline
    if (req.query.download === 'true') {
      res.set('Content-Disposition', 'attachment; filename="' + (file.metadata?.originalName || file.filename) + '"');
    } else {
      res.set('Content-Disposition', 'inline; filename="' + (file.metadata?.originalName || file.filename) + '"');
    }
    
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ err: "Error downloading file" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
