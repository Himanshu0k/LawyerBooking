import express from 'express';
const router = express.Router();

import userController from './userController.js';
import appointmentRoutes from '../appointment/appointmentRoutes.js'

router.post('/addUser', userController.addUser)
router.get('/getUser', userController.getUser)
router.delete('/deleteUser', userController.deleteUser)
router.use('/appointment', appointmentRoutes)

export default router;