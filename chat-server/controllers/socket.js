import Message from '../models/Messages.js';
import Profile from '../models/Profile.js';
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

export const login = async (id, socket, rClient) => {
  const profile = await Profile.findOne({_id: id});
  if (!profile) return;
  const contacts = profile.contacts.map((contact) => contact.toString());
  const socketIds = await rClient.mGet(contacts);
  socketIds.forEach((sId) => socket.to(sId).emit('contact_joins', {userId: id}));
  rClient.set(id, socket.id);
}

export const logout = async (id, socket, rclient) => {
  const profile = await Profile.findOne({_id: id});
  if (!profile) return;
  const contacts = profile.contacts.map((contact) => contact.toString());
  const socketIds = await rclient.mGet(contacts);
  socketIds.forEach((sId) => socket.to(sId).emit('contact_leaves', {userId: id}));
  rclient.del(id);
}