import Account from "../models/Account.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import Profile from "../models/Profile.js";
import { redisClient } from "../index.js";

const verifyPassword = (password, user) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
    .toString("hex");
  return hashedPassword === user.password;
}

export const userSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'unable to signup'});
  }
  try {
    const newAccount  = new Account({ username, email, password});
    const savedAccount = await newAccount.save();
    res.status(201).json({ status: 'success', id: savedAccount._id});
  } catch(error) {
    res.status(500).json({ status: 'failed'});
  }
};

export const userLogin = async (req, res) => {
  const { username, email, password} = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json({error: 'credentials missing'});
  }
  try {
    let user;
    if (username) user = await Account.findOne({ username });
    if (email) user = await Account.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'username or password wrong'});
    }
    const verified = verifyPassword(password, user);
    if (verified) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
      );
      const profile = await Profile.aggregate([
        {$match: {_id: user.profile}},
        {$lookup: {
          from: "profiles",
          localField: "contacts",
          foreignField: "_id",
          as: "contacts"
        }}
      ]);
      const contactIds = [];
      profile[0].contacts.forEach((contact)=> {
        contactIds.push(contact._id.toString());
      });
      const onlineContacts = [];
      if(contactIds.length > 0){
        const onlineContactsVals = await redisClient.mGet(contactIds);
        onlineContactsVals.forEach((val, index) => {
          if (val) onlineContacts.push(contactIds[index]);
        });
      }
      return res.status(200).json({ user: profile, accId: user._id, token, onlineContacts });
    } else{
      return res.status(401).json({error: 'username or password wrong'});
    }
  }catch(err) {
    console.log(err.message, "here");
    return res.status(500).json({error: err});
  }
}

export const getProfile = async (req, res) => {
  const id = req.user._id;
  try {
    const account = await Account.findOne({_id: id});
    //const profile = await Profile.findOne({_id: account.profile});
    const profile = await Profile.aggregate([
      {$match: {_id: account.profile}},
      {$lookup: {
        from: "profiles",
        localField: "contacts",
        foreignField: "_id",
        as: "contacts"
      }}
    ]);
    const contactIds = [];
    const onlineContacts = [];
    profile[0].contacts.forEach((contact)=> {
      contactIds.push(contact._id.toString());
    });
    if(contactIds.length > 0){
      const onlineContactsVals = await redisClient.mGet(contactIds);
      onlineContactsVals.forEach((val, index) => {
        if (val) onlineContacts.push(contactIds[index]);
      })
    }
    res.status(200).json({ user: profile, onlineContacts});
  } catch(err) {
    res.status(401).json({error: 'unauthorized user'});
    console.log(err.message, "getprofile");
  }
}
