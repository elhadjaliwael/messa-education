import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    id: { type: mongoose.Schema.Types.Mixed},
    name: { type: String, required: true }
  },
  chapter: {
    id: { type: mongoose.Schema.Types.Mixed, required: true },
    title: { type: String, required: true }
  },
  lesson: {
    id: { type: mongoose.Schema.Types.Mixed, required: true },
    title: { type: String, required: true }
  },
  exercise: {
    id: { type: mongoose.Schema.Types.Mixed },
    title: { type: String }
  },
  quizz: {
    id: { type: mongoose.Schema.Types.Mixed },
    title: { type: String }
  },
  dueDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'late','in_progress'],
    default: 'pending'
  }
});

export default mongoose.model("Assignment", assignmentSchema);