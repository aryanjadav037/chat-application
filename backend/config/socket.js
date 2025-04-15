
import { Server } from 'socket.io';

const users = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5005',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ID: ${socket.id}`);
    });

    socket.on('send-message', ({ senderId, receiverId, message }) => {
      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', { senderId, message });
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

export default initSocket;
