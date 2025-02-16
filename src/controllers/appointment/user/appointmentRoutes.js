import express from 'express'
const router = express.Router()

import appointmentController from './appointmentController.js'

router.post('/bookAppointment', appointmentController.bookAppointment)
router.get('/getAppointment', appointmentController.getAllApointments)
router.patch('/updateAppointment', appointmentController.updateAppointment)
router.delete('/deleteAppointment', appointmentController.deleteAppointment)

export default router
