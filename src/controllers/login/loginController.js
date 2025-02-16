import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";
import comparePassword from "../../middlewares/password/comparePassword.js";
import response from "../../middlewares/response.js";

const loginController = {
   userLogin: async (req, res) => {
      try {
         const {email, password} = req.body;
         const user = await User.findOne({email: email})
         if(!user) {
            return response.errorResponse(res, "User does not exist")
         }
         else {
            if(await comparePassword(password, user.password)) {
               // return res.status(200).json({message: 'Login successfull'})
               return response.successResponse(res, "Login successfull")
            }
            else {
               return response.errorResponse(res, "Invalid Credentials")
            }
         }
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   lawyerLogin: async (req, res) => {
      try {
         const {email, password} = req.body;
         const lawyer = await Lawyer.findOne({email: email})
         if(!lawyer) {
            return response.errorResponse(res, "Lawyer does not exist")
         }
         else {
            if(await comparePassword(password, lawyer.password)) {
               // return res.status(200).json({message: 'Login successfull'})
               return response.successResponse(res, "Login successfull")
            }
            else {
               return response.errorResponse(res, "Invalid Credentials")
            }
         }
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   }
}

export default loginController;