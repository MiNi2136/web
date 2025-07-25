import dotenv from "dotenv";
dotenv.config();
import Student from "../model/Student.js";
import {Teacher } from "../model/Teacher.js";
import JWT from "../middleware/JWT.js";
import nodemailer from "nodemailer";

// Login function
async function Login(req, res) {
  const { email, password } = req.body;
  let type = "student";

  let user = await Student.findOne({ email });
  if (!user) {
    type = "teacher";
    user = await Teacher.findOne({ email });
  }

  if (user) {
    if (user.password === password) { // You should hash passwords for production!
      const token = JWT.generateToken({ email: user.email });
      user.type = type;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ user, type, token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } else {
    res.status(400).json({ message: "No such user" });
  }
}

// Signup function
async function Signup(req, res) {
  const { name, email, pno, dob, password, type } = req.body;

  if (type === "student") {
    const existingUser = await Student.findOne({ email }).exec();
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new Student({ name, email, pno, dob, password });
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const existingUser = await Teacher.findOne({ email }).exec();
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new Teacher({ name, email, pno, dob, password });
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

// Forgot Password
async function ForgotPassword(req, res) {
  const { email, password } = req.body;
  let user = await Student.findOneAndUpdate({ email }, { password }).exec();

  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { password }).exec();
  }

  if (user) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "No such user" });
  }
}

// Send mail (optional)
async function SendMail(req, res) {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for registration",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(200).json({ message: "OTP sent successfully", otp });
    }
  });
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  SendMail,
};

export default UserController;

