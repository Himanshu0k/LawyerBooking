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
         return response.successResponse(res, "Lawyer deleted successfully", lawyer)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   }
}  

export default lawyerController