import {Chapter, Lesson } from '../models/course.js';
import Assignment from '../models/assignments.js';
import { notifyCourseCreated, notifyNewCourseFromTeacher } from '../services/rabbitmq.service.js';
import { notifyAssignmentCreated } from '../services/rabbitmq.service.js';

// Chapter controllers
// Renamed from createCourse to createChapter
export const createChapter = async (req, res) => {
  try {
    const addedById = req.user.id
    const addedByName = req.user.role === "teacher" ? req.user.name : "Admin"
    req.body.addedById = addedById;
    req.body.addedByName = addedByName;
    const chapter = new Chapter(req.body);
    await chapter.save();
    if(req.user.role === "teacher"){
      await notifyNewCourseFromTeacher(chapter)
    }
    if(chapter.isPublished){
      await notifyCourseCreated(chapter)
    }
    res.status(201).json({message : 'Chapter created successfully', chapterId: chapter._id});

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Renamed from getAllCourses to getAllChapters
export const getAllChapters = async (req, res) => {
  try {
    // Parse pagination parameters from query string
    const addedById = req.user.id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = req.user.role === 'teacher' ? {addedById} : {};

    const total = await Chapter.countDocuments(query); // Count total documents for pagination metadata
    // Get chapters with pagination
    const chapters = await Chapter.find(query)
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    res.status(200).json({
      chapters,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Renamed from getCourseById to getChapterById and updated
export const getChapterById = async (req, res) => {
  try {

    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Get all lessons for this chapter
    const lessons = await Lesson.find({ chapterId: chapter._id }).sort({ order: 1 });
    
    // Add lessons to chapter response
    const chapterWithLessons = {
      ...chapter.toObject(),
      lessons
    };
    
    res.status(200).json({message: 'Chapter found successfully', chapter: chapterWithLessons});
  } catch (error) { 
    res.status(400).json({ error: error.message });
  } 
}

// Renamed from updateCourse to updateChapter and updated
export const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    console.log("heelo")
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    } 
    
    const { subject, classLevel, difficulty } = req.body;
    
    chapter.subject = subject;
    chapter.classLevel = classLevel;
    chapter.difficulty = difficulty;
    
    await chapter.save();
    const lessons = await Lesson.find({ chapterId: chapter._id })
    const chapterWithLessons = {
     ...chapter.toObject(),
      lessons
    };
    res.status(200).json({message: 'Chapter updated successfully',chapter : chapterWithLessons});
  } 
  catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message }); 
  }
}

// Renamed from togglePublish to toggleChapterPublish
export const toggleChapterPublish = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    console.log("hello")
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    } 
    chapter.isPublished = !chapter.isPublished;
    await chapter.save();
    res.status(200).json({message: `Chapter ${chapter.isPublished ? 'Published' : 'Unpublished'} successfully`});
  } 
  catch (error) {
    res.status(400).json({ error: error.message }); 
  }
}

// Removed the old createChapter function since it's now the main createChapter above

// Updated getLessonById to work with new structure
export const getLessonByIdAndChapterId = async (req, res) => {
  try {
    const { chapterId, lessonId } = req.params;
    
    // Verify chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Get lesson
    const lesson = await Lesson.findOne({ _id: lessonId, chapterId });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.status(200).json({message: 'Lesson found successfully', lesson});
  } catch (error) { 
    res.status(400).json({ error: error.message });
  } 
}

// Updated createLesson to work with new structure
export const createLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    // Check if chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Create new lesson
    const lesson = new Lesson({
      ...req.body,
      isNew : false,
      chapterId
    });
    
    await lesson.save();
    
    // Update chapter counts
    await chapter.save();
    
    res.status(201).json({message: 'Lesson created successfully', lessonId: lesson._id});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Updated updateLesson to work with new structure
export const updateLesson = async (req, res) => {
  try {
    const { chapterId, lessonId } = req.params;
    
    // Verify chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Find and update lesson
    const lesson = await Lesson.findOne({ _id: lessonId, chapterId });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update lesson fields
    Object.keys(req.body).forEach(key => {
      lesson[key] = req.body[key];
    });
    
    await lesson.save();
    
    // Update chapter counts
    await chapter.save();
    
    res.status(200).json({message: 'Lesson updated successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Updated deleteLesson to work with new structure
export const deleteLesson = async (req, res) => {
  try {
    const { chapterId, lessonId } = req.params;
    
    // Verify chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Find and delete lesson
    const lesson = await Lesson.findOneAndDelete({ _id: lessonId, chapterId });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update chapter counts
    await chapter.save();
    
    res.status(200).json({message: 'Lesson deleted successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Added deleteChapter function
export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    // Find and delete the chapter
    const chapter = await Chapter.findByIdAndDelete(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Delete all lessons associated with this chapter
    await Lesson.deleteMany({ chapterId });
    
    res.status(200).json({message: 'Chapter deleted successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getAllChaptersBySubjectAndClassLevel = async (req, res) => {
  try {
    const { subject, classLevel } = req.params
    console.log(subject, classLevel)
    // Use regex with 'i' flag for case-insensitive search
    const chapters = await Chapter.find({ 
      subject: { $regex: new RegExp('^' + subject + '$', 'i') },
      classLevel: { $regex: new RegExp('^' + classLevel + '$', 'i') },
      isPublished: true
    });
    
    if(chapters.length === 0){
      return res.status(404).json({ message: 'Chapters not found' }); 
    }
    console.log(chapters)
    res.status(200).json({message: 'Chapters found successfully', chapters}); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
export const getLessonsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const lessons = await Lesson.find({ chapterId });
    if(lessons.length === 0){
      return res.status(404).json({ message: 'Lessons not found' });
    }
    res.status(200).json({message: 'Lessons found successfully', lessons});
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId); 
    if(!lesson){
      return res.status(404).json({ message: 'Lesson not found' }); 
    }
    res.status(200).json({message: 'Lesson found successfully', lesson});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getExerciseByLessonAndExerciseId = async (req, res) => {
  try {
    const { lessonId, exerciseId } = req.params;
    const lesson = await Lesson.findById(lessonId); 
    if(!lesson){
      return res.status(404).json({ message: 'Lesson not found' });
    }
    const exercise = lesson.exercises.find(exercise => exercise._id.toString() === exerciseId);
    if(!exercise){
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json({message: 'Exercise found successfully', exercise});
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
}
export const getQuizzByLessonAndQuizzId = async (req, res) => {
  try {
    const { lessonId, quizzId } = req.params;
    const lesson = await Lesson.findById(lessonId); 
    if(!lesson){
      return res.status(404).json({ message: 'Lesson not found' });
   }
    const quizz = lesson.quizzes.find(quizz => quizz._id.toString() === quizzId);
    if(!quizz){
      return res.status(404).json({ message: 'Quizz not found' });
    }
    res.status(200).json({message: 'Quizz found successfully', quizz});
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
}

export const createAssignment = async (req, res) => {
  try {
    console.log(req.body)
    const assignment = new Assignment(req.body);
    await assignment.save();
    await notifyAssignmentCreated(assignment); // Notify the assignmen
    res.status(201).json({message: 'Assignment created successfully', assignmentId: assignment._id});
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message });
  }
}
export const getAssignments = async (req, res) => {
  try {
    let parentId;
    let userId;
    let query;
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.user.role !== 'student') {
      parentId = req.user.id;
      userId = req.query.childId;
      query = { parentId, userId };
    } else {
      userId = req.user.id;
      query = { userId };
    }

    // Count total assignments for pagination metadata
    const total = await Assignment.countDocuments(query);

    // Get assignments with pagination
    const assignments = await Assignment.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: -1 }); // Optional: sort by due date descending

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.status(200).json({
      message: 'Assignments found successfully',
      assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}