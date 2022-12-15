import Router from 'express';
import {
  registrationUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserData,
  changeUserData,
  changePassword,
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/token.middleware.js';

const router = Router();

router.post('/registration', registrationUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh', refreshToken);
router.get('/user', authenticateToken, getUserData);
router.patch('/changeUser', authenticateToken, changeUserData);
router.patch('/changePassword', authenticateToken, changePassword);

export default router;
