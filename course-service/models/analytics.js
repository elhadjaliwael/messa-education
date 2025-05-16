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
    enum: [
      'course_view', 
      'chapter_view',
      'lesson_view',
      'lesson_complete', 
      'exercise_attempt', 
      'exercise_complete', 
      'quiz_attempt',
      'quiz_complete',
      'resource_access', 
      'discussion_post',
      'discussion_reply',
      'certificate_earned'
    ],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
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
  subject: {
    type: String,
    required: true
  },
  classLevel: {
    type: String
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedChapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
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
  chapterProgress: [{
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    title: String,
    progress: {
      type: Number,
      default: 0
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    completedLessons: {
      type: Number,
      default: 0
    },
    totalExercises: {
      type: Number,
      default: 0
    },
    completedExercises: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    completedQuizzes: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
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

// Create a compound index for userId and subject
progressSchema.index({ userId: 1, subject: 1 }, { unique: true });

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
  totalChaptersViewed: {
    type: Number,
    default: 0
  },
  totalLessonsViewed: {
    type: Number,
    default: 0
  },
  totalLessonsCompleted: {
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
  totalQuizzesCompleted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  subjectEngagement: [{
    subject: {
      type: String
    },
    views: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    classLevelDistribution: {
      type: Map,
      of: Number,
      default: {}
    }
  }]
}, { timestamps: true });

// Create models from schemas
const Activity = mongoose.model('Activity', activitySchema);
const Progress = mongoose.model('Progress', progressSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

export { Activity, Progress, Analytics };