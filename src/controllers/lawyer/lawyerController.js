import Lawyer from '../../models/lawyer.js'
import response from '../../middlewares/response.js';
import hashPassword from '../../middlewares/password/hashPassword.js';

const lawyerController = {
   addLawyer : async (req, res) => {
      try {
         const lawyer = new Lawyer(req.body);
         const existLawyer = await Lawyer.findOne({email: lawyer.email})

         if(existLawyer) {
            return response.errorResponse(res,"Lawyer already exists")
         }
         else {
            lawyer.password = await hashPassword(lawyer.password)
            await lawyer.save()
            return response.successResponse(res, "Lawyer is added", lawyer)
         }
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   getLawyer : async (req, res) => {
      try {
         const lawyers = await Lawyer.find()
         return response.successResponse(res, "Fetched lawyers successfully", lawyers)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   deleteLawyer : async(req, res) => {
      try {
         const lawyer = await Lawyer.findOneAndDelete({email: req.body.email})
         if(!lawyer) {
            return response.errorResponse(res, "Lawyer does not exist")
         }
         return response.successResponse(res, "Lawyer deleted successfully", lawyer)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   updateLawyer: async (req, res) => {
      try {
        const { lawyerId, name, email, dob, password, phoneNumber, address, picturePath, fees, experience} = req.body;
    
      if (!lawyerId) {
         return response.errorResponse(res, "Lawyer id cannot be empty");
      }
    
      const lawyerExist = await Lawyer.findOne({ 
         email: email, 
         _id: { $ne: lawyerId } 
      });
      if (lawyerExist) {
         return response.errorResponse(res, "Lawyer already exists with this email");
      }
    
      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
         return response.errorResponse(res, "Lawyer not found");
      }
    
      lawyer.name = name ;
      lawyer.email = email
      lawyer.dob = dob 
      lawyer.password = password
      lawyer.phoneNumber = phoneNumber
      lawyer.address = address 
      lawyer.picturePath = picturePath
      lawyer.fees = fees 
      lawyer.experience = experience
    
      await lawyer.save();
    
      return response.successResponse(res, "Lawyer updated successfully", lawyer);
      } 
      catch (error) {
         console.error(error);
         return response.errorResponse(res, error.message);
      }
   }
    
}  

export default lawyerController