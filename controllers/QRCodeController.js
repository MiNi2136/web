import QRCode from "qrcode";

export const generateQRCode = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionUrl = `${process.env.CLIENT_URL}/session/${sessionId}`; // URL students will scan

    // Generate QR code as Data URL (base64 image)
    const qrCodeDataURL = await QRCode.toDataURL(sessionUrl);

    // Send QR code image data URL as JSON
    res.status(200).json({ qrCode: qrCodeDataURL });
  } catch (err) {
    console.error("QR code generation error:", err);
    res.status(500).json({ message: "Failed to generate QR code" });
  }
};
