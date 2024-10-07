import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http'
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => res.send('<h1>Hello there </h1>'));

io.on('connection', (socket) => console.log('client connected'));

server.listen(5000, ()=> console.log('server running...'));