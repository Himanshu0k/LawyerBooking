import mongoose from "mongoose"

const appointmentSchema = mongoose.Schema({
   lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lawyer',
      required: true,
      trim: true
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true
   },
   date: {
      type: String, 
      required: true,
      trim: true
   },
   time: {
      type: String,
      required: true,
      trim: true
   },
   bookingCause: {
      type: String, 
      required: true,
      trim: true
   },
   role: {
      type: String,
      default: "USER"
   },
   status: {
      enum: ["pending", "approved", "rejected"],
      type: String,
      default: "pending"
   }
})

const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment