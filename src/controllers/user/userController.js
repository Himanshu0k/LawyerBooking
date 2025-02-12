import User from "../../models/user.js"
import hashPassword from "../../middlewares/password/hashPassword.js"

const userController = {
   addUser : async (req, res) => {
      try {
         const user = new User(req.body)
         const userExist = await User.findOne({email: user.email})
         if(!userExist) {
            user.password = await hashPassword(user.password)
            await user.save()
            return res.status(200).json({message: "User added successfully", user})
         }
         else {
            return res.status(400).json({message: "User already exists"})
         }
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   },

   getUser : async (req, res) => {
      try {
         const users = await User.find()
         return res.status(200).json({message: "Fetched users successfully", users})
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   },

   deleteUser : async(req, res) => {
      try {
         // const email = req.body.email
         const user = await User.findOneAndDelete({email: req.body.email})
         if(user) {
            return res.status(200).json({message: "user deleted successfully", user})
         }
         else {
            return res.status(400).json({message: "User does not exist"})
         }
      }
      catch(error) {
         return res.status(500).json({message: error.message})
      }
   }
}

export default userController;