import express from 'express';
import * as contentController from '../controllers/contentController.js';

const router = express.Router();

// Content management routes
router.post('/content', contentController.upsertSubjectContent);
router.get('/content/:id', contentController.getSubjectContent);
router.delete('/content/:id', contentController.deleteSubjectContent);

export default router;