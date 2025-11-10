import express from "express";
import { createPayment, getAllPayments, refundPayment, verifyPayment } from "../controllers/paymentController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

// Payment API
router.post("/create",authUser, createPayment);
router.post("/verify", authUser, verifyPayment);
router.get("/all", getAllPayments); 
router.post("/refund",authUser, refundPayment);
// router.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhook);



export default router;
