import express from 'express';
import { createProfile } from '../controllers/profile.js';

const profileRouter = express.Router();

profileRouter.get('/test', (req, res)=> res.send('test'));
export default profileRouter;