import express from 'express';
import { 
    createChapter,
    getAllChapters,
    getChapterById,
    updateChapter,
    toggleChapterPublish,
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
    deleteChapter,
    getAllChaptersBySubjectAndClassLevel,
    getLessonsByChapter,
    getLessonByIdAndChapterId,
    getExerciseByLessonAndExerciseId,
    getQuizzByLessonAndQuizzId,
    createAssignment,
    getAssignments,
    updateStatus
 } from '../controllers/courseController.js';
const router = express.Router();

// Chapter routes (main routes now)
router.post('/', createChapter);
router.get('/', getAllChapters);
router.get('/chapters/:subject/:classLevel', getAllChaptersBySubjectAndClassLevel);
router.get('/:chapterId', getChapterById);
router.put('/:chapterId', updateChapter);
router.patch('/:chapterId/toggle-publish', toggleChapterPublish);
router.delete('/:chapterId', deleteChapter);

// Lesson routes
router.post('/:chapterId/lessons', createLesson);
router.get('/student/:chapterId/lessons', getLessonsByChapter);
router.get('/student/lessons/:lessonId',getLessonById) // Assuming you have a function to get all lessons in a chapter, adjust as needed
router.get('/:chapterId/lessons/:lessonId', getLessonByIdAndChapterId);
router.get('/student/lessons/:lessonId/exercises/:exerciseId',getExerciseByLessonAndExerciseId)
router.get('/student/lessons/:lessonId/quizzes/:quizzId',getQuizzByLessonAndQuizzId) // Assuming you have a function to get all lessons in a chapter, adjust as needed
router.put('/:chapterId/lessons/:lessonId', updateLesson);
router.post('/student/assignments', createAssignment)
router.get('/student/assignments',getAssignments)
router.post('/student/assignments/:id', updateStatus)
router.delete('/:chapterId/lessons/:lessonId', deleteLesson);

export default router;