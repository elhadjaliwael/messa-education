import express from 'express';
import * as chapterController from '../controllers/chapterController.js';

const router = express.Router();

// Chapter routes
router.post('/subjects/:subjectId/chapters', chapterController.createChapter);
router.get('/subjects/:subjectId/chapters', chapterController.getChaptersBySubject);
router.get('/chapters/:id', chapterController.getChapterById);
router.put('/chapters/:id', chapterController.updateChapter);
router.delete('/chapters/:id', chapterController.deleteChapter);

export default router;