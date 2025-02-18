import Appointment from "../../../models/appointment.js";
import User from "../../../models/user.js";
import Lawyer from "../../../models/lawyer.js";
import response from "../../../middlewares/response.js";

const appointmentController = {
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
            // return res.status(200).json({message: "Appointment booked successfully"})
         }
      }
   },

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

         return response.successResponse(res, "Apoointment updated successfully", appointment)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

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

export default appointmentController