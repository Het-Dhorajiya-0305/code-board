import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import User from './model/userModel.js';
import RoomModel from './model/roomModel.js';
import dotenv from 'dotenv';
import connectDB from './bd/db.js';
import { getusers } from './controller/usercontroller.js';

dotenv.config({ path: './.env' });
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
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

app.post('/getusers', getusers);

server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Server is running on port", process.env.PORT);
});

export default app;
