import User from "../../models/user.js";
import hashPassword from "../../middlewares/password/hashPassword.js";
import response from "../../middlewares/response.js";

const userController = {
  /**
   * @swagger
   * /user/addUser:
   *   post:
   *     summary: Add a new user
   *     description: Registers a new user with hashed password.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               dob:
   *                 type: string
   *               phoneNumber: 
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User added successfully
   *       400:
   *         description: User already exists
   */
  addUser: async (req, res) => {
    try {
      const user = new User(req.body);
      const userExist = await User.findOne({ email: user.email });
      if (!userExist) {
        user.password = await hashPassword(user.password);
        await user.save();
        return response.successResponse(res, "User added successfully", user);
      } else {
        return response.errorResponse(res, "User already exists");
      }
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /user/getUser:
   *   get:
   *     summary: Get all users
   *     description: Retrieves a list of all users.
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Users fetched successfully
   */
  getUser: async (req, res) => {
    try {
      const users = await User.find();
      return response.successResponse(res, "Users fetched successfully", users);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /user/deleteUser:
   *   delete:
   *     summary: Delete a user
   *     description: Deletes a user by email.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: User does not exist
   */
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ email: req.body.email });
      if (user) {
        return response.successResponse(res, "User deleted successfully", user);
      } else {
        return response.errorResponse(res, "User does not exist");
      }
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /user/updateUser:
   *   patch:
   *     summary: Update a user
   *     description: Updates user details by ID.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               dob:
   *                 type: string
   *               password:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: User already exists with this email
   */
  updateUser: async (req, res) => {
    try {
      const { userId, name, email, dob, password, phoneNumber, address, picturePath } = req.body;
      if (!userId) {
        return response.errorResponse(res, "User ID cannot be empty");
      }
      const userExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (userExist) {
        return response.errorResponse(res, "User already exists with this email");
      }
      const user = await User.findById(userId);
      user.name = name;
      user.email = email;
      user.dob = dob;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.address = address;
      user.picturePath = picturePath;
      await user.save();
      return response.successResponse(res, "User updated successfully", user);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },
};

export default userController;
