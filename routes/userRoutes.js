import { Router } from "express";
const router = Router();

import UserController from "../controllers/UserController.js";
import JWT from "../middleware/JWT.js";

// Signup route
router.post("/signup", UserController.Signup);

// Login route (renamed from signin to login)
router.post("/login", UserController.Login);

// Forgot password
router.post("/forgotpassword", UserController.ForgotPassword);

// (Optional) Send mail for OTP (if you want to keep)
router.post("/sendmail", UserController.SendMail);

export default router;
