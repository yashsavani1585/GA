// middleware/cloudinaryUpload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve("./temp-uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

// ✅ keep this for product images
const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image files are allowed!"), false);
};

// ✅ new filter for forms (images + pdf/doc/docx)
const formsFileFilter = (req, file, cb) => {
  const ok =
    file.mimetype?.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  cb(ok ? null : new Error("Allowed: images, pdf, doc, docx"), ok);
};

const baseLimits = { fileSize: 10 * 1024 * 1024, files: 30 }; // 10MB

const upload = multer({ storage, fileFilter, limits: baseLimits });
// 🔻 your existing exports (unchanged)
export const uploadColorImages = upload.fields([
  { name: "goldImages", maxCount: 10 },
  { name: "roseImages", maxCount: 10 },
  { name: "whiteImages", maxCount: 10 },
]);
export const uploadLegacyImages = upload.array("images", 10);

// ✅ new: single attachment for personalized/inquiry forms
export const uploadFormFile = multer({
  storage,
  fileFilter: formsFileFilter,
  limits: baseLimits,
}).single("file");

// cleanup stays the same
export const cleanupTempFiles = (files) => {
  if (!files) return;
  if (Array.isArray(files)) {
    files.forEach((f) => f?.path && fs.existsSync(f.path) && fs.unlinkSync(f.path));
    return;
  }
  Object.values(files).forEach((arr) => {
    Array.isArray(arr) &&
      arr.forEach((f) => f?.path && fs.existsSync(f.path) && fs.unlinkSync(f.path));
  });
};

export default upload;
