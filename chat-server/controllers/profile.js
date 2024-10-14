import Profile from '../models/Profile.js';
import Account from '../models/Account.js';
import jwt from 'jsonwebtoken';

export const createProfile = async (req, res) => {
   const { firstName, lastName, country, language, profilePic, bio, id} = req.body;
   console.log(req.body);
   if (!firstName || !lastName || !id) {
    return res.status(400).json({error: 'need fullName.'});
   }
   let flag = "";
   let count = "";
   if (country) {
    const splited = country.split(' ');
    count = country.split(' ').slice(1).join(' ');
    flag = splited[0];
   }
   const newProfile = new Profile(
    {firstName, lastName, country: count, flag, profilePic, preferedLang: language}
  );
  try {
    const account = await Account.findOne({_id: id});
    if (account.profile){
      return res.status(400).json({ error: "Profile already created"});
    }
    const savedProfile = await newProfile.save();
    await Account.updateOne({_id: id}, {profile: savedProfile._id});
    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: '24h'}
    );
    console.log(savedProfile);
    return res.status(201).json({user: savedProfile, token});
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'something went wrong'});
  }
}