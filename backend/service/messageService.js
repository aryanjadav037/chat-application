export default class MessageService {
  constructor(MessageModel) {
    this.MessageModel = MessageModel;
  }

  async createMessage(senderId, receiverId, message) {
    return this.MessageModel.create({ senderId, receiverId, message });
  }

  async createGroupMessage(senderId, groupId, message) {
    return this.MessageModel.create({ senderId, groupId, message });
  }

  async getChat(senderId, receiverId) {
    return this.MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'username profilePic')
    .populate('receiverId', 'username profilePic');
  }

  async getGroupChat(groupId) {
    return this.MessageModel.find({ groupId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username profilePic');
  }

  async markMessageAsRead(messageId) {
    return this.MessageModel.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
  }

  async getUnreadMessageCount(userId) {
    return this.MessageModel.countDocuments({
      receiverId: userId,
      read: false
    });
  }
}