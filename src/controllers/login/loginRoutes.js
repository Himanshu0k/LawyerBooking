import express from 'express';
const router = express.Router();

import loginController from './loginController.js';

router.post('/user', loginController.userLogin)
router.post('/lawyer', loginController.lawyerLogin)


export default router;