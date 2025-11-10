import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "single"

    // Fetch all blogs
    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/blog/getAll");
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Handle click on a blog
    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        setViewMode("single");
    };

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Grid view */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            onClick={() => handleBlogClick(blog)}
                            className="cursor-pointer border rounded overflow-hidden shadow hover:shadow-lg transition"
                        >
                            {blog.image && (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-80 object-cover"
                                />
                            )}
                            <div className="p-2">
                                <h3 className="font-semibold">{blog.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {blog.description.replace(/<[^>]+>/g, "").slice(0, 150)}...
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Single blog view */}
            {viewMode === "single" && selectedBlog && (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side: full blog */}
                    <div className="md:w-3/4 bg-white p-6 shadow rounded overflow-y-auto max-h-screen">
                        <button
                            className="mb-4 text-black font-semibold border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                            onClick={() => setViewMode("grid")}
                        >
                            ← Back to all blogs
                        </button>

                        <h1 className="text-3xl font-bold mb-4">{selectedBlog.title}</h1>
                        {selectedBlog.image && (
                            <img
                                src={selectedBlog.image}
                                alt={selectedBlog.title}
                                className="w-full h-100 object-cover rounded mb-4"
                            />
                        )}
                        <div className="prose max-w-full">
                            <ReactQuill value={selectedBlog.description} readOnly theme="bubble" />
                        </div>
                    </div>

                    {/* Right side: small previews */}
                    <div className="md:w-1/4 flex flex-col gap-4 overflow-y-auto max-h-screen">
                        <h2 className="text-xl font-bold mb-2">Other Blogs</h2>
                        {blogs
                            .filter((b) => b._id !== selectedBlog._id)
                            .map((blog) => (
                                <div
                                    key={blog._id}
                                    onClick={() => handleBlogClick(blog)}
                                    className="cursor-pointer border rounded overflow-hidden hover:shadow-lg transition flex"
                                >
                                    {blog.image && (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-20 h-24 object-cover"
                                        />
                                    )}
                                    <div className="p-2 flex-1">
                                        <h3 className="text-sm font-semibold">{blog.title}</h3>
                                        <p className="text-xs text-gray-600">
                                            {blog.description.replace(/<[^>]+>/g, "").slice(0, 190)}...
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
