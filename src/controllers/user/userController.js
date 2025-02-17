import User from "../../models/user.js"
import hashPassword from "../../middlewares/password/hashPassword.js"
import response from "../../middlewares/response.js"

const userController = {
   addUser : async (req, res) => {
      try {
         const user = new User(req.body)
         const userExist = await User.findOne({email: user.email})
         if(!userExist) {
            user.password = await hashPassword(user.password)
            await user.save()
            return response.successResponse(res, "User added successfully", user)
         }
         else {
            return response.errorResponse(res, "User already exists")
         }
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   getUser : async (req, res) => {
      try {
         const users = await User.find()
         return response.successResponse(res, "Users fetched successfully", users)
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   },

   deleteUser : async(req, res) => {
      try {
         const user = await User.findOneAndDelete({email: req.body.email})
         if(user) {
            return response.successResponse(res, "Users deleted successfully", user)
         }
         else {
            return response.errorResponse(res, "User does not exist")
         }
      }
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   }, 

   updateUser: async(req, res) => {
      try {
         const {userId, name, email, dob, password, phoneNumber, address, picturePath} = req.body
         if(!userId) {
            return response.errorResponse(res, "User id can not be empty")
         }
         const userExist = await User.findOne({
            email: email,
            _id: { $ne: userId}
         })
         if(userExist){
            return response.errorResponse(res, "User already exists with this email")
         }

         const user = await User.findById(userId)
         user.name = name
         user.email = email
         user.dob = dob
         user.password = password
         user.phoneNumber = phoneNumber
         user.address = address 
         user.picturePath = picturePath

         await user.save()
         return response.successResponse(res, "User updated successfully", user)
      }  
      catch(error) {
         return response.errorResponse(res, error.message)
      }
   }
}

export default userController;