import express from 'express'
const router = express.Router()

import appointmentController from './appointmentController.js'

router.post('/approveAppointment', appointmentController.approveAppointment)
router.get('/getAppointment', appointmentController.getAllApointments)

export default router