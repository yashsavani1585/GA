// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create 'uploads' directory if it doesn't exist
// const uploadDir = path.resolve("uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
//     const uniqueName = `${Date.now()}_${base}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// // File type validation
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     const err = new Error(
//       "Only image files are allowed (jpeg, jpg, png, webp)"
//     );
//     err.status = 400;
//     cb(err, false);
//   }
// };

// // Multer upload instance
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });


import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
