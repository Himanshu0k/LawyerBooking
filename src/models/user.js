import {mongoose} from 'mongoose';

const userSchema = new mongoose.Schema({
   name : {
      type:String, 
      required: true,
      trim: true,
      min: 3,
      max: 50
   },
   dob: {
      type: String, 
      required: true,
      trim: true,
   },
   email:{
      type: String,
      required: true, 
      unique: true,
      trim: true, 
      max: 100
   },
   password:{
      type: String,
      required: true, 
      trim: true,
      min: 6,
      max: 20
   },
   phoneNumber:{
      type: String,
      required: true,
      trim: true,
   },
   address:{
      type: String,
      required: true,
      trim: true,
   },
   picturePath:{
      type: String,
      default: "",
   }
})

const User = mongoose.model('User', userSchema);
export default User;