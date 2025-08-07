import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  socket_id: {
    type: String,
    required: true,
    unique: true
  },
  currentRoom: {
    type: String,
    ref: 'RoomModel',
    default: null
  }
});

const User = mongoose.model('User', userSchema);

export default User;
