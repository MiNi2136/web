import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

function verifyToken(req, res, next) {
  // Check token in cookies or Authorization header (Bearer token)
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data (payload) to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
}

const JWT = {
  verifyToken,
  generateToken,
};

export default JWT;
