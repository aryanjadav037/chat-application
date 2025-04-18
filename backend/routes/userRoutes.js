import express from 'express';
import UserController from '../controllers/userController.js';
import UserService from '../service/userService.js';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userService = new UserService(User);
const userController = new UserController(userService);
const userRoutes = express.Router();

userRoutes.get('/me', authMiddleware, (req, res, next) => userController.getProfile(req, res, next));
userRoutes.put('/me', authMiddleware, (req, res, next) => userController.updateProfile(req, res, next));
userRoutes.delete('/me', authMiddleware, (req, res, next) => userController.deleteAccount(req, res, next));
userRoutes.get('/search', authMiddleware, (req, res, next) => userController.searchUsers(req, res, next));

export default userRoutes;