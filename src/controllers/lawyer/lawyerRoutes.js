import express from 'express';
const router = express.Router();

import lawyerController from './lawyerController.js';

router.post('/addLawyer', lawyerController.addLawyer)
router.get('/getLawyer', lawyerController.getLawyer)
router.delete('/deleteLawyer', lawyerController.deleteLawyer)

export default router;