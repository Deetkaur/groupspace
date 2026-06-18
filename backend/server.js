const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/events', require('./routes/events'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 GroupSpace API is running!' });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a group room
  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group room: ${groupId}`);
  });

  // Leave a group room
  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));