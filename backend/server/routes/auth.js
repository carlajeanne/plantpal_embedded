import express from 'express'; 
import { register, login, refresh_token, protectedRoute, forgotPassword, verify_token  } from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refresh_token);
router.post('/verify-token', verify_token);
router.get('/protected', authenticateToken, protectedRoute);
router.post('/forgot-password', forgotPassword);

export default router; 
