import Appointment from "../../models/appointment.js";
import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";

const appointmentController = {
   bookAppointment: async (req, res) => {
      const appointment = new Appointment(req.body)

      if(appointment.role !== "USER") {
         return res.status(400).json({message: "You cannot book an appointment"})
      }

      const checkLawyer = await Lawyer.findOne({_id: appointment.lawyerId})
      if(!checkLawyer) {
         return res.status(400).json({message: "Lawyer does not exist"})
      }
      else {
         const checkAvailability = await Appointment.findOne({lawyerId: appointment.lawyerId, date: appointment.date, time: appointment.time})

         if(checkAvailability) {
            return res.status(400).json({message: "Not available"})
            
         }
         else {
            await appointment.save()
            return res.status(200).json({message: "Appointment booked successfully"})
         }
      }
   },

   getAllApointments: async (req,res) => {
      try {
         const email = req.body.email
         const user = await User.findOne({email: email})
         
         if(!user) {
            return res.status(400).json({message: "User does not exist"})
         }

         const appointments = await Appointment.find({userId: user._id})
         if(appointments.length > 0) {
            return res.status(200).json({message: "All Apointments", appointments})
         }
         else {
            return res.status(400).json({message: "No appointments found"})
         }

         
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   }

}

export default appointmentController