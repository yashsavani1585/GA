import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import BlogModel from "../models/BlogModel.js";

dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ Create Blog
export async function uploadImageAndBlog(req, res) {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Title and description are required.",
        success: false,
      });
    }

    let imageUrlArray = [];

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blogs",
        use_filename: true,
      });
      imageUrlArray.push(result.secure_url);

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    const blog = await BlogModel.create({
      title: title.trim(),
      description: description.trim(),
      image: imageUrlArray,
    });

    return res.status(201).json({
      message: "✅ Blog created successfully.",
      blog,
      success: true,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
}

// ✅ Get All Blogs
export async function getAllBlogs(req, res) {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "✅ Blogs fetched successfully.",
      blogs,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Get Blog By ID
export async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found", success: false });
    res.status(200).json({ message: "✅ Blog fetched successfully.", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Delete Blog
export async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findByIdAndDelete(id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found", success: false });
    res.status(200).json({ message: "✅ Blog deleted successfully.", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Update Blog
export async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    const blog = await BlogModel.findById(id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found", success: false });

    let imageUrl = blog.image[0];
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    blog.title = title?.trim() || blog.title;
    blog.description = description?.trim() || blog.description;
    blog.image = [imageUrl];
    await blog.save();

    res.status(200).json({
      message: "✅ Blog updated successfully.",
      blog,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
