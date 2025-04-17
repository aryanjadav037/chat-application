export class SendMessageController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async send(req, res, next) {
    try {
      const { senderId, receiverId, message } = req.body;
      if (!senderId || !receiverId || !message) {
        const error = new Error('Missing required fields');
        error.statusCode = 400;
        return next(error);
      }
      const newMessage = await this.messageService.createMessage(senderId, receiverId, message);
      res.status(201).json({
        success: true,
        data: newMessage
      });
    } catch (error) {
      next(error);
    }
  }
}

export class GetMessagesController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async get(req, res, next) {
    try {
      const { senderId, receiverId } = req.params;

      if (!senderId || !receiverId) {
        const error = new Error('Missing required parameters');
        error.statusCode = 400;
        return next(error);
      }

      const messages = await this.messageService.getChat(senderId, receiverId);
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  }
}