import express from "express";
import { generateQRCode } from "../controllers/QRCodeController.js";


import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET /qrcode/:sessionId - only teachers can generate QR code
router.get("/:sessionId", auth, authorize("teacher"), generateQRCode);

export default router;
