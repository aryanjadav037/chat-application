import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import initSocket from './config/socket.js';
import app from './app.js';

dotenv.config();

connectDB();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});