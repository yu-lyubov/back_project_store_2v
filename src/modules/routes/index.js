import Router from 'express';
import {
  registrationUser,
  loginUser,
  getUserData,
  changeUserData,
  changePassword,
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/token.middleware.js';

const router = Router();

router.post('/registration', registrationUser);
router.post('/login', loginUser);
router.get('/user', authenticateToken, getUserData);
router.patch('/changeUser', authenticateToken, changeUserData);
router.patch('/changePassword', authenticateToken, changePassword);

export default router;
