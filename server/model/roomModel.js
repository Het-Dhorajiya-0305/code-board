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
  ]
}, { _id: false });

const RoomModel = mongoose.model('Room', roomSchema);

export default RoomModel;
