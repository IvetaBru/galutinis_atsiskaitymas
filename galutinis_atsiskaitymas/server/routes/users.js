import { Router } from "express";

import { login, loginAuto, register } from "../controllers/userController.js";

const router = Router();

//Login
router.post('/login', login);

//Login with JWT
router.get('/loginAuto', loginAuto);

//Register
router.post('/register', register);

export default router;