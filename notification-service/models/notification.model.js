import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: ['NEW_COURSE', 'NEW_ENROLLMENT', 'NEW_MESSAGE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'COURSE_UPDATE', 'SYSTEM'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Notification', notificationSchema);