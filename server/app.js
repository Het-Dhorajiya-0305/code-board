import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import User from './model/userModel.js';
import RoomModel from './model/roomModel.js';
import dotenv from 'dotenv';
import connectDB from './bd/db.js';

dotenv.config({ path: './.env' });
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on('join', async ({ roomId, username }) => {

    try {
      let user = await User.findOne({ socket_id: socket.id });
      if (!user) {
        user = await User.create({ userName: username, socket_id: socket.id });
      }

      let room = await RoomModel.findById(roomId);
      if (room) {
        if (!room.users.includes(user.socket_id)) {
          room.users.push(user.socket_id);
          await room.save();
        }
      } else {
        room = await RoomModel.create({ _id: roomId, users: [user.socket_id] });
      }

      user.currentRoom = room._id;
      await user.save();

      socket.join(roomId);


      if (room && room.code) {
        socket.emit('sync-code', { code: room.code,language: room.language });
      }

      const currentRoomUsers = await User.find({ currentRoom: roomId });

      // Notify everyone in the room
      io.to(roomId).emit('room-users', currentRoomUsers.map(u => ({
        username: u.userName,
        userId: u._id
      })));

      // Notify that someone joined
      socket.to(roomId).emit('user-joined', {
        username,
        userId: user._id,
      });

    } catch (err) {
      console.error('Join error:', err);
      socket.emit('join-error', { message: 'Failed to join room' });
    }
  });

  socket.on('code-change', async ({ roomId, code }) => {

    // ✅ Update in MongoDB
    try {
      const room = await RoomModel.findById(roomId);
      if (room) {
        room.code = code;
        await room.save();
      }
      socket.to(roomId).emit('code-changed', { code: room.code });
    } catch (err) {
      console.error('Failed to update code in DB:', err);
    }
  })

  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username });
  });

  socket.on('language-change', async ({ roomId, language,snippet }) => {
    io.to(roomId).emit('language-changed', { language });
    const updateRoom=await RoomModel.findByIdAndUpdate(roomId, { language: language,code:snippet }, { new: true });
  });
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOne({ socket_id: socket.id });
      if (user) {
        const roomId = user.currentRoom;

        // Remove user from room
        await RoomModel.updateOne(
          { _id: roomId },
          { $pull: { users: socket.id } }
        );

        // Remove user record
        await User.deleteOne({ socket_id: socket.id });

        const updatedUsers = await User.find({ currentRoom: roomId });

        io.to(roomId).emit('room-users', updatedUsers.map(u => ({
          username: u.userName,
          userId: u._id
        })));

        socket.to(roomId).emit('user-left', {
          username: user.userName,
          userId: user._id
        });

        console.log(`🔴 User ${user.userName} disconnected from room ${roomId}`);
        socket.leave(roomId);
        const updatedRoom = await RoomModel.findById(roomId);
        if (updatedRoom && updatedRoom.users.length === 0) {
          await RoomModel.deleteOne({ _id: roomId });
          console.log(`🗑️ Room ${roomId} deleted because it's empty`);
        }

      } else {
        console.log(`🔴 Unknown user disconnected: ${socket.id}`);
      }

    } catch (err) {
      console.error('Disconnect error:', err);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Code Collaboration Backend Running 🚀');
});

app.get('/delete-all-rooms', async (req, res) => {
  try {
    await RoomModel.deleteMany({});
    res.status(200).json({ message: 'All rooms deleted successfully' });
  } catch (err) {
    console.error('Error deleting rooms:', err);
    res.status(500).json({ message: 'Failed to delete rooms' });
  }
});

app.get('/delete-all-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });    
  } catch (err) {
    console.error('Error deleting users:', err);
    res.status(500).json({ message: 'Failed to delete users' });
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Server is running on port", process.env.PORT);
});

export default app;
