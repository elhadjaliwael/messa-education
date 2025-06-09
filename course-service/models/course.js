import mongoose from 'mongoose';

// Resource schema (for lesson resources)
const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required']
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required']
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'link', 'image'],
    default: 'pdf'
  }
});

// Exercise option schema (for quiz questions)
const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required']
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

// Question schema (for quizzes)
const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [OptionSchema],
  points: {
    type: Number,
    default: 1
  }
});

// Quiz schema
const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: String,
  timeLimit: {
    type: Number,
    default: 10
  },
  passingScore: {
    type: Number,
    default: 70
  },
  questions: [QuestionSchema]
});

// Exercise schema
// Exercise schema
const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exercise title is required']
  },
  description: String,
  type: {
    type: String,
    enum: ['coding', 'written', 'project'],
    default: 'coding'
  },
  content: {
    text: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'both'],
      default: 'text'
    }
  },
  solution: {
    text: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    solutionType: {
      type: String,
      enum: ['text', 'image', 'both'],
      default: 'text'
    }
  },
  points: {
    type: Number,
    default: 10
  }
});

// Lesson schema
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required']
  },
  description: String,
  order: {
    type: Number,
    required: [true, 'Lesson order is required']
  },
  estimatedTime: {
    type: Number,
    default: 30
  },
  content: String,
  contentType: {
    type: String,
    enum: ['text', 'video'],
    default: 'text'
  },
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  resources: [ResourceSchema],
  exercises: [ExerciseSchema],
  quizzes: [QuizSchema],
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  }
});

// Chapter schema - now includes course properties
const ChapterSchema = new mongoose.Schema({
  addedById : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  addedByName : {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Chapter title is required']
  },
  description: String,
  order: {
    type: Number,
    required: [true, 'Chapter order is required']
  },
  // Added course properties to chapter schema
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  classLevel: {
    type: String,
    required: [true, 'Class level is required']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
  },
  lessonsCount: {
    type: Number,
    default: 0 
  },
  exercisesCount: {
    type: Number,
    default: 0
  },
  quizzesCount: {
    type: Number,
    default: 0 
  },
  totalTime: {
    type: Number,
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models from schemas
// First, remove the existing model definitions
// const Chapter = mongoose.model('Chapter', ChapterSchema);
// const Lesson = mongoose.model('Lesson', LessonSchema);

// Register the middleware BEFORE creating the model
LessonSchema.pre('save', async function(next) {
 
  
  try {
    // Skip this middleware if only specific fields that don't affect counts are modified
    if (this.isModified('content') && !this.isModified('exercises') && 
        !this.isModified('quizzes') && !this.isModified('estimatedTime')) {
      return next();
    }
    
    // Find the chapter by its _id which matches this lesson's chapterId
    const chapter = await mongoose.model('Chapter').findById(this.chapterId);
    
    if (!chapter) {
      console.error(`Chapter with ID ${this.chapterId} not found`);
      return next(new Error(`Chapter with ID ${this.chapterId} not found`));
    }
    
    
    // Calculate counts from this lesson
    const exercisesCount = this.exercises ? this.exercises.length : 0;
    const quizzesCount = this.quizzes ? this.quizzes.length : 0;
    const totalTime = this.estimatedTime || 0;
    
    
    // For new lessons, simply add the counts
    if (this.isNew) {
      chapter.exercisesCount += exercisesCount;
      chapter.quizzesCount += quizzesCount;
      chapter.totalTime += totalTime;
      chapter.lessonsCount += 1;
    } else {
      try {
        // For updates, fetch the old version from the database
      
        const oldLesson = await mongoose.model('Lesson').findById(this._id);
        
        if (oldLesson) {

          const oldExercisesCount = oldLesson.exercises ? oldLesson.exercises.length : 0;
          const oldQuizzesCount = oldLesson.quizzes ? oldLesson.quizzes.length : 0;
          const oldTotalTime = oldLesson.estimatedTime || 0;
          
          
          // Update with the difference
          chapter.exercisesCount = Math.max(0, chapter.exercisesCount + (exercisesCount - oldExercisesCount));
          chapter.quizzesCount = Math.max(0, chapter.quizzesCount + (quizzesCount - oldQuizzesCount));
          chapter.totalTime = Math.max(0, chapter.totalTime + (totalTime - oldTotalTime));
        } else {
          chapter.exercisesCount += exercisesCount;
          chapter.quizzesCount += quizzesCount;
          chapter.totalTime += totalTime;
        }
      } catch (err) {
        console.error('Error fetching old lesson:', err);
        // If we can't get the old lesson, just use the current values
        chapter.exercisesCount += exercisesCount;
        chapter.quizzesCount += quizzesCount;
        chapter.totalTime += totalTime;
      }
    }
    
    // Update the chapter's updatedAt timestamp
    chapter.updatedAt = Date.now()
    await chapter.save();

    
    next();
  } catch (error) {
    console.error('Error in lesson pre-save middleware:', error);
    next(error);
  }
});

// Now create the models AFTER registering the middleware
const Chapter = mongoose.model('Chapter', ChapterSchema);
const Lesson = mongoose.model('Lesson', LessonSchema);

export { Chapter, Lesson };

