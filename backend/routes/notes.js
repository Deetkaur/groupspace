const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const Group = require('../models/Group');

const checkGroupMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ msg: 'Not a member' });
    }
    req.group = group;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET all notes
router.get('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const notes = await Note.find({ group: req.params.groupId })
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST create note
router.post('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = new Note({
      title,
      content,
      color: color || '#F5EDE4',
      group: req.params.groupId,
      createdBy: req.userId
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT update note
router.put('/:groupId/:noteId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (title) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE note
router.delete('/:groupId/:noteId', auth, checkGroupMember, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;