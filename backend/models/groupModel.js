import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Validate that group has at least one member
groupSchema.pre('save', function(next) {
  if (!this.members || this.members.length === 1) {
    return next(new Error('Group must have at least two member'));
  }
  next();
});

const Group = mongoose.model('Group', groupSchema);
export default Group;