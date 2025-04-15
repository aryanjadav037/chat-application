export class SendMessageController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async send(req, res, next) {
    try {
      const { senderId, receiverId, message } = req.body;
      const newMessage = await this.messageService.createMessage(senderId, receiverId, message);
      res.status(201).json(newMessage);
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
      const messages = await this.messageService.getChat(senderId, receiverId);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
