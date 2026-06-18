const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  color: { type: String, default: '#F5EDE4' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);