import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { Button, Tooltip, Select, MenuItem } from "@mui/material";
import { MdOutlineDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ArrowDropDown,
} from "@mui/icons-material";
import axios from "axios";

const BlogList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:4000/api/blog"; // <-- Replace with your backend URL

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAll`);
      setBlogs(res.data.blogs || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchBlogs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleClick = () => {
    navigate("/addBlog");
  };

  const paginatedData = blogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalItems = blogs.length;
  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, totalItems);

  return (
    <div className="card my-3 mt-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold pl-2">Blog List</h2>
        <Button
          onClick={handleClick}
          className="!bg-[#CEBB98] !text-white flex items-center gap-1"
        >
          <GoPlus size={20} />
          Add Blog
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
        {loading ? (
          <p>Loading blogs...</p>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-sm text-left text-gray-900">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">IMAGE</th>
                  <th className="px-6 py-3">TITLE</th>
                  <th className="px-6 py-3">DESCRIPTION</th>
                  <th className="px-6 py-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((blog) => (
                  <tr className="bg-white border-b" key={blog._id}>
                    <td className="px-6 py-4">
                      {blog.image && blog.image.length > 0 ? (
                        <img
                          src={blog.image[0]}
                          alt="Blog"
                          className="w-28 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-28 h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-600 border">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 max-w-[500px] align-top">
                      <div
                        className="text-gray-800 text-sm leading-relaxed overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: blog.description,
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tooltip title="Edit Blog" placement="top">
                          <Link to={`/edit/${blog._id}`}>
                            <Button className="!min-w-0 !p-2 !rounded-full hover:!bg-gray-100">
                              <CiEdit
                                size={20}
                                className="text-gray-700 hover:text-blue-500"
                              />
                            </Button>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete Blog" placement="top">
                          <Button
                            className="!min-w-0 !p-2 !rounded-full hover:!bg-gray-100"
                            onClick={() => handleDelete(blog._id)}
                          >
                            <MdOutlineDelete
                              size={20}
                              className="text-gray-700 hover:text-red-500"
                            />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 mt-4 px-2 text-sm">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              size="small"
              variant="outlined"
              className="w-[80px] h-[35px]"
              IconComponent={ArrowDropDown}
              sx={{ fontSize: "14px" }}
            >
              {[5, 10, 20, 50, 100].map((rows) => (
                <MenuItem key={rows} value={rows}>
                  {rows}
                </MenuItem>
              ))}
            </Select>
            <span>
              {from}–{to} of {totalItems}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="!min-w-0 !p-1 !rounded-full"
            >
              <KeyboardArrowLeft className="!bg-gray-200 !rounded-full" />
            </Button>
            <Button
              onClick={() =>
                setPage((prev) =>
                  prev < Math.ceil(totalItems / rowsPerPage) ? prev + 1 : prev
                )
              }
              disabled={page === Math.ceil(totalItems / rowsPerPage)}
              className="!min-w-0 !p-1 !rounded-full"
            >
              <KeyboardArrowRight className="!bg-gray-200 !rounded-full" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
