import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileImage from "../../assets/jawellarycontactPage.png";

const USER_BASE = `https://ga-inx6.onrender.com/api/user`;

const splitName = (user) => {
  if (user?.firstName || user?.lastName) {
    return { firstName: user.firstName || "", lastName: user.lastName || "" };
  }
  const parts = (user?.name || "").trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
};

const YourProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    axios
      .get(`${USER_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const json = res.data;
        if (!json.success) return;
        const u = json.user;
        const { firstName, lastName } = splitName(u);
        setForm({
          firstName,
          lastName,
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          apartment: u.apartment || "",
          city: u.city || "",
          state: u.state || "",
          zip: u.zip || "",
          dob: u.dob || "",
          gender: u.gender || "",
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/auth");
        else alert(err.response?.data?.message || "Failed to fetch profile");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: form.address,
      apartment: form.apartment,
      city: form.city,
      state: form.state,
      zip: form.zip,
      dob: form.dob,
      gender: form.gender,
    };

    try {
      const { data } = await axios.post(`${USER_BASE}/updateProfile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) alert("Profile updated successfully!");
      else alert(data.message || "Failed to update profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading profile…</div>;

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-auto">
          <img src={profileImage} alt="Profile Banner" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="p-6 sm:p-10 md:p-12 flex items-center">
          <form className="w-full space-y-5" onSubmit={onSubmit}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="First Name"
                className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Last Name"
                className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              placeholder="Email"
              className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone Number"
              className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Address"
              className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
            />

            <input
              type="text"
              name="apartment"
              value={form.apartment}
              onChange={onChange}
              placeholder="Apartment, suite, etc."
              className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" name="city" value={form.city} onChange={onChange} placeholder="City" className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none" />
              <input type="text" name="state" value={form.state} onChange={onChange} placeholder="State" className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none" />
              <input type="text" name="zip" value={form.zip} onChange={onChange} placeholder="ZIP Code" className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none" />
            </div>

            <input type="date" name="dob" value={form.dob} onChange={onChange} className="w-full p-3 border rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-600 outline-none" />

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={onChange} />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={onChange} />
                <span>Female</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-[#CEBB98] text-white py-3 rounded-md hover:bg-black transition">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YourProfile;
