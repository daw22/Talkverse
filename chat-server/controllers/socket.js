import Message from '../models/Messages.js';
import Profile from '../models/Profile.js';
import translate from '../utils/ai.js';

export const sendMessage = async (data, socket, redisClient) => {
  const { sender, reciver, senderLang, reciverLang, message } = data;
  if (!sender || !reciver || !message) {
    return;
  }
  try {
    const newMessage = new Message({
      sender, reciver, senderLang, reciverLang, message
    });
    const savedMessage = await newMessage.save();
    const re = await redisClient.get(reciver);
    if(re){
      socket.to(re).emit('recive', {message: savedMessage});
    } else {
      await Profile.updateOne({_id: reciver}, {$push: {unreadMessages: savedMessage._id}});
    }
    if (reciverLang !== senderLang) {
      const translation = await translate(senderLang, reciverLang, message);
      if (translation) {
        const result = translation.response.text();
        if(re) {
          socket.to(re).emit('translation', 
            {messageId: savedMessage._id, translatedMsg: JSON.parse(result).content}
          );
        }
        await Message.updateOne({_id: savedMessage._id}, {translatedMsg: JSON.parse(result).content});
      }
    }
  } catch(err){
    console.log(err);
  }
}

export const login = async (id, socket, rClient) => {
  const profile = await Profile.findOne({_id: id});
  if (!profile) return;
  const contacts = profile.contacts.map((contact) => contact.toString());
  if(contacts.length > 0) {
    const socketIds = await rClient.mGet(contacts);
    socketIds.forEach((sId) => socket.to(sId).emit('contact_joins', {userId: id}));
  }
    rClient.set(id, socket.id);
}

export const logout = async (id, socket, rclient) => {
  const profile = await Profile.findOne({_id: id});
  if (!profile) return;
  const contacts = profile.contacts.map((contact) => contact.toString());
  if(contacts.length > 0) {
    const socketIds = await rclient.mGet(contacts);
    socketIds.forEach((sId) => socket.to(sId).emit('contact_leaves', {userId: id}));
  }
  rclient.del(id);
}