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
   },
/*
   updateAppointment: async (req, res) => {
      try {
          const { appointmentId, date, time, cause } = req.body;
          console.log("Received update request:", req.body); // Log incoming request data
  
          // 1️⃣ Validate appointmentId
          if (!appointmentId) {
              console.log("❌ Missing appointmentId");
              return response.errorResponse(res, "Appointment ID is required");
          }
  
          // 2️⃣ Find existing appointment
          const appointment = await Appointment.findById(appointmentId);
          if (!appointment) {
              console.log(`❌ Appointment not found for ID: ${appointmentId}`);
              return response.errorResponse(res, "Appointment not found");
          }
          console.log("✅ Existing appointment found:", appointment);
  
          // 3️⃣ Check if the new time slot is available (if date or time is being updated)
          if (date || time) {
              const checkAvailability = await Appointment.findOne({
                  lawyerId: appointment.lawyerId,
                  date: date || appointment.date,
                  time: time || appointment.time,
                  _id: { $ne: appointmentId }, // Exclude the current appointment from check
              });
  
              if (checkAvailability) {
                  console.log("❌ Time slot conflict detected:", checkAvailability);
                  return response.errorResponse(res, "New time slot is not available");
              }
          }
  
          // 4️⃣ Prepare update data (only update provided fields)
          const updateData = {};
          if (date) updateData.date = date;
          if (time) updateData.time = time;
          if (cause) updateData.cause = cause;
  
          console.log("🔄 Update data to be applied:", updateData);
  
          // 5️⃣ Update the appointment
          const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId }, // Filter
            { $set: updateData }, // Update
            { new: true, runValidators: true } // Return the updated document, validate fields
        );
  
          if (!updatedAppointment) {
              console.log("❌ Update operation failed");
              return response.errorResponse(res, "Failed to update appointment");
          }
  
          console.log("✅ Appointment updated successfully:", updatedAppointment);
  
          // 6️⃣ Send success response
          return response.successResponse(res, "Appointment updated successfully", updatedAppointment);
  
      } catch (error) {
          console.error("🔥 Update Error:", error);
          return response.errorResponse(res, "Internal Server Error");
      }
  },
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
      } catch (error) {
         return response.errorResponse(res, error.message);
      }
   }
}

export default appointmentController