import React, { useState, useEffect } from "react";
import { FaCheck, FaGift, FaLock, FaPen, FaHome } from "react-icons/fa";
import { useOrder } from "../../context/orderContext";
import { useCart } from "../../context/cartContext";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, getUserIdFromToken } from "../../utils/auth";
import toast from "react-hot-toast";
import axios from "axios";
import diamond from "../../assets/diamond.png";
import check from "../../assets/check.png";
import logoPng from "../../../public/logo.png";

const API = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

const OrderConfirm = () => {
    const { orderData, userDetails, isDetailsSaved, saveUserDetails, clearOrder } = useOrder();
    const { clear: clearCart } = useCart();
    const navigate = useNavigate();

    // Redirect to cart if no order data
    useEffect(() => {
        if (!orderData.items || orderData.items.length === 0) {
            navigate('/myorder');
        }
    }, [orderData, navigate]);

    const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

    // ✅ Track Step
    const [step, setStep] = useState("cart"); // cart → address → payment → success
    const [deliveryType, setDeliveryType] = useState(userDetails.deliveryType || "home");
    
    // ✅ Track Order button enabled/disabled
    const [orderEnabled, setOrderEnabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Form Data - Initialize with saved details or defaults
    const [formData, setFormData] = useState({
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
        name: userDetails.name || "",
        pincode: userDetails.pincode || "",
        address: userDetails.address || "",
        street: userDetails.street || "",
        town: userDetails.town || "",
        recipientMobile: userDetails.recipientMobile || "",
        landmark: userDetails.landmark || "",
        gst: userDetails.gst || "",
        whatsapp: userDetails.whatsapp || "",
        billingSame: userDetails.billingSame !== undefined ? userDetails.billingSame : true,
    });

    const [errors, setErrors] = useState({});

    // ✅ Get user ID from token if not available in auth context
    const getUserId = () => {
        // Try to get user ID from token first
        try {
            const userIdFromToken = getUserIdFromToken();
            if (userIdFromToken) return userIdFromToken;
        } catch (error) {
            console.error("Error getting user ID from token:", error);
        }

        return null;
    };

    // ✅ Validate required fields only
    const validate = () => {
        let newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.mobile) newErrors.mobile = "Mobile number is required";
        if (!formData.name) newErrors.name = "Recipient's Name is required";
        if (!formData.pincode) newErrors.pincode = "Pincode is required";
        if (!formData.address) newErrors.address = "Flat/House No. is required";
        if (!formData.street) newErrors.street = "Street/Colony is required";
        if (!formData.town) newErrors.town = "Locality/Town is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Your Details form submit
    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Save details to context
            const detailsToSave = {
                ...formData,
                deliveryType
            };
            saveUserDetails(detailsToSave);
            toast.success("Details saved successfully ✅");
            setStep("address");
            setOrderEnabled(true); // enable order button after details saved
        } else {
            toast.error("Please fill all required fields ⚠️");
        }
    };

    const authHeader = () => {
        const token = localStorage.getItem("token");
        if (!token) return {};
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
    };

    // ✅ Handle Payment (Proceed to Pay)
    const handlePayment = async () => {
        if (!orderEnabled || !isDetailsSaved) {
            toast.error("Please fill and save your details first!");
            setStep("cart");
            return;
        }

        try {
            setIsProcessing(true);
            setShowPopup(true);

            // Auth token check
            const tokenConfig = authHeader();
            if (!tokenConfig.headers?.Authorization) {
                toast.error("Please login first!");
                navigate("/auth");
                return;
            }

            const userId = getUserId();
            if (!userId) {
                toast.error("User authentication failed. Please login again.");
                navigate("/auth");
                return;
            }

            // Prepare payload
            const payload = {
                email: formData.email,
                mobileNumber: formData.mobile,
                whatsappOptIn: !!formData.whatsapp,
                whatsappNumber: formData.whatsapp || formData.mobile,
                deliveryType: deliveryType.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup",
                recipientName: formData.name,
                recipientMobile: formData.recipientMobile || formData.mobile,
                pincode: formData.pincode,
                houseNo: formData.address,
                street: formData.street,
                locality: formData.town,
                landmark: formData.landmark || "",
                gstNumber: formData.gst || "",
                userId
            };

            // Call backend to create payment
            const response = await axios.post(`${API}/payment/create`, payload, tokenConfig);

            if (!response.data.success) {
                toast.error(response.data.message || "Payment initialization failed");
                setShowPopup(false);
                setIsProcessing(false);
                return;
            }

            // Razorpay options
            const options = {
                key: response.data.key,
                amount: response.data.amount,
                currency: response.data.currency,
                name: "SPARKLE & SHINE",
                description: "Cart Payment",
                order_id: response.data.orderId,
                image: logoPng, // 👈 from public folder

                handler: async (paymentResponse) => {
                    try {
                        const verifyRes = await axios.post(
                            `${API}/payment/verify`,
                            {
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                userId
                            },
                            tokenConfig
                        );

                        if (verifyRes.data.success) {
                            toast.success("Payment Successful! 🎉");
                            clearCart();
                            clearOrder();
                            setStep("success");
                        } else {
                            toast.error("Payment verification failed");
                            console.error("Payment verification failed:", verifyRes.data);
                        }
                    } catch (err) {
                        console.error("Verification Error:", err.response?.data || err);
                        toast.error("Payment verification failed");
                    } finally {
                        setShowPopup(false);
                        setIsProcessing(false);
                    }
                },

                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.mobile,
                },

                theme: { color: "#CEBB98" },

                modal: {
                    ondismiss: () => {
                        setShowPopup(false);
                        setIsProcessing(false);
                        toast.error("Payment cancelled");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setStep("payment"); // Update step to payment

        } catch (err) {
            console.error("Payment Error:", err.response?.data || err);
            toast.error(err.response?.data?.message || "Payment failed");
            setShowPopup(false);
            setIsProcessing(false);
        }
    };

    // ✅ Go to Home function
    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Payment Processing Popup - Rendered at top level */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative w-[400px] h-[400px] flex flex-col items-center justify-center rounded-lg shadow-lg overflow-hidden">
                        {/* Background Image */}
                        <img
                            src={diamond}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay Color */}
                        <div
                            className="absolute inset-0"
                            style={{ backgroundColor: "#CEBB98C7" }}
                        ></div>

                        {/* Check Icon */}
                        <img
                            src={check}
                            alt="Success"
                            className="relative w-24 h-24"
                        />

                        {/* Text */}
                        <p className="relative mt-4 text-center text-white font-semibold px-4">
                            Processing your payment...
                        </p>
                    </div>
                </div>
            )}

            {/* Stepper */}
            <div className="w-full border-t border-[#CEBB98] bg-white">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between py-2 px-3 sm:py-4 sm:px-6 gap-2">

                    {/* ✅ Stepper */}
                    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 md:ml-10">
                        {/* Cart */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 text-white text-[9px] sm:text-xs">
                                <FaCheck />
                            </div>
                            <span className="text-gray-600 text-[11px] sm:text-sm md:text-base">Cart</span>
                        </div>

                        <div className="w-6 sm:w-10 md:w-16 h-[2px] bg-gray-300"></div>

                        {/* Address */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div
                                className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-xs 
            ${step === "address" || step === "success" || step === "payment"
                                        ? "bg-green-500 text-white"
                                        : "border border-blue-500 text-blue-500"
                                    }`}
                            >
                                {(step === "address" || step === "success" || step === "payment") ? <FaCheck /> : ""}
                            </div>
                            <span
                                className={`text-[11px] sm:text-sm md:text-base ${(step === "address" || step === "success" || step === "payment")
                                    ? "text-gray-800 font-semibold"
                                    : "text-gray-600"
                                    }`}
                            >
                                Address
                            </span>
                        </div>

                        <div className="w-6 sm:w-10 md:w-16 h-[2px] bg-gray-300"></div>

                        {/* Payment */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div
                                className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-xs 
            ${step === "success" || step === "payment"
                                        ? "bg-green-500 text-white"
                                        : step === "address"
                                            ? "border border-blue-500 text-blue-500"
                                            : "border border-gray-400 text-gray-400"
                                    }`}
                            >
                                {(step === "success" || step === "payment") ? <FaCheck /> : ""}
                            </div>
                            <span
                                className={`text-[11px] sm:text-sm md:text-base ${step === "success" || step === "payment"
                                    ? "text-gray-600"
                                    : step === "address"
                                        ? "text-gray-800 font-semibold"
                                        : "text-gray-400"
                                    }`}
                            >
                                Payment
                            </span>
                        </div>
                    </div>

                    {/* ✅ Secure */}
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-500 justify-center sm:justify-end w-full sm:w-auto mt-1 sm:mt-0">
                        <FaLock className="text-[11px] sm:text-sm" />
                        <span className="text-[11px] sm:text-sm font-medium">100% SECURE</span>
                    </div>
                </div>
            </div>


            {/* Main Section */}
            <div className="max-w-6xl mx-auto mt-2 grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr] gap-6 px-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto relative max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 scrollbar-hide">
                    {step === "address" && (
                        <button
                            onClick={() => setStep("cart")}
                            className="absolute top-4 right-4 flex items-center gap-1 text-yellow-900 hover:text-blue-800 font-medium"
                        >
                            <FaPen /> Edit
                        </button>
                    )}

                    {(step === "cart" || step === "address") && (
                        <form onSubmit={handleDetailsSubmit}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">Your Details</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Required to Save Cart and Send Order Updates
                            </p>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-yellow-900"} outline-none`}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {/* Mobile */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Mobile number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.mobile ? "border-red-500" : "focus:ring-yellow-900"} outline-none`}
                                />
                                {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                            </div>

                            <p className="text-sm text-gray-500 mb-4">
                                who you like to receive notifications on WhatsApp?
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    WhatsApp Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 outline-none focus:ring-yellow-900"
                                />
                            </div>

                            {/* Delivery Type */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Type</h3>
                            <hr className="mb-4 text-black" />
                            <p className="text-sm text-gray-500 mb-4">
                                please choose preferred type of delivery
                            </p>
                            <div className="space-y-3 mb-6">
                                <label className="flex items-start gap-3 cursor-pointer border rounded-md px-4 py-3 hover:border-yellow-900 transition">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="home"
                                        checked={deliveryType === "home"}
                                        onChange={() => setDeliveryType("home")}
                                        className="mt-1 text-yellow-900 focus:ring-yellow-900"
                                    />
                                    <span className="text-gray-700">Home Delivery</span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer border rounded-md px-4 py-3 hover:border-yellow-900 transition">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="store"
                                        checked={deliveryType === "store"}
                                        onChange={() => setDeliveryType("store")}
                                        className="mt-1 text-yellow-900 focus:ring-yellow-900"
                                    />
                                    <span className="text-gray-700">
                                        Pick up from store
                                        <span className="text-gray-500 text-sm block">
                                            Buy now, pick up from our store at your convenience.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {/* Recipient Name */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Details</h3>
                            <hr className="mb-4 text-black" />
                            <p className="text-sm text-gray-500 mb-4">
                                we will delivery the order at the below address
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Recipient's Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.name ? "border-red-500" : "focus:ring-yellow-900"
                                        } outline-none`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Pincode + Recipient Mobile (Optional) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Recipient Mobile (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.recipientMobile}
                                        onChange={(e) =>
                                            setFormData({ ...formData, recipientMobile: e.target.value })
                                        }
                                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.pincode ? "border-red-500" : "focus:ring-yellow-900"
                                            } outline-none`}
                                    />
                                    {errors.pincode && (
                                        <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Flat/House No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.address ? "border-red-500" : "focus:ring-yellow-900"
                                            } outline-none`}
                                    />
                                    {errors.address && (
                                        <p className="text-xs text red-500 mt-1">{errors.address}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Street/Colony <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.street ? "border-red-500" : "focus:ring-yellow-900"
                                            } outline-none`}
                                    />
                                    {errors.street && (
                                        <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                                    )}
                                </div>
                            </div>

                            {/* Town + Landmark (Optional) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Locality/Town <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.town}
                                        onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                                        className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.town ? "border-red-500" : "focus:ring-yellow-900"
                                            } outline-none`}
                                    />
                                    {errors.town && (
                                        <p className="text-xs text-red-500 mt-1">{errors.town}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.landmark}
                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-900"
                                    />
                                </div>
                            </div>

                            {/* GST + Billing Checkbox */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    GST Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.gst}
                                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-900"
                                />
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.billingSame}
                                    onChange={(e) =>
                                        setFormData({ ...formData, billingSame: e.target.checked })
                                    }
                                    className="w-4 h-4"
                                />
                                <label className="text-sm text-gray-600">Billing Address Same</label>
                            </div>

                            <button
                                type={step === "cart" ? "submit" : "button"}
                                onClick={step === "address" ? handlePayment : undefined}
                                disabled={isProcessing}
                                className={`w-full bg-[#CEBB98] hover:bg-black text-white py-3 rounded-md text-lg font-medium shadow-md ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isProcessing ? 'Processing...' : (step === "cart" ? "Save & Continue" : "Proceed To Pay")}
                            </button>
                        </form>
                    )}

                    {/* Success Screen */}
                    {step === "success" && (
                        <div className="py-10">
                            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
                                🎉 Payment Successful!
                            </h2>
                            <p className="text-gray-600 text-center mb-6">Your order has been placed successfully.</p>

                            {/* Order Details */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="text-sm text-gray-600">Order ID:</div>
                                    <div className="text-sm font-medium">#ORD{Math.floor(100000 + Math.random() * 900000)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="text-sm text-gray-600">Delivery Address:</div>
                                    <div className="text-sm font-medium">
                                        {formData.address}, {formData.street},<br />
                                        {formData.town}, {formData.pincode}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="text-sm text-gray-600">Contact:</div>
                                    <div className="text-sm font-medium">
                                        {formData.mobile}
                                        {formData.whatsapp && `, ${formData.whatsapp} (WhatsApp)`}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm text-gray-600">Total Amount:</div>
                                    <div className="text-sm font-medium">₹{formatIN(orderData.summary?.total || 0)}</div>
                                </div>
                            </div>

                            {/* Go to Home Button */}
                            <button
                                onClick={goToHome}
                                className="w-full bg-[#CEBB98] hover:bg-black text-white py-3 rounded-md text-lg font-medium shadow-md flex items-center justify-center gap-2"
                            >
                                <FaHome /> Go to Home
                            </button>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-300 hidden lg:block"></div>

                {/* Right - Order Summary - Hide on success */}
                {step !== "success" && (
                    <div className="lg:w-[350px] w-full mt-6 lg:mt-0">
                        <div className="lg:sticky lg:top-50 rounded-lg p-6 border shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">ORDER SUMMARY</h3>

                            <div className="flex justify-between text-sm text-gray-700 mb-2">
                                <span>Total ({orderData.summary?.totalItems || 0} Items)</span>
                                <span>₹{formatIN(orderData.summary?.total || 0)}</span>
                            </div>
                            <div className="border-t border-dotted border-gray-400 my-4"></div>

                            <div className="flex justify-between font-medium text-gray-900 mb-2">
                                <span>Total Payable</span>
                                <span>₹{formatIN(orderData.summary?.total || 0)}</span>
                            </div>
                            <div className="border-t border-dotted border-gray-400 my-4"></div>

                            {orderData.summary?.totalSavings > 0 && (
                                <p className="text-green-600 text-sm mb-6">You Save ₹{formatIN(orderData.summary.totalSavings)}</p>
                            )}

                            <div className="mb-6 flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                                <div className="flex items-center text-sm text-gray-700">
                                    <FaGift className="text-gray-500 mr-2" />
                                    <span>Gift Message (Optional)</span>
                                </div>
                                <button className="text-black font-medium text-sm hover:underline">Add</button>
                            </div>

                            <div className="mb-6 flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                                <div className="flex items-center text-sm text-gray-700">
                                    <FaGift className="text-gray-500 mr-2" />
                                    <span>Coupon Code Apply (Optional)</span>
                                </div>
                                <button className="text-black font-medium text-sm hover:underline">Apply</button>
                            </div>

                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={!orderEnabled || isProcessing}
                                className={`w-full py-3 rounded-md text-lg font-medium mb-6 shadow-md 
                                ${orderEnabled && !isProcessing
                                        ? "bg-[#CEBB98] hover:bg-black text-white cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isProcessing ? 'Processing...' : 'Proceed To Pay'}
                            </button>

                            <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                                <span className="text-gray-500">⚙</span> Apply Voucher / Gift Card
                            </p>

                            <p className="text-sm text-gray-600">
                                Any Questions?
                                <br />
                                Please call us at{" "}
                                <a href="tel:18004190066" className="text-black font-medium">
                                    18004190066
                                </a>{" "}
                                or{" "}
                                <a href="#" className="text-black font-medium hover:underline">
                                    Chat with us
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderConfirm;