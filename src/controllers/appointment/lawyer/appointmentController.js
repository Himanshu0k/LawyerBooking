import Appointment from "../../../models/appointment.js";
import Lawyer from "../../../models/lawyer.js";
import response from "../../../middlewares/response.js";

/**
 * @swagger
 * /lawyer/appointment/approveAppointment:
 *   post:
 *     summary: Approve an appointment
 *     description: Approves an appointment if the lawyer is authorized and the appointment exists.
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
 *                 description: ID of the appointment
 *               lawyerId:
 *                 type: string
 *                 description: ID of the lawyer
 *     responses:
 *       200:
 *         description: Appointment approved successfully
 *       400:
 *         description: Bad request due to missing parameters or invalid authorization
 *       500:
 *         description: Server error
 */
const appointmentController = {
   approveAppointment: async (req, res) => {
      try {
         const { appointmentId, lawyerId } = req.body;
  
         if (!appointmentId || !lawyerId) {
            return response.errorResponse(res, "Appointment ID and Lawyer ID are required");
         }
  
         const appointment = await Appointment.findById(appointmentId);
         if (!appointment) {
            return response.errorResponse(res, "Appointment not found");
         }
         if (!appointment.lawyerId) {
            return response.errorResponse(res, "This appointment does not have an assigned lawyer");
         }
         if (appointment.lawyerId.toString() !== lawyerId) {
            return response.errorResponse(res, "You are not authorized to approve this appointment");
         }
         if (appointment.status === "approved") {
            return response.successResponse(res, "Appointment is already approved", appointment);
         }
         appointment.status = "approved";
         await appointment.save();
  
         return response.successResponse(res, "Appointment approved successfully", appointment);
  
      } catch (error) {
         return response.errorResponse(res, error.message);
      }
  },

   /**
    * @swagger
    * /lawyer/appointment/getAppointment:
    *   get:
    *     summary: Get all appointments for a lawyer
    *     description: Retrieves all appointments associated with a lawyer based on their email.
    *     tags:
    *       - Appointments
    *     parameters:
    *       - in: body
    *         name: email
    *         required: true
    *         schema:
    *           type: string
    *           description: Lawyer's email
    *     responses:
    *       200:
    *         description: List of all appointments
    *       400:
    *         description: Lawyer does not exist
    *       404:
    *         description: No appointments found
    *       500:
    *         description: Server error
    */
   getAllApointments: async (req, res) => {
      try {
         const email = req.body.email
         const lawyer = await Lawyer.findOne({email: email})
         
         if(!lawyer) {
            return response.errorResponse(res, "Lawyer does not exist")
         }
         const appointments = await Appointment.find({lawyerId: lawyer._id})
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
   }
}

export default appointmentController;
