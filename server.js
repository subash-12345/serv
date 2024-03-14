const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5004;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema for File model
const fileSchema = new mongoose.Schema({
  title: String,
  file: Buffer, // Store file content in binary format
  subtitle: String,
  review: String
});
const File = mongoose.model('File', fileSchema);

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage: storage });

// API endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, subtitle, review } = req.body;
    const fileBuffer = req.file.buffer;
    
    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('Review:', review);
    console.log('image:',fileBuffer)
    // Save file information to MongoDB
    const newFile = new File({
      title,
      file: fileBuffer,
      subtitle,
      review
    });
    await newFile.save();

    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file: ', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});