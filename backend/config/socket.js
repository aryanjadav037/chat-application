import { Server } from 'socket.io';

const users = new Map(); // userId -> socketId
const groups = new Map(); // groupId -> { name, description, members: Set<userId> }

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5005',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Register user
    socket.on('join', (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Create a group
    socket.on('create-group', ({ groupId, userId, name, description }) => {
      if (groups.has(groupId)) {
        socket.emit('group-error', { message: 'Group already exists' });
        return;
      }

      groups.set(groupId, {
        name,
        description,
        members: new Set([userId]),
      });

      socket.join(groupId);
      console.log(`Group ${groupId} created by ${userId}`);
      socket.emit('group-created', { groupId, name, description });
    });

    // Join a group
    socket.on('join-group', ({ groupId, userId }) => {
      const group = groups.get(groupId);

      if (!group) {
        socket.emit('group-error', { message: 'Group not found' });
        return;
      }

      group.members.add(userId);
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);
      socket.emit('group-joined', { groupId });
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
      if (!groups.has(groupId)) {
        socket.emit('group-error', { message: 'Group not found' });
        return;
      }

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

  return io;
};

export default initSocket;
