const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Group = require('../models/Group');

// Middleware to check if user belongs to the group
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
    res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/tasks/:groupId — Create a task
router.post('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      group: req.params.groupId,
      assignedTo: assignedTo || null,
      createdBy: req.userId
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/tasks/:groupId — Get all tasks for a group
router.get('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const tasks = await Task.find({ group: req.params.groupId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/tasks/:groupId/:taskId — Mark task complete/incomplete
router.put('/:groupId/:taskId', auth, checkGroupMember, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/tasks/:groupId/:taskId — Delete a task
router.delete('/:groupId/:taskId', auth, checkGroupMember, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;