import Appointment from "../../models/appointment.js";
import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";
import response from "../../middlewares/response.js";

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
            return response.successResponse(res, "Appointment booked successfully")
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
   }

}

export default appointmentController