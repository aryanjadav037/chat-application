import express from 'express';
import {
    CreateGroupController,
    SendGroupMessageController,
    GetGroupMessagesController
} from '../controllers/groupController.js';

import GroupService from '../service/groupService.js';
import Group from '../models/groupModel.js';
import Message from '../models/messageModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const groupService = new GroupService(Group, Message); 
const createGroupController = new CreateGroupController(groupService);
const sendGroupMessageController = new SendGroupMessageController(groupService);
const getGroupMessagesController = new GetGroupMessagesController(groupService);

// Create group
router.post('/create', authMiddleware, (req, res, next) => createGroupController.create(req, res, next));

// Send a group message
router.post('/msg', authMiddleware, (req, res, next) => sendGroupMessageController.send(req, res, next));

// Get messages from a group
router.get('/:groupId', authMiddleware, (req, res, next) => getGroupMessagesController.get(req, res, next));

export default router;
