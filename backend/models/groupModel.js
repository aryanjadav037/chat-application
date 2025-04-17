import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

groupSchema.pre('save', function (next) {
  if (this.isNew && (!this.members || this.members.length === 0)) {
    return next(new Error('Group must have at least one member'));
  }
  next();
});

const Group = mongoose.model('Group', groupSchema);
export default Group;