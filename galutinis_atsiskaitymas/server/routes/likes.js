import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAllLikes, toggleLike, getUserLikes } from '../controllers/likesController.js';

const router = Router();

//Gauti bendrą likes skaičių
router.get('/count/:questionId', getAllLikes);

//Like/unlike žymėjimas
router.post('/toggle/:questionId', verifyJWT, toggleLike);

//Prisijungusio vartotojo likes
router.get('/user-liked/:questionId', verifyJWT, getUserLikes);

export default router;