import { Router } from "express";

import { verifyJWT } from '../middleware/auth.js';
import { login, loginAuto, register, editUserInfo } from "../controllers/userController.js";

const router = Router();

//Login
router.post('/login', login);

//Login with JWT
router.get('/loginAuto', loginAuto);

//Register
router.post('/register', register);

//Edit user info
router.patch('/editInfo', verifyJWT, editUserInfo);

export default router;