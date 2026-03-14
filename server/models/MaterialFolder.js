const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  filename: { type: String, required: true }, // stored name on disk
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const materialFolderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: [fileSchema]
}, { timestamps: true });

materialFolderSchema.index({ title: 1 });

module.exports = mongoose.model('MaterialFolder', materialFolderSchema);


