import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAllLikes, toggleLike, getUserLikes, getAllUserLikedQuestions } from '../controllers/likesController.js';

const router = Router();

//get all likes count
router.get('/count/:questionId', getAllLikes);

//Like/unlike
router.post('/toggle/:questionId', verifyJWT, toggleLike);

//User's liked questions
router.get('/user-liked/:questionId', verifyJWT, getUserLikes);

//User's all liked questions
router.get('/liked-questions', verifyJWT, getAllUserLikedQuestions);

export default router;