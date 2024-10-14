import express from 'express';
import { createProfile, updateProfile } from '../controllers/profile.js';

const profileRouter = express.Router();

profileRouter.post('/updateprofile', updateProfile);
export default profileRouter;