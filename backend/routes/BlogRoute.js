import { Router } from "express";
import {
  uploadImageAndBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controllers/BlogController.js";
import { upload } from "../middleware/multer.js";
import { authUser } from "../middleware/auth.js";

const router = Router();

router.post("/create", authUser, upload.single("image"), uploadImageAndBlog);
router.get("/getAll", getAllBlogs);
router.get("/get/:id", getBlogById);
router.delete("/delete/:id", authUser, deleteBlog);
router.put("/update/:id", authUser, upload.single("image"), updateBlog);

export default router;
