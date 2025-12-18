// import React, { useState } from "react";
// import { TextField } from "@mui/material";
// import toast, { Toaster } from "react-hot-toast";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/material.css";

// const InquiryForm = () => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         email: "",
//         mobile: "",
//         itemDetails: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handlePhoneChange = (value) => {
//         setFormData({ ...formData, mobile: value ? String(value) : "" });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!formData.firstName || !formData.email || !formData.mobile || !formData.itemDetails) {
//             toast.error("All fields are required!");
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//             toast.error("Enter a valid email!");
//             return;
//         }

//         if (formData.mobile.replace(/\D/g, "").length < 6) {
//             toast.error("Enter a valid mobile number!");
//             return;
//         }

//         toast.success("Inquiry submitted successfully ✅");
//         console.log("Submitted Data:", formData);

//         setFormData({
//             firstName: "",
//             email: "",
//             mobile: "",
//             itemDetails: "",
//         });
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen  p-4">
//             <Toaster position="top-right" reverseOrder={false} />
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white  rounded-2xl p-2 w-full min-w-[80vw] space-y-4 mb-30 md:min-w-[50vw] lg:min-w-[40vw]"
//             >
//                 <h2 className="text-2xl font-semibold text-center text-gray-800 ">
//                     Inquiry Form
//                 </h2>

//                 {/* First Name */}
//                 <TextField
//                     label="First Name"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     fullWidth
//                     required
//                     className="mb-4 mt-4"  // <-- Tailwind margin bottom
//                 />


//                 {/* Email */}
//                 <TextField
//                     label="Email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     fullWidth
//                     required
//                     className="mb-4 mt-4"         // Tailwind margin
//                     sx={{ mt: 2 }}                // Optional: MUI spacing (mt: 2 => 16px)
//                 />


//                 {/* Mobile */}
//                 <div className="mb-4">
//                     <PhoneInput
//                         country={"in"}
//                         value={formData.mobile}
//                         onChange={handlePhoneChange}
//                         inputStyle={{
//                             width: "100%",
//                             height: "40px",
//                             fontSize: "14px",
//                         }}
//                         inputClass="rounded"
//                         placeholder="+91 99999 99999"
//                         countryCodeEditable={false}
//                         disableDropdown={false}
//                         className="mb-4 mt-4"         // Tailwind margin

//                     />
//                 </div>

//                 {/* Item Details */}
//                 <TextField
//                     label="Item Details Inquiry"
//                     name="itemDetails"
//                     value={formData.itemDetails}
//                     onChange={handleChange}
//                     multiline
//                     rows={3}
//                     fullWidth
//                     required
//                         className="mb-4 mt-4"         // Tailwind margin
//                 />


//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className="w-full py-2 rounded-lg font-medium text-white transition duration-300 hover:opacity-90 h-[50px] mb-4 mt-4"
//                     style={{ backgroundColor: "#CEBB98" }}
//                 >
//                     Submit Inquiry
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default InquiryForm;

import React, { useState } from "react";
import axios from "axios";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import Round from "../../assets/Round.jpg";
import Princess from "../../assets/Princess.svg";
import Emerald from "../../assets/Emerald.jpg";
import Oval from "../../assets/Oval.jpg";
import Pear from "../../assets/Pear.svg";
import Heart from "../../assets/Heart.jpg";
import Asscher from "../../assets/Asscher.jpg";
import Marquise from "../../assets/Marquise.svg";
import Hybrid from "../../assets/Hybrid.jpg";
import Antique from "../../assets/Antique.jpg";
import Radiant from "../../assets/Radiant.jpg";
import Cushion from "../../assets/Cushion.jpg";

const diamondsOptions = [
    { name: "Round", photo: Round },
    { name: "Princess", photo: Princess },
    { name: "Emerald", photo: Emerald },
    { name: "Oval", photo: Oval },
    { name: "Pear", photo: Pear },
    { photo: Heart, name: "Heart" },
    { photo: Asscher, name: "Asscher" },
    { photo: Marquise, name: "Marquise" },
    { photo: Hybrid, name: "Hybrid" },
    { photo: Antique, name: "Antique" },
    { photo: Radiant, name: "Radiant" },
    { photo: Cushion, name: "Cushion" }
];

const API = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

const InquiryForm = () => {
     const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        mobile: "",
        itemDetails: "",
        diamond: null,
        diamondQuantity: 1,
    });

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((f) => ({ ...f, mobile: value ? String(value) : "" }));
  };

  const validate = () => {
    // Field validations with toast errors
        if (!formData.firstName.trim()) {
            toast.error("First Name is required!");
            return;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Enter a valid email!");
            return;
        }
        if (!formData.mobile.trim()) {
            toast.error("Mobile number is required!");
            return;
        }
        if (formData.mobile.replace(/\D/g, "").length < 6) {
            toast.error("Enter a valid mobile number!");
            return;
        }
        if (!formData.itemDetails.trim()) {
            toast.error("Item Details are required!");
            return;
        }
        if (formData.diamond && (!Number.isFinite(Number(formData.diamondQuantity)) || Number(formData.diamondQuantity) < 1)) {
            toast.error("Diamond quantity must be at least 1");
            return false;
    }
    return true;
  };

const handleDiamondSelect = (e) => {
     const selectedName = e.target.value;
    if (!selectedName) {
      setFormData((f) => ({ ...f, diamond: null, diamondQuantity: 1 }));
      return;
    }
        const selectedDiamond = diamondsOptions.find(d => d.name === e.target.value);
        setFormData({ ...formData, diamond: selectedDiamond });
        if (selectedDiamond) {
            toast.success(`Selected: ${selectedDiamond.name} ✅`, { duration: 2000 });
        }
    };

    const incrementQuantity = () => {
        setFormData({ ...formData, diamondQuantity: formData.diamondQuantity + 1 });
        toast(`Quantity increased: ${formData.diamondQuantity + 1}`, { icon: "🔼", duration: 1500 });
    };

    const decrementQuantity = () => {
        if (formData.diamondQuantity > 1) {
            setFormData({ ...formData, diamondQuantity: formData.diamondQuantity - 1 });
            toast(`Quantity decreased: ${formData.diamondQuantity - 1}`, { icon: "🔽", duration: 1500 });
        } else {
            toast.error("Quantity cannot be less than 1", { duration: 2000 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
      setLoading(true);
      // map FE fields → backend fields
      const payload = {
        name: formData.firstName,
        email: formData.email,
        phone: formData.mobile,
        message: formData.itemDetails,
        topic: formData.diamond ? "diamond-inquiry" : "general",
        diamond: formData.diamond
        ? { name: formData.diamond.name, photo: formData.diamond.photo || "" }
        : null,
      diamondQuantity: formData.diamond ? formData.diamondQuantity : 1,
      };

      const { data } = await axios.post(`${API}/forms/inquiry`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.success) {
        toast.success("Inquiry submitted successfully", { duration: 2500 });
        console.log("Submitted Data:", formData);
        setFormData({ firstName: "", email: "", mobile: "", itemDetails: "", diamond: null, diamondQuantity: 1 });
      } else {
        toast.error(data?.message || "Submit failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    };

    return (
        <div className="flex items-center justify-center p-2">
            <Toaster position="top-right" reverseOrder={false} />
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 w-full min-w-[80vw] md:min-w-[50vw] lg:min-w-[40vw] space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Inquiry Form
                </h2>

                {/* First Name */}
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                {/* Email */}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mt: 2 }}

                />

                {/* Mobile */}
                <div>
                    <PhoneInput
                        country={"in"}
                        value={formData.mobile}
                        onChange={handlePhoneChange}
                        inputStyle={{ width: "100%", height: "40px", fontSize: "14px" }}
                        inputClass="rounded"
                        placeholder="+91 99999 99999"
                        countryCodeEditable={false}
                        sx={{ mt: 2 }}
                        className="mt-4"

                    />
                </div>

                {/* Item Details */}
                <TextField
                    label="Item Details Inquiry"
                    name="itemDetails"
                    value={formData.itemDetails}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    required
                />

                {/* Diamond Select */}
                <FormControl fullWidth>
                    <InputLabel id="diamond-type-label" className="mt-3">Diamond Type (Optional)</InputLabel>
                    <Select
                        labelId="diamond-type-label"
                        id="diamond-type"
                        value={formData.diamond ? formData.diamond.name : ""}
                        label="Diamond Type (Optional)"
                        onChange={handleDiamondSelect}
                        renderValue={(selected) =>
                        selected ? selected : <span className="text-gray-400">None</span>
                        }
                        className="mt-5 mb-4"
                    >
                        {/* None Option */}
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>

                        {/* Diamond Options */}
                        {diamondsOptions.map((diamond) => (
                            <MenuItem
                                key={diamond.name}
                                value={diamond.name}
                                className="flex items-center space-x-2"
                            >
                                <img
                                    src={diamond.photo}
                                    alt={diamond.name}
                                    className="w-6 h-6 object-cover rounded"
                                />
                                <span>{diamond.name}</span>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


                {/* Diamond Quantity */}
                {formData.diamond && (
                    <div className="flex items-center space-x-2 mt-2">
                        <button type="button" onClick={decrementQuantity} className="px-3 py-1 bg-gray-200 rounded">
                            -
                        </button>
                        <span>{formData.diamondQuantity}</span>
                        <button type="button" onClick={incrementQuantity} className="px-3 py-1 bg-gray-200 rounded">
                            +
                        </button>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-medium text-white transition duration-300 hover:opacity-90"
                    style={{ backgroundColor: "#CEBB98" }}
                >
                     {loading ? "Submitting..." : "Submit Inquiry"}
                </button>
            </form>
        </div>
    );
};

export default InquiryForm;
