import React, { useState, useEffect } from "react";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill"; // ✅ normal react-quill
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/blog/get/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const blog = res.data.blog;
        setFormData({
          title: blog.title || "",
          description: blog.description || "",
        });
        setExistingImages(blog.image || []);
      } catch (err) {
        toast.error("Failed to load blog data");
      }
    };
    fetchBlog();
  }, [id]);

  const handleClose = () => {
    toast.success("Closing Edit Blog...");
    setTimeout(() => navigate(-1), 700);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.slice(0, 5)); // max 5 images
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description || formData.description === "<p><br></p>")
      newErrors.description = "Description is required";
    if (existingImages.length + images.length === 0)
      newErrors.image = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    images.forEach((img) => form.append("image", img));
    form.append("existingImages", JSON.stringify(existingImages));

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/blog/update/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(data.message || "Blog updated successfully!");
      navigate("/blog/List");
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <Dialog fullScreen open={true} onClose={handleClose} TransitionComponent={Transition}>
      <Toaster />
      <AppBar sx={{ position: "relative", backgroundColor: "#fff", boxShadow: 1 }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" className="text-black">
            Edit Blog
          </Typography>
        </Toolbar>
      </AppBar>

      <section className="relative w-full h-full bg-gray-50">
        <div className="p-9 overflow-y-auto max-h-[calc(100vh-64px-80px)]">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                theme="snow"
                className="bg-white"
                style={{ height: "250px", marginBottom: "40px" }}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images (Max 5) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />

              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img src={img} alt={`Existing ${i}`} className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                ))}
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img src={URL.createObjectURL(img)} alt={`New ${i}`} className="w-full h-full object-cover rounded" />
                  </div>
                ))}
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>
          </form>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white p-5 shadow-md border-t">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#CEBB98] hover:bg-[#CEBB80] text-white font-semibold py-2 rounded-md flex justify-center items-center gap-2 transition-all duration-300"
          >
            <FaCloudUploadAlt className="text-2xl" />
            <span>Update Blog</span>
          </button>
        </div>
      </section>
    </Dialog>
  );
};

export default EditBlog;
