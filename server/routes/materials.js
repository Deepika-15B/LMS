const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const MaterialFolder = require('../models/MaterialFolder');
const auth = require('../middleware/auth');

const router = express.Router();

// Storage config: /server/uploads/materials
const uploadDir = path.join(__dirname, '..', 'uploads', 'materials');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `material-${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PPT, PDF, Word, and Excel files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// Create a folder (admin/educator)
router.post('/folders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const folder = await MaterialFolder.create({ title, description, createdBy: req.user._id, files: [] });
    res.status(201).json(folder);
  } catch (err) {
    console.error('Create folder error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List folders (all roles)
router.get('/folders', auth, async (req, res) => {
  try {
    const folders = await MaterialFolder.find().sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    console.error('List folders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload files into a folder (admin/educator)
router.post('/folders/:id/files', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const folder = await MaterialFolder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filesToAdd = (req.files || []).map(f => ({
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      filename: f.filename,
      url: `${baseUrl}/uploads/materials/${f.filename}`,
      uploadedBy: req.user._id
    }));

    folder.files.push(...filesToAdd);
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    console.error('Upload files error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Delete a file from a folder (admin/educator)
router.delete('/folders/:folderId/files/:fileId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { folderId, fileId } = req.params;
    const folder = await MaterialFolder.findById(folderId);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    const file = folder.files.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Remove physical file
    const filepath = path.join(uploadDir, file.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    file.remove();
    await folder.save();
    res.json({ message: 'File deleted', folder });
  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a folder (admin/educator)
router.delete('/folders/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const folder = await MaterialFolder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    // Delete all files on disk
    for (const f of folder.files) {
      const filepath = path.join(uploadDir, f.filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    await MaterialFolder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    console.error('Delete folder error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


