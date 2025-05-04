import Subject, { Chapter, Lesson, Exercise, Quiz } from '../models/course.js';
import mongoose from 'mongoose';

// Create or update a complete subject with all its content
export const upsertSubjectContent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subject, chapters } = req.body;
    
    if (!subject || !chapters) {
      return res.status(400).json({ message: 'Subject and chapters data are required' });
    }

    // Find existing subject or create a new one
    let subjectDoc;
    if (subject._id) {
      subjectDoc = await Subject.findById(subject._id);
      if (!subjectDoc) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      
      // Update subject fields
      Object.keys(subject).forEach(key => {
        if (key !== '_id' && key !== 'chapters') {
          subjectDoc[key] = subject[key];
        }
      });
    } else {
      subjectDoc = new Subject(subject);
    }

    // Clear existing references to recreate them
    subjectDoc.chapters = [];
    subjectDoc.chaptersCount = 0;
    subjectDoc.lessonsCount = 0;
    subjectDoc.exercisesCount = 0;
    subjectDoc.quizzesCount = 0;

    // Save subject to get an ID if it's new
    await subjectDoc.save({ session });

    // Process all chapters
    for (const chapterData of chapters) {
      let chapter;
      
      // Find existing chapter or create a new one
      if (chapterData._id) {
        chapter = await Chapter.findById(chapterData._id);
        if (chapter) {
          // Update chapter fields
          Object.keys(chapterData).forEach(key => {
            if (key !== '_id' && key !== 'lessons' && key !== 'exercises' && key !== 'quizzes') {
              chapter[key] = chapterData[key];
            }
          });
        } else {
          chapter = new Chapter({
            ...chapterData,
            subjectId: subjectDoc._id
          });
        }
      } else {
        chapter = new Chapter({
          ...chapterData,
          subjectId: subjectDoc._id
        });
      }

      // Clear existing content references
      chapter.lessons = [];
      chapter.exercises = [];
      chapter.quizzes = [];
      
      // Save chapter to get an ID if it's new
      await chapter.save({ session });
      
      // Add chapter to subject
      subjectDoc.chapters.push(chapter._id);
      subjectDoc.chaptersCount++;

      // Process lessons
      if (chapterData.lessons && Array.isArray(chapterData.lessons)) {
        for (const lessonData of chapterData.lessons) {
          let lesson;
          
          if (lessonData._id) {
            lesson = await Lesson.findById(lessonData._id);
            if (lesson) {
              // Update lesson fields
              Object.keys(lessonData).forEach(key => {
                if (key !== '_id') {
                  lesson[key] = lessonData[key];
                }
              });
            } else {
              lesson = new Lesson({
                ...lessonData,
                chapterId: chapter._id,
                subjectId: subjectDoc._id
              });
            }
          } else {
            lesson = new Lesson({
              ...lessonData,
              chapterId: chapter._id,
              subjectId: subjectDoc._id
            });
          }
          
          await lesson.save({ session });
          chapter.lessons.push(lesson._id);
          subjectDoc.lessonsCount++;
        }
      }

      // Process exercises
      if (chapterData.exercises && Array.isArray(chapterData.exercises)) {
        for (const exerciseData of chapterData.exercises) {
          let exercise;
          
          if (exerciseData._id) {
            exercise = await Exercise.findById(exerciseData._id);
            if (exercise) {
              // Update exercise fields
              Object.keys(exerciseData).forEach(key => {
                if (key !== '_id') {
                  exercise[key] = exerciseData[key];
                }
              });
            } else {
              exercise = new Exercise({
                ...exerciseData,
                chapterId: chapter._id,
                subjectId: subjectDoc._id
              });
            }
          } else {
            exercise = new Exercise({
              ...exerciseData,
              chapterId: chapter._id,
              subjectId: subjectDoc._id
            });
          }
          
          await exercise.save({ session });
          chapter.exercises.push(exercise._id);
          subjectDoc.exercisesCount++;
        }
      }

      // Process quizzes
      if (chapterData.quizzes && Array.isArray(chapterData.quizzes)) {
        for (const quizData of chapterData.quizzes) {
          let quiz;
          
          if (quizData._id) {
            quiz = await Quiz.findById(quizData._id);
            if (quiz) {
              // Update quiz fields
              Object.keys(quizData).forEach(key => {
                if (key !== '_id') {
                  quiz[key] = quizData[key];
                }
              });
            } else {
              quiz = new Quiz({
                ...quizData,
                chapterId: chapter._id,
                subjectId: subjectDoc._id
              });
            }
          } else {
            quiz = new Quiz({
              ...quizData,
              chapterId: chapter._id,
              subjectId: subjectDoc._id
            });
          }
          
          await quiz.save({ session });
          chapter.quizzes.push(quiz._id);
          subjectDoc.quizzesCount++;
        }
      }

      // Save chapter with its content references
      await chapter.save({ session });
    }

    // Save subject with updated counts and references
    await subjectDoc.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    // Return the complete subject with populated content
    const populatedSubject = await Subject.findById(subjectDoc._id)
      .populate({
        path: 'chapters',
        options: { sort: { order: 1 } },
        populate: [
          { path: 'lessons', options: { sort: { order: 1 } } },
          { path: 'exercises' },
          { path: 'quizzes' }
        ]
      });
    
    res.status(200).json(populatedSubject);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Error in upsertSubjectContent:', error);
    res.status(500).json({ message: error.message });
  } finally {
    // End session
    session.endSession();
  }
};

// Delete a subject and all its content
export const deleteSubjectContent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    
    // Find the subject
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Find all chapters for this subject
    const chapters = await Chapter.find({ subjectId: id });
    
    // Delete all content for each chapter
    for (const chapter of chapters) {
      // Delete lessons
      await Lesson.deleteMany({ chapterId: chapter._id }, { session });
      
      // Delete exercises
      await Exercise.deleteMany({ chapterId: chapter._id }, { session });
      
      // Delete quizzes
      await Quiz.deleteMany({ chapterId: chapter._id }, { session });
    }
    
    // Delete all chapters
    await Chapter.deleteMany({ subjectId: id }, { session });
    
    // Delete the subject
    await Subject.findByIdAndDelete(id, { session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    res.status(200).json({ message: 'Subject and all its content deleted successfully' });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Error in deleteSubjectContent:', error);
    res.status(500).json({ message: error.message });
  } finally {
    // End session
    session.endSession();
  }
};

// Get a subject with all its content
export const getSubjectContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id)
      .populate({
        path: 'chapters',
        options: { sort: { order: 1 } },
        populate: [
          { path: 'lessons', options: { sort: { order: 1 } } },
          { path: 'exercises' },
          { path: 'quizzes' }
        ]
      });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.status(200).json(subject);
  } catch (error) {
    console.error('Error in getSubjectContent:', error);
    res.status(500).json({ message: error.message });
  }
};