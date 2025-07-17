import { Teacher } from '../model/Teacher.js';
import Student from '../model/Student.js';
import jwt from 'jsonwebtoken';

// Authentication middleware
export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find user in Teacher collection first using email
    let user = await Teacher.findOne({ email: decoded.email }).select('-password');
    if (user) {
      req.user = user.toObject();  // convert to plain object
      req.user.type = 'teacher';   // set user type
      return next();
    }

    // If not teacher, try Student
    user = await Student.findOne({ email: decoded.email }).select('-password');
    if (user) {
      req.user = user.toObject();
      req.user.type = 'student';   // set user type
      return next();
    }

    return res.status(401).json({ message: 'User not found, authorization denied.' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token, authorization denied.' });
  }
};

// Authorization middleware
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
    }
    next();
  };
};
