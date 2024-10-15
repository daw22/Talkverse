import express from 'express';
import { addContact, getMessages, getUnreadMessages, markReadmessages, search } from '../controllers/chat.js';

const chatRouter = express.Router();

chatRouter.post('/addcontact', addContact);
chatRouter.get('/getmessages', getMessages);
chatRouter.get('/search', search)
chatRouter.get('/getunreadmessages', getUnreadMessages);
chatRouter.post('/markreadmessages', markReadmessages);
export default chatRouter;