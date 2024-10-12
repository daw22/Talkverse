import express from 'express';
import { addContact, getMessages } from '../controllers/chat.js';

const chatRouter = express.Router();

chatRouter.post('/addcontact', addContact);
chatRouter.get('/getmessages', getMessages);
export default chatRouter;