export default class MessageService {
  constructor(MessageModel) {
    this.MessageModel = MessageModel;
  }

  async createMessage(senderId, receiverId, message) {
    return this.MessageModel.create({ senderId, receiverId, message });
  }

  async getChat(senderId, receiverId) {
    return this.MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username')
      .populate('receiverId', 'username');
  }
}
