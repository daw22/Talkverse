import Profile from "../models/Profile.js";
import Account from "../models/Account.js"
import Message from "../models/Messages.js";

export const addContact = async (req, res) => {
  const {id, contactId} = req.body;
  if (id.toString() === contactId.toString()){
    // can't add your self
    return res.status(400).json({error: "can't add your self"});
  }
  try {
    const result = await Profile.updateOne(
      {_id: id},
      {$push: {contacts: contactId}},
    );
  
    await Profile.updateOne(
      {_id: contactId},
      {$push: {contacts: id}},
    );

    const user = await Profile.findOne({_id: id}).populate("contacts");
    res.status(200).json(user);
  } catch(err) {
    res.status(404).json({error: err});
  }
};

export const getMessages = async (req, res) => {
  const { fromId } = req.query;
  console.log(req.account.profile);
  console.log(fromId);
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

export const search = async (req, res) => {
  const { q, country} = req.query;
  if(!q) return;
  try {
    let results = [];
    if(q[0] == '@') {
      let query = q.slice(1);
      if (!query) return res.status(200).json([]);
      const users = await Account.find(
        {username: {$regex: `^${query}`}}
      ).populate("profile");
      if (users) {
        if (country){
          const filtered = users.filter(user => user.profile.country.toLowerCase() == country.toLowerCase());
          console.log(filtered);
          results = filtered.map(f => f.profile);
        } else {
          results = users.map(user => user.profile);
        }
      }
    } else {
       results = await Profile.find(
        { $or: 
          [ 
            {firstName: {$regex: `^${q}`, $options: 'i'}}, 
            {lastName: {$regex: `^${q}`, $options: 'i'}}
          ]
        }
       );
       if (results){
        if (country){
          results = results.filter(result => result.country.toLowerCase() == country.toLowerCase())
        }
       }
    }
    return res.status(200).json(results);
  } catch(err) {
    console.log(err);
    return res.status(500).json({error: "error searching"});
  }
}

export const getUnreadMessages = async (req, res) => {
  const userId = req.account.profile;
  try {
    const profile = await Profile.findOne({_id: userId});
    console.log(profile);
    if (profile){
      const unreadIds = profile.unreadMessages;
      const messages = await Message.find({_id: {$in: unreadIds}}).populate('sender');
      console.log(messages);
      res.status(200).json(messages);
    }
  } catch (err){
    console.log(err);
  }
}

export const markReadmessages = async (req, res) => {
  const userId = req.account.profile;
  const { msgIds } = req.body;
  try {
    await Profile.updateOne({_id: userId}, {unreadMessages: msgIds});
    res.status(200).end();
  }catch(err){
    console.log(err);
    res.status(500).end();
  }
}
