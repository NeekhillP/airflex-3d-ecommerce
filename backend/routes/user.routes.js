import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', userController.registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', userController.loginUserController)



export default router;
