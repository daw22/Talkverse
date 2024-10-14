import express from 'express';
import { addContact, getMessages, search } from '../controllers/chat.js';

const chatRouter = express.Router();

chatRouter.post('/addcontact', addContact);
chatRouter.get('/getmessages', getMessages);
chatRouter.get('/search', search)
export default chatRouter;