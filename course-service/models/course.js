import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema({
    title: String,
    url: String,
    type: String
});

const exerciseSchema = new Schema({
    title: String,
    description: String,
    difficulty: String,
    points: Number,
    type: String,
    instructions: String,
    sampleSolution: String,
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }
});

const optionSchema = new Schema({
    text: String,
    isCorrect: Boolean
});

const quizSchema = new Schema({
    question: String,
    type: String,
    points: Number,
    options: [optionSchema],
    explanation: String,
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }
});

const lessonSchema = new Schema({
    title: String,
    description: String,
    order: Number,
    estimatedTime: Number,
    content: String,
    resources: [resourceSchema],
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }
});

const chapterSchema = new Schema({
    title: String,
    description: String,
    order: Number,
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
    quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }]
});

const subjectSchema = new Schema({
    name: String,
    description: String,
    slug: String,
    isPublished: { type: Boolean, default: false },
    classLevel: {
        type: String,
        enum: [
            '1ere_annee', '2eme_annee', '3eme_annee', '4eme_annee', '5eme_annee', '6eme_annee',
            '7eme_annee', '8eme_annee', '9eme_annee',
            '1ere_secondaire',
            '2eme_secondaire_sciences', '2eme_secondaire_eco', '2eme_secondaire_lettres', '2eme_secondaire_sport',
            '3eme_secondaire_sciences', '3eme_secondaire_eco', '3eme_secondaire_lettres', '3eme_secondaire_sport',
            '3eme_secondaire_math', '3eme_secondaire_technique', '3eme_secondaire_info'
        ],
        required: true
    },
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
    // Metadata counts
    chaptersCount: { type: Number, default: 0 },
    lessonsCount: { type: Number, default: 0 },
    exercisesCount: { type: Number, default: 0 },
    quizzesCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create models
const Lesson = mongoose.model('Lesson', lessonSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Chapter = mongoose.model('Chapter', chapterSchema);
const Subject = mongoose.model('Subject', subjectSchema);

// Export the models
export default Subject;
export { Lesson, Exercise, Quiz, Chapter };