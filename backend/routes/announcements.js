const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const Group = require('../models/Group');

// Check group membership
const checkGroupMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });

    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ msg: 'Not a member of this group' });
    }

    req.group = group;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// POST - Create announcement
router.post('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, content } = req.body;

    const announcement = new Announcement({
      title,
      content,
      group: req.params.groupId,
      createdBy: req.userId
    });

    await announcement.save();

    // Emit real-time event
    const io = req.app.get('io');
    io.to(req.params.groupId).emit('announcement_added', announcement);

    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/announcements/:groupId — Get all announcements
router.get('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const announcements = await Announcement.find({ group: req.params.groupId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/announcements/:groupId/:announcementId — Delete announcement
router.delete('/:groupId/:announcementId', auth, checkGroupMember, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.announcementId);
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;