import express from 'express';
import { getMessagesInGroup} from '../controllers/messages.controller.js';


const router = express.Router();

// Routes
router.get('/messages/groupes/:groupId', getMessagesInGroup);


export default router;