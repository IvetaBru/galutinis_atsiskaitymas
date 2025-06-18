import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAllLikes, toggleLike, getUserLikes, getAllUserLikedQuestions } from '../controllers/likesController.js';

const router = Router();

//Gauti bendrą likes skaičių
router.get('/count/:questionId', getAllLikes);

//Like/unlike žymėjimas
router.post('/toggle/:questionId', verifyJWT, toggleLike);

//Prisijungusio vartotojo pamėgti klausimai
router.get('/user-liked/:questionId', verifyJWT, getUserLikes);

//Prisijungusio vartotojo visi pamėgti klausimai
router.get('/liked-questions', verifyJWT, getAllUserLikedQuestions);

export default router;