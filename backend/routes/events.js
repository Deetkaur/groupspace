const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Events');
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

// GET all events
router.get('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const events = await Event.find({ group: req.params.groupId })
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST create event
router.post('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, date, color } = req.body;
    const event = new Event({
      title,
      date,
      color: color || '#3D280D',
      group: req.params.groupId,
      createdBy: req.userId
    });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE event
router.delete('/:groupId/:eventId', auth, checkGroupMember, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;