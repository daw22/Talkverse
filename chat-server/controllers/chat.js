import Profile from "../models/Profile.js";
import Message from "../models/Messages.js";

export const addContact = async (req, res) => {
  const {id, contactId} = req.body;
  try {
    const result = await Profile.updateOne(
      {_id: id},
      {$push: {contacts: contactId}},
    );
  
    const user = await Profile.findOne({_id: id});
    res.json(user);
  } catch(err) {
    res.status(404).json({error: err});
  }
};

export const getMessages = async (req, res) => {
  const { fromId } = req.query;
  if(!fromId){
    return res.status(400).json({error: 'userId missing'});
  }
  try {
    const messages = await Message.find({reciver: req.account.profile, sender: fromId});
    const messages2 = await Message.find({sender: req.account.profile, reciver: fromId});
    const allMessages = [...messages, ...messages2 ].sort((a, b)=>{
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    res.status(200).json(allMessages);
  } catch(err){
    return res.status(404).json({error: err});
  }
}
