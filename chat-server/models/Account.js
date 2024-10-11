import mongoose from 'mongoose';
import crypto from 'crypto';

const userAccountSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{6,}$/,
  },
  salt:{
    type: String,
  },
  profile: {
    type: mongoose.Types.ObjectId,
    ref: 'Profile',
  }
});

userAccountSchema.pre('save', function(next){
  //genearate salt
  this.salt = crypto.randomBytes(128).toString('hex');
  // only run when new account is created or password is updated
  if (!this.isModified('password')) return next();
  this.password = crypto.pbkdf2Sync(this.password, this.salt, 310000, 32, 'sha256').toString('hex');
  next();
});
userAccountSchema.set('timestamps', true);
export default mongoose.model('Account', userAccountSchema);