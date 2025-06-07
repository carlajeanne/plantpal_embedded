import express from 'express'; 
import path from 'path';
import { register, login, refresh_token, protectedRoute, forgotPassword, resetPassword, verify_token, userDetails, updateUserDetailsWithProfilePicture  } from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/uploads/profile-pictures', express.static(path.join(process.cwd(), 'uploads', 'profile-pictures')));

router.post('/register', register);
router.post('/login', login);
router.get('/userDetails/:id', userDetails);
//router.put('/updateUserDetails/:id', updateUserDetails);
router.put('/updateUserDetails/:id', updateUserDetailsWithProfilePicture);
router.post('/refresh-token', refresh_token);
router.post('/verify-token', verify_token);
router.get('/protected', authenticateToken, protectedRoute);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router; 
