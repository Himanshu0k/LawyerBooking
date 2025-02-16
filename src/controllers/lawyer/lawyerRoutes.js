import express from 'express';
const router = express.Router();

import lawyerController from './lawyerController.js';
import appointmentRoutes from '../appointment/lawyer/appointmentRoutes.js'
import { verifyToken } from '../../middlewares/tokenVarification.js';
import { verifyRole } from '../../middlewares/roleVerification.js';

router.post('/addLawyer', lawyerController.addLawyer)
router.get('/getLawyer', verifyToken, verifyRole(["lawyer"]), lawyerController.getLawyer)
router.delete('/deleteLawyer', verifyToken, verifyRole(["lawyer"]), lawyerController.deleteLawyer)
router.use('/appointment', verifyToken, verifyRole(["lawyer"]), appointmentRoutes)

export default router;