import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";
import comparePassword from "../../middlewares/password/comparePassword.js";

const loginController = {
   userLogin: async (req, res) => {
      try {
         const {email, password} = req.body;
         const user = await User.findOne({email: email})
         if(!user) {
            return res.status(400).json({message: "User does not exist"});
         }
         else {
            if(await comparePassword(password, user.password)) {
               return res.status(200).json({message: 'Login successfull'})
            }
            else {
               return res.status(400).json({message: "Invalid Credentials"});
            }
         }
      }
      catch(error) {
         return res.status(500).json({message: error.message});
      }
   },

   lawyerLogin: async (req, res) => {
      try {
         const {email, password} = req.body;
         const lawyer = await Lawyer.findOne({email: email})
         if(!lawyer) {
            return res.status(400).json({message: "Lawyer does not exist"});
         }
         else {
            if(await comparePassword(password, lawyer.password)) {
               return res.status(200).json({message: 'Login successfull'})
            }
            else {
               return res.status(400).json({message: "Invalid Credentials"});
            }
         }
      }
      catch(error) {
         return res.status(500).json({message: error.message});
      }
   }
}

export default loginController;