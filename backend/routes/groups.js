const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST - Create group
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const user = await User.findById(req.userId);

    const group = new Group({
      name,
      description,
      color: color || '#4f46e5',
      inviteCode: generateInviteCode(),
      admin: req.userId,
      members: [req.userId],
      activity: [{ text: `${user.name} created the group` }]
    });

    await group.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { groups: group._id }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST - Join group
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const user = await User.findById(req.userId);

    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ msg: 'Invalid invite code' });

    if (group.members.includes(req.userId)) {
      return res.status(400).json({ msg: 'Already a member' });
    }

    group.members.push(req.userId);
    group.activity.push({ text: `${user.name} joined the group` });
    await group.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { groups: group._id }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET - My groups
router.get('/mygroups', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('groups');
    res.json(user.groups);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET - Single group details
router.get('/:groupId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members', 'name email')
      .populate('admin', 'name email');
    if (!group) return res.status(404).json({ msg: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;