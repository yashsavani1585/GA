// routes/formsRouter.js
import express from "express";
import {
  createPersonalized,
  createInquiry,
  listPersonalized,
  updatePersonalized,
  listInquiries,
  updateInquiry,
} from "../controllers/forms.Controller.js";
import adminAuth from "../middleware/adminAuth.js";
import { uploadFormFile } from "../middleware/cloudinaryUpload.js";

const formsRouter = express.Router();

// ---------------- Public Features ----------------

// Personalized jewellery request (with optional file upload)
formsRouter.post("/personalized", uploadFormFile, createPersonalized);

// General inquiry form (no file by default)
formsRouter.post("/inquiry", createInquiry);

// ---------------- Admin Features ----------------

// Admin: view all personalized requests
formsRouter.get("/admin/personalized", adminAuth, listPersonalized);

// Admin: update status/notes of a personalized request
formsRouter.patch("/admin/personalized/:id", adminAuth, updatePersonalized);

// Admin: view all inquiries
formsRouter.get("/admin/inquiries", adminAuth, listInquiries);

// Admin: update status/notes of an inquiry
formsRouter.patch("/admin/inquiries/:id", adminAuth, updateInquiry);

export default formsRouter;
