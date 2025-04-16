import { Server } from 'socket.io';

const users = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on('join-group', ({ groupId }) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    // Private message
    socket.on('send-message', ({ senderId, receiverId, message }) => {
      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', { senderId, message });
      }
    });

    // Group message
    socket.on('group-message', ({ senderId, groupId, message }) => {
      socket.to(groupId).emit('receive-group-message', { senderId, groupId, message });
    });

    // Handle disconnect
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

  return io; // Return the io instance for potential use elsewhere
};

export default initSocket;