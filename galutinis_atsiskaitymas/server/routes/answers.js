import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAnswersForQuestion, addAnswerToQuestion, deleteAnswer, editAnswer } from '../controllers/answerController.js';

const router = Router();

//get all answers for specific question
router.get('/:questionId/answers', getAnswersForQuestion);

//add answer to specific question
router.post('/:questionId/answers', verifyJWT, addAnswerToQuestion);

//delete answer
router.delete('/:_id', verifyJWT, deleteAnswer);

//edit answer
router.patch('/:_id', verifyJWT, editAnswer);

export default router;