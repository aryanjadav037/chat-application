export default class GroupService {
    constructor(GroupModel, messageModel) {
        this.GroupModel = GroupModel;
        this.messageModel = messageModel;
    }

    async createGroup(admin, name, description, members = []) {
        const uniqueMembers = Array.from(new Set([admin, ...members]));
        return this.GroupModel.create({
            admin,
            name,
            description,
            members: uniqueMembers
        });
    }

    async createGroupMessage(senderId, groupId, message) {
        const group = await this.GroupModel.findById(groupId);

        if (!group) {
            const error = new Error('Group not found');
            error.statusCode = 404;
            throw error;
        }

        if (!group.members.includes(senderId)) {
            group.members.push(senderId);
            await group.save();
        }

        return this.messageModel.create({
            senderId,
            groupId,
            message
        });
    }

    async getGroupChat(groupId) {
        return this.messageModel.find({ groupId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'username');
    }
}
