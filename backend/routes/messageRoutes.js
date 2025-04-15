import express from 'express';
import { SendMessageController, GetMessagesController } from '../controllers/messageController.js';
import MessageService from '../service/messageService.js';
import MessageModel from '../models/messageModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const messageService = new MessageService(MessageModel);
const sendMessageController = new SendMessageController(messageService);
const getMessagesController = new GetMessagesController(messageService);

// Send a message
router.post('/', authMiddleware, (req, res, next) => sendMessageController.send(req, res, next));

// Get chat between two users
router.get('/:senderId/:receiverId', authMiddleware, (req, res, next) => getMessagesController.get(req, res, next));

export default router;
