import express from 'express';
import { 
  SendMessageController, 
  GetMessagesController, 
  SendGroupMessageController, 
  GetGroupMessagesController 
} from '../controllers/messageController.js';
import MessageService from '../service/messageService.js';
import Message from '../models/messageModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const messageService = new MessageService(Message);
const sendMessageController = new SendMessageController(messageService);
const getMessagesController = new GetMessagesController(messageService);
const sendGroupMessageController = new SendGroupMessageController(messageService);
const getGroupMessagesController = new GetGroupMessagesController(messageService);

// Send a private message
router.post('/', authMiddleware, (req, res, next) => sendMessageController.send(req, res, next));

// Send a group message
router.post('/group', authMiddleware, (req, res, next) => sendGroupMessageController.send(req, res, next));

// Get chat between two users
router.get('/:senderId/:receiverId', authMiddleware, (req, res, next) => getMessagesController.get(req, res, next));

// Get messages from a group
router.get('/group/:groupId', authMiddleware, (req, res, next) => getGroupMessagesController.get(req, res, next));

// Mark message as read
router.put('/:messageId/read', authMiddleware, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );
    
    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      return next(error);
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
});

export default router;