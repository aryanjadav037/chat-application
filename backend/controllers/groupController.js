export class CreateGroupController {
    constructor(groupService,messageService) {
      this.groupService = groupService;
      this.messageService = messageService;
    }
    async create(req, res, next) {
      try {
        const { name, description } = req.body;
        const admin = req.userId; 

        if (!admin || !name) {
          const error = new Error('Missing required fields');
          error.statusCode = 400;
          return next(error);
        }
        const newGroup = await this.groupService.createGroup(admin,name, description);
        res.status(201).json({
          success: true,
          data: newGroup
        });
      }
      catch (error) {
        next(error)
      }
    }
  };
  
  export class SendGroupMessageController {
    constructor(messageService) {
      this.messageService = messageService;
    }
  
    async send(req, res, next) {
      try {
        const { senderId, groupId, message } = req.body;
  
        if (!senderId || !groupId || !message) {
          const error = new Error('Missing required fields');
          error.statusCode = 400;
          return next(error);
        }
  
        const newMessage = await this.messageService.createGroupMessage(senderId, groupId, message);
        res.status(201).json({
          success: true,
          data: newMessage
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  export class GetGroupMessagesController {
    constructor(messageService) {
      this.messageService = messageService;
    }
  
    async get(req, res, next) {
      try {
        const { groupId } = req.params;
  
        if (!groupId) {
          const error = new Error('Missing required parameters');
          error.statusCode = 400;
          return next(error);
        }
  
        const messages = await this.messageService.getGroupChat(groupId);
        res.status(200).json({
          success: true,
          data: messages
        });
      } catch (error) {
        next(error);
      }
    }
  }