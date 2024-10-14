import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  flag: {
    type: String,
    default: ""
  },
  preferedLang: {
    type: String,
    default: 'en',
  },
  bio: {
    type: String,
    defalt: 'bio'
  },
  contacts: [{ type: mongoose.Types.ObjectId, ref: 'Profile'}],
  unreadMessages: [{type: mongoose.Types.ObjectId, ref: 'Message'}]
});

userProfileSchema.set('timestamps', true);
export default mongoose.model('Profile', userProfileSchema);