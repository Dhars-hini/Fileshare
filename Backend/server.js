const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up storage engine with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes

// Upload file
app.post('/files', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ 
      id: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      filename: req.file.filename
    });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// List files
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error listing files' });
    }
    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join('uploads', filename));
      return {
        id: filename,
        originalname: filename.split('-').slice(1).join('-'),
        size: stats.size,
        filename: filename,
      };
    });
    res.json(fileList);
  });
});

// Download file
app.get('/files/download/:id', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.id);
  res.download(filePath, err => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Delete file
app.delete('/files/:id', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.id);
  fs.unlink(filePath, err => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
