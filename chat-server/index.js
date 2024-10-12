import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http'
import { Server } from 'socket.io';
import { connectDB } from './utils/db.js'
import accountRoute from './routes/index.js';
import cors from 'cors';
import passport from 'passport';
import './utils/passport-config.js';
import profileRouter from './routes/profile.js';
import chatRouter from './routes/chat.js';
import { createClient } from 'redis';
import { sendMessage } from './controllers/socket.js';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});
//redis
const redisClient = createClient();
//midlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
// routes
app.use('/account', accountRoute);
app.use('/profile', passport.authenticate('jwt', {session: false}), profileRouter);
app.use('/chat', passport.authorize('jwt', {session: false}), chatRouter);

//socket.io
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  socket.on('disconnect', () => console.log(`user ${socket.id}: disconnected`));
  socket.on('register', (data)=> {redisClient.set(data.id, socket.id); console.log(data.id)});
  socket.on('unregister', (data) => redisClient.del(data.id));
  socket.on('send_message', (data)=> sendMessage(data, socket));
});


server.listen(process.env.PORT, async ()=> {
  await connectDB();
  await redisClient.connect()
  console.log('server running...');
}); 