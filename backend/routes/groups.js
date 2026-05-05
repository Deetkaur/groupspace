const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// Generate random invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST /api/groups/create — Create a new group
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = new Group({
      name,
      description,
      inviteCode: generateInviteCode(),
      admin: req.userId,
      members: [req.userId]
    });

    await group.save();

    // Add group to user's groups array
    await User.findByIdAndUpdate(req.userId, {
      $push: { groups: group._id }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/groups/join — Join a group using invite code
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ msg: 'Invalid invite code' });

    // Check if already a member
    if (group.members.includes(req.userId)) {
      return res.status(400).json({ msg: 'Already a member' });
    }

    // Add user to group
    group.members.push(req.userId);
    await group.save();

    // Add group to user's groups array
    await User.findByIdAndUpdate(req.userId, {
      $push: { groups: group._id }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/groups/mygroups — Get all groups for logged in user
router.get('/mygroups', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('groups');
    res.json(user.groups);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;