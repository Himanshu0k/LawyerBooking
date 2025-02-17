import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";
import comparePassword from "../../middlewares/password/comparePassword.js";
import response from "../../middlewares/response.js";
import { generateToken } from "../../middlewares/tokenVarification.js";

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
               const token = generateToken({ email: user.email, id: user._id , role: user.role});
               return response.successResponse(res, "Login successfull, Welcome USER", token)
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
               const token = generateToken({ email: lawyer.email, id: lawyer._id , role: lawyer.role});
               return response.successResponse(res, "Login successfull", token)
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