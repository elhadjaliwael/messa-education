import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  targetUsers: {
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
    enum: ['NEW_COURSE','NEW_COURSE_FROM_TEACHER', 'ASSIGNMENT_COMPLETED','NEW_ENROLLMENT','NEW_ASSIGNMENT', 'NEW_MESSAGE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'COURSE_UPDATE', 'SYSTEM','TEACHER_ADDED'],
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