const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_materials';

async function checkFiles() {
  try {
    const conn = await mongoose.createConnection(mongoURI).asPromise();
    const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    const files = await gridfsBucket.find().toArray();
    console.log(`Found ${files.length} files in GridFS`);
    
    files.forEach(f => {
      console.log(`- File: ${f.filename} | ContentType: ${f.contentType} | Metadata: ${JSON.stringify(f.metadata)}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkFiles();
