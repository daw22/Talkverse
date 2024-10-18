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
import { sendMessage, logout, login } from './controllers/socket.js';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});
//redis
const redisClient = createClient({
  url: 'redis://red-cs92i8bqf0us738i4ddg:6379'
});
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
  socket.on('register', (data)=> login(data.id, socket, redisClient));
  socket.on('unregister', (data) => logout(data.id, socket, redisClient));
  socket.on('send_message', (data)=> sendMessage(data, socket, redisClient));
});


server.listen(process.env.PORT, async ()=> {
  await connectDB();
  await redisClient.connect()
  console.log('server running...');
}); 