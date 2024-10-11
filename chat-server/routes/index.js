import express from 'express';
import { userSignUp, userLogin, getProfile, AddContact } from '../controllers/Account.js';
import { createProfile } from '../controllers/profile.js';
import passport from 'passport';

const accountRoute = express.Router();

accountRoute.post('/register', userSignUp);

accountRoute.post('/login', userLogin);

accountRoute.post('/createprofile', createProfile);

accountRoute.get('/getprofile', passport.authenticate('jwt', {session: false}), getProfile)

accountRoute.post('/addcontact', AddContact);

export default accountRoute;