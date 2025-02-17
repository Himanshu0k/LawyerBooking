import express from 'express';
const router = express.Router();

import lawyerRoutes from '../controllers/lawyer/lawyerRoutes.js'
import loginRoutes from '../controllers/login/loginRoutes.js'
import userRoutes from '../controllers/user/userRoutes.js'

router.use('/lawyer', lawyerRoutes)
router.use('/login', loginRoutes)
router.use('/user', userRoutes)

export default router;