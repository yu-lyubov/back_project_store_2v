import Router from 'express';
import { registrationUser, loginUser } from '../controllers/user.controller.js';

const router = Router();

router.post('/registration', registrationUser);
router.post('/login', loginUser);

export default router;
