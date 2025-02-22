import Appointment from "../../../models/appointment.js";
import User from "../../../models/user.js";
import Lawyer from "../../../models/lawyer.js";
import response from "../../../middlewares/response.js";

const appointmentController = {
   /**
    * @swagger
    * /user/appointment/bookAppointment:
    *   post:
    *     summary: Book an appointment
    *     description: Allows a user to book an appointment with a lawyer.
    *     tags:
    *       - Appointments
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               lawyerId:
    *                 type: string
    *               date:
    *                 type: string
    *               time:
    *                 type: string
    *     responses:
    *       200:
    *         description: Appointment booked successfully
    *       400:
    *         description: Bad request due to invalid input
    */
   bookAppointment: async (req, res) => {
      const appointment = new Appointment(req.body)

      if(appointment.role !== "USER") {
         return response.errorResponse(res, "You cannot book an appointment")
      }

      const checkLawyer = await Lawyer.findOne({_id: appointment.lawyerId})
      if(!checkLawyer) {
         return response.errorResponse(res, "Lawyer does not exist")
      }
      else {
         const checkAvailability = await Appointment.findOne({lawyerId: appointment.lawyerId, date: appointment.date, time: appointment.time})

         if(checkAvailability) {
            return response.errorResponse(res, "Not available")
         }
         else {
            await appointment.save()
            return response.successResponse(res, "Appointment booked successfully", appointment)
         }
      }
   },

   /**
    * @swagger
    * /user/appointment/getAppointment:
    *   get:
    *     summary: Get all appointments for a user
    *     description: Retrieves all appointments associated with a user based on their email.
    *     tags:
    *       - Appointments
    *     parameters:
    *       - in: body
    *         name: email
    *         required: true
    *         schema:
    *           type: string
    *     responses:
    *       200:
    *         description: List of all appointments
    *       400:
    *         description: User does not exist
    */
   getAllApointments: async (req,res) => {
      try {
         const email = req.body.email
         const user = await User.findOne({email: email})
         
         if(!user) {
            return response.errorResponse(res, "User does not exist")
         }

         const appointments = await Appointment.find({userId: user._id})
         if(appointments.length > 0) {
            return response.successResponse(res, "All appointments", appointments)
         }
         else {
            return response.errorResponse(res, "No appointments found")
         }
         
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   /**
    * @swagger
    * /user/appointment/updateAppointment:
    *   patch:
    *     summary: Update an appointment
    *     description: Allows a user to update an existing appointment.
    *     tags:
    *       - Appointments
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               appointmentId:
    *                 type: string
    *               date:
    *                 type: string
    *               time:
    *                 type: string
    *               bookingCause:
    *                 type: string
    *     responses:
    *       200:
    *         description: Appointment updated successfully
    *       400:
    *         description: Appointment cannot be booked on the required schedule
    */
   updateAppointment: async (req, res) => {
      try{
         const {appointmentId, date, time, bookingCause} = req.body;
         if(!appointmentId) {
            return response.errorResponse(res, "Appointment Id is required")
         }

         const appointment = await Appointment.findOne({_id: appointmentId})
         if(!appointment) {
            return response.errorResponse(res, "Appointment does not exist")
         }

         appointment.date = date
         appointment.time = time 
         appointment.bookingCause = bookingCause 

         const checkAvailability = await Appointment.findOne({
            lawyerId: appointment.lawyerId, 
            date: appointment.date, 
            time: appointment.time,
            _id: {$ne: appointmentId}
         })
         if(checkAvailability){
            return response.errorResponse(res, "Appointment cannot be booked on the required schedule")
         }         
         await appointment.save()

         return response.successResponse(res, "Appointment updated successfully", appointment)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   /**
    * @swagger
    * /user/appointment/deleteAppointment:
    *   delete:
    *     summary: Delete an appointment
    *     description: Deletes an existing appointment by ID.
    *     tags:
    *       - Appointments
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               appointmentId:
    *                 type: string
    *     responses:
    *       200:
    *         description: Appointment deleted successfully
    *       400:
    *         description: Appointment not found
    */
   deleteAppointment: async (req, res) => {
      try {
         const { appointmentId } = req.body;
         const appointment = await Appointment.findById(appointmentId);
         if (!appointment) {
            return response.errorResponse(res, "Appointment not found");
         }
         await Appointment.findByIdAndDelete(appointmentId);
         return response.successResponse(res, "Appointment deleted successfully");
      } 
      catch (error) {
         return response.errorResponse(res, error.message);
      }
   }
}

export default appointmentController;
