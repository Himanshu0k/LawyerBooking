import Lawyer from '../../models/lawyer.js'
import hashPassword from '../../middlewares/password/hashPassword.js';

const lawyerController = {
   addLawyer : async (req, res) => {
      try {
         const lawyer = new Lawyer(req.body);
         const existLawyer = await Lawyer.findOne({email: lawyer.email})

         if(existLawyer) {
            return res.status(400).json({message:"lawyer already exists"})
         }
         else {
            lawyer.password = await hashPassword(lawyer.password)
            await lawyer.save()
            return res.status(200).json({message: "Lawyer is added" , lawyer})
         }
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   },

   getLawyer : async (req, res) => {
      try {
         const lawyers = await Lawyer.find()
         return res.status(200).json({message: "Fetched lawyers successfully", lawyers})
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   },

   deleteLawyer : async(req, res) => {
      try {
         const lawyer = await Lawyer.findOneAndDelete({email: req.body.email})
         return res.status(200).json({message: "lawyer deleted successfully" , lawyer})
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   }
}  

export default lawyerController