import Appointment from "../../../models/appointment.js";
import Lawyer from "../../../models/lawyer.js";
import response from "../../../middlewares/response.js";

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

export default appointmentController