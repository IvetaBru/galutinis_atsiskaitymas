import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { addNewQuestion, deleteQuestion, editQuestion, getAllQuestions, getSpecQuestion } from '../controllers/questionController.js';

const router = Router();

//get all questions
router.get('', getAllQuestions);

//get single question
router.get('/:_id', getSpecQuestion);

//add new question
router.post('', verifyJWT, addNewQuestion);

//delete question
router.delete('/:_id', verifyJWT, deleteQuestion);

//edit question
router.patch('/:_id', verifyJWT, editQuestion);

export default router;