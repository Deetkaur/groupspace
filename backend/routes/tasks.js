const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Group = require('../models/Group');

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

// POST - Create task
router.post('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: 'todo',
      group: req.params.groupId,
      assignedTo: assignedTo || null,
      createdBy: req.userId
    });
    await task.save();

    // Emit real-time event to all group members
    const io = req.app.get('io');
    io.to(req.params.groupId).emit('task_added', task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT - Update task status
router.put('/:groupId/:taskId', auth, checkGroupMember, async (req, res) => {
  try {
    const { status, completed } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (status) task.status = status;
    if (typeof completed === 'boolean') task.completed = completed;

    await task.save();

    // Emit real-time event
    const io = req.app.get('io');
    io.to(req.params.groupId).emit('task_updated', task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE - Delete task
router.delete('/:groupId/:taskId', auth, checkGroupMember, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);

    // Emit real-time event
    const io = req.app.get('io');
    io.to(req.params.groupId).emit('task_deleted', req.params.taskId);

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET - Get all tasks
router.get('/:groupId', auth, checkGroupMember, async (req, res) => {
  try {
    const tasks = await Task.find({ group: req.params.groupId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;