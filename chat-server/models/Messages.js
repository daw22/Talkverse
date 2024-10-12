import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Profile',
  },
  reciver: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Profile',
  },
  senderLang: {
    type: String,
    required: true,
  },
  reciverLang: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  translatedMsg: {
    type: String,
    default: ""
  },
  file: {
    type: String,
    default: "",
  }
});

messagesSchema.set('timestamps', true);
export default mongoose.model('Message', messagesSchema);