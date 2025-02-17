// JWT authentication and authorisation
/* global process */
import jwt from 'jsonwebtoken';
import response from './response.js';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Generate Token
const generateToken = (payload) => {
   return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   if (!authHeader) {
        return response.errorResponse(res, 'Access denied, authorization header missing');
    }

   const token = authHeader.split(' ')[1];

   jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
         console.error("JWT Verification Error:", err);
         return response.errorResponse(res, 'Invalid Token');
      }
      req.user = decoded;
      next();
   });
};

export { generateToken, verifyToken };
