import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: {
    type: String, // UUID from frontend
    required: true
  },
  users: [
    {
      type: String,
      required: true
    }
  ],
  code:{
    type: String,
    default: ''
  },
  language:{
    type: String,
    default: 'javascript'
  }
}, { _id: false });

const RoomModel = mongoose.model('Room', roomSchema);

export default RoomModel;
