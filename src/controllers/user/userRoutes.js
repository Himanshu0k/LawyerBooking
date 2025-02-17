import express from 'express';
const router = express.Router();

import userController from './userController.js';
import appointmentRoutes from '../appointment/user/appointmentRoutes.js'
import { verifyToken } from '../../middlewares/tokenVarification.js';
import { verifyRole } from '../../middlewares/roleVerification.js';

router.post('/addUser', userController.addUser)
router.get('/getUser', verifyToken, verifyRole(["user"]), userController.getUser)
router.delete('/deleteUser', verifyToken, verifyRole(["user"]), userController.deleteUser)
router.patch('/updateUser', verifyToken, verifyRole(["user"]), userController.updateUser)
router.use('/appointment', verifyToken, verifyRole(["user"]), appointmentRoutes)

export default router;