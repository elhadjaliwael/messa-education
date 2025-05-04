import mongoose from "mongoose";

// Schema for tracking individual learning activities
const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  activityType: {
    type: String,
    enum: ['course_view', 'exercise_attempt', 'exercise_complete', 'quiz_attempt','lesson_complete' ,'resource_access', 'discussion_post'],
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // Time spent in seconds
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// Schema for tracking overall progress in a course
const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  completedExercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  completedQuizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  totalTimeSpent: {
    type: Number, // Total time spent in seconds
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date
  }
}, { timestamps: true });

// Create a compound index for userId and courseId
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Main analytics schema that aggregates data
const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  dailyActiveUsers: {
    type: Number,
    default: 0
  },
  totalCoursesViewed: {
    type: Number,
    default: 0
  },
  totalExercisesCompleted: {
    type: Number,
    default: 0
  },
  totalQuizzesAttempted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  courseEngagement: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    views: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  }]
}, { timestamps: true });

// Create models from schemas
const Activity = mongoose.model('Activity', activitySchema);
const Progress = mongoose.model('Progress', progressSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

export { Activity, Progress, Analytics };