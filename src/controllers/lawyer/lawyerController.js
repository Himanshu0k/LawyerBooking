import Lawyer from '../../models/lawyer.js';
import response from '../../middlewares/response.js';
import hashPassword from '../../middlewares/password/hashPassword.js';

const lawyerController = {
  /**
   * @swagger
   * /lawyer/addLawyer:
   *   post:
   *     summary: Add a new lawyer
   *     description: Registers a new lawyer if they don't already exist.
   *     tags:
   *       - Lawyers
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
   *               password:
   *                 type: string
   *               dob:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *               fees:
   *                 type: number
   *               experience:
   *                 type: number
   *     responses:
   *       200:
   *         description: Lawyer added successfully
   *       400:
   *         description: Lawyer already exists
   */
  addLawyer: async (req, res) => {
    try {
      const lawyer = new Lawyer(req.body);
      const existLawyer = await Lawyer.findOne({ email: lawyer.email });

      if (existLawyer) {
        return response.errorResponse(res, 'Lawyer already exists');
      } else {
        lawyer.password = await hashPassword(lawyer.password);
        await lawyer.save();
        return response.successResponse(res, 'Lawyer is added', lawyer);
      }
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/getLawyer:
   *   get:
   *     summary: Get all lawyers
   *     description: Retrieves all registered lawyers.
   *     tags:
   *       - Lawyers
   *     responses:
   *       200:
   *         description: List of all lawyers
   */
  getLawyer: async (req, res) => {
    try {
      const lawyers = await Lawyer.find();
      return response.successResponse(res, 'Fetched lawyers successfully', lawyers);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/deleteLawyer:
   *   delete:
   *     summary: Delete a lawyer
   *     description: Deletes a lawyer by email.
   *     tags:
   *       - Lawyers
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
   *         description: Lawyer deleted successfully
   *       400:
   *         description: Lawyer does not exist
   */
  deleteLawyer: async (req, res) => {
    try {
      const lawyer = await Lawyer.findOneAndDelete({ email: req.body.email });
      if (!lawyer) {
        return response.errorResponse(res, 'Lawyer does not exist');
      }
      return response.successResponse(res, 'Lawyer deleted successfully', lawyer);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/updateLawyer:
   *   patch:
   *     summary: Update lawyer details
   *     description: Updates information of an existing lawyer by ID.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
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
   *               fees:
   *                 type: number
   *               experience:
   *                 type: number
   *     responses:
   *       200:
   *         description: Lawyer updated successfully
   *       400:
   *         description: Lawyer not found or email already in use
   */
  updateLawyer: async (req, res) => {
    try {
      const {
        lawyerId,
        name,
        email,
        dob,
        password,
        phoneNumber,
        address,
        picturePath,
        fees,
        experience,
      } = req.body;

      if (!lawyerId) {
        return response.errorResponse(res, 'Lawyer id cannot be empty');
      }

      const lawyerExist = await Lawyer.findOne({
        email: email,
        _id: { $ne: lawyerId },
      });
      if (lawyerExist) {
        return response.errorResponse(res, 'Lawyer already exists with this email');
      }

      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
        return response.errorResponse(res, 'Lawyer not found');
      }

      lawyer.name = name;
      lawyer.email = email;
      lawyer.dob = dob;
      lawyer.password = password;
      lawyer.phoneNumber = phoneNumber;
      lawyer.address = address;
      lawyer.picturePath = picturePath;
      lawyer.fees = fees;
      lawyer.experience = experience;

      await lawyer.save();

      return response.successResponse(res, 'Lawyer updated successfully', lawyer);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/getLawyerById:
   *   get:
   *     summary: Get lawyer by ID
   *     description: Fetch a lawyer's profile using their ID.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lawyer found successfully
   *       400:
   *         description: Lawyer not found
   */
  getLawyerById: async (req, res) => {
    try {
      const { lawyerId } = req.body;
      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
        return response.errorResponse(res, "Lawyer not found");
      }
      return response.successResponse(res, "Lawyer found successfully", lawyer);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/getLawyerByName:
   *   get:
   *     summary: Get lawyer by name
   *     description: Fetch lawyers by a partial or full name search.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerName:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lawyers found
   *       400:
   *         description: No lawyers found
   */
  getLawyerByName: async (req, res) => {
    try {
      const { lawyerName } = req.body;
      if (!lawyerName) {
        return response.errorResponse(res, "Lawyer name is required");
      }
      const lawyers = await Lawyer.find({ name: { $regex: new RegExp(lawyerName, "i") } });
      if (lawyers.length > 0) {
        return response.successResponse(res, "Lawyers found", lawyers);
      }
      return response.errorResponse(res, "No lawyers found with this name");
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },
};

export default lawyerController;
