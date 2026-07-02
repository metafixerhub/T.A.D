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

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            title: req.body.title || file.originalname,
            originalName: file.originalname,
            size: req.headers['content-length'],
            timestamp: Date.now()
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.get('/api/materials', (req, res) => {
  if (!gfs) return res.status(500).send("GridFS not initialized");
  
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json([]);
    }
    
    files.sort((a, b) => b.metadata?.timestamp - a.metadata?.timestamp);
    return res.json(files);
  });
});

app.get('/api/materials/download/:filename', (req, res) => {
  if (!gfs) return res.status(500).send("GridFS not initialized");

  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', 'attachment; filename="' + (file.metadata?.originalName || file.filename) + '"');
    
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
