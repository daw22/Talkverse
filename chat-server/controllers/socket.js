import Message from '../models/Messages.js';
import { createClient } from 'redis';

export const sendMessage = async (data, socket) => {
  const { sender, reciver, senderLang, reciverLang, message } = data;
  if (!sender || !reciver || !message) {
    return;
  }
  try {
    const newMessage = new Message({
      sender, reciver, senderLang, reciverLang, message
    });
    const savedMessage = await newMessage.save();
    const redisClient = createClient();
    await redisClient.connect();
    const re = await redisClient.get(reciver);
    socket.to(re).emit('recive', {message: savedMessage});
  } catch(err){
    console.log(err);
  }
}