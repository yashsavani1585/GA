import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthLR from "../../assets/Auth.png";
import  axios  from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  axios.defaults.withCredentials = true; // critical for OAuth state


const USER_BASE = `${API_BASE}/user`;
const AUTH_BASE = `${API_BASE}/auth`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Forgot Password dialog state
  const [openFP, setOpenFP] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- Login -----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) return alert("Email is required");
    if (!form.password) return alert("Password is required");

    try {
      const res = await fetch(`${USER_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ---------------- Register -----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) return alert("Name is required");
    if (!form.email.trim()) return alert("Email is required");
    if (!form.phone.trim()) return alert("Phone number is required");
    if (!/^\d{10}$/.test(form.phone)) return alert("Invalid 10-digit phone number");
    if (!form.password) return alert("Password is required");
    if (!form.confirmPassword) return alert("Please confirm your password");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");

    try {
      const res = await fetch(`${USER_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  // ---------------- Google Login -----------------
  const startGoogleLogin = () => {
    const redirectBackTo = encodeURIComponent(window.location.origin);
    window.location.href = `${AUTH_BASE}/google?redirect=${redirectBackTo}`;
  };

  const toggleAuth = () => setIsLogin(!isLogin);

  // ---------------- Forgot Password -----------------
  const openForgotPassword = () => setOpenFP(true);
  const closeForgotPassword = () => {
    setOpenFP(false);
    setFpEmail("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError("");
  };

  const handleForgotPasswordSubmit = async () => {
    // Validation
    if (!fpEmail || !fpNewPassword || !fpConfirmPassword) {
      setFpError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fpEmail)) {
      setFpError("Invalid email");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${USER_BASE}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          newPassword: fpNewPassword,
          confirmPassword: fpConfirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully");
        closeForgotPassword();
      } else {
        setFpError(data.message || "Password update failed");
      }
    } catch (err) {
      console.error(err);
      setFpError("Password update failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl rounded-lg bg-white overflow-hidden md:h-[600px]">

        {/* Left Image */}
        <div className="w-full md:w-1/2 h-52 md:h-auto">
          <img src={AuthLR} alt="Auth" className="w-full h-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md flex flex-col">

            {/* Tabs */}
            <div className="flex justify-center space-x-10 border-b border-gray-200 pb-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`text-lg font-semibold cursor-pointer ${
                  isLogin ? "border-b-2 border-[#CEBB98] text-[#CEBB98]" : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`text-lg font-semibold cursor-pointer ${
                  !isLogin ? "border-b-2 border-[#CEBB98] text-[#CEBB98]" : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 flex flex-col justify-center overflow-y-auto">
              {isLogin ? (
                <form className="space-y-5 pt-6" onSubmit={handleLogin}>
                  <p className="text-xs text-gray-500 leading-snug">
                    Your details are required for registration and will be securely stored.
                  </p>

                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <div className="flex items-center justify-between flex-wrap">
                    <FormControlLabel control={<Checkbox />} label="Remember me" />
                    <span
                      className="text-sm text-gray-700 cursor-pointer hover:text-[#CEBB98]"
                      onClick={openForgotPassword}
                    >
                      Forgot Password
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    By continuing, you agree to{" "}
                    <span className="text-[#CEBB98] cursor-pointer">Terms of Use</span> &{" "}
                    <span className="text-[#CEBB98] cursor-pointer">Privacy Policy</span>.
                  </p>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#CEBB98", "&:hover": { backgroundColor: "black" } }}
                  >
                    Login
                  </Button>

                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={startGoogleLogin}
                    startIcon={
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                      />
                    }
                  >
                    Sign in with Google
                  </Button>

                  <p className="text-center text-sm mt-2">
                    Don’t have an Account?{" "}
                    <span
                      className="text-[#CEBB98] font-semibold cursor-pointer"
                      onClick={toggleAuth}
                    >
                      Create Account
                    </span>
                  </p>
                </form>
              ) : (
                <form className="space-y-5 pt-6" onSubmit={handleRegister}>
                  <h2 className="text-lg font-semibold">Create an Account</h2>
                  <p className="text-xs text-gray-500 leading-snug">
                    Your details are required for registration and will be securely stored.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      label="Name"
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Mobile Number"
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <p className="text-xs text-gray-500 text-center mt-2">
                    By continuing, you agree to{" "}
                    <span className="text-[#CEBB98] cursor-pointer">Terms of Use</span> &{" "}
                    <span className="text-[#CEBB98] cursor-pointer">Privacy Policy</span>.
                  </p>

                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{ backgroundColor: "#CEBB98", "&:hover": { backgroundColor: "black" } }}
                  >
                    Register
                  </Button>

                  <div className="flex items-center mt-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={startGoogleLogin}
                    startIcon={
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                      />
                    }
                  >
                    Sign up with Google
                  </Button>

                  <p className="text-center text-sm mt-2">
                    Already have an account?{" "}
                    <span
                      className="text-[#CEBB98] font-semibold cursor-pointer"
                      onClick={toggleAuth}
                    >
                      Sign in
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
     <Dialog
  open={openFP}
  onClose={closeForgotPassword}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: { xs: 2, sm: 3 }, // smaller padding on mobile
      backgroundColor: "#fdfdfd",
      boxShadow: 6,
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      fontSize: { xs: "1.2rem", sm: "1.5rem" }, // responsive font
    }}
  >
    Change Password
  </DialogTitle>

  <DialogContent>
    <Box display="flex" flexDirection="column" gap={2} mt={1}>
      {[
        {
          label: "Email",
          value: fpEmail,
          onChange: (e) => setFpEmail(e.target.value),
          type: "email",
        },
        {
          label: "New Password",
          value: fpNewPassword,
          onChange: (e) => setFpNewPassword(e.target.value),
          type: "password",
        },
        {
          label: "Confirm Password",
          value: fpConfirmPassword,
          onChange: (e) => setFpConfirmPassword(e.target.value),
          type: "password",
        },
      ].map((field, idx) => (
        <TextField
          key={idx}
          type={field.type}
          label={field.label}
          value={field.value}
          onChange={field.onChange}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "black" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
            "& .MuiInputLabel-root": { color: "#222" },
            input: { color: "#222" },
          }}
        />
      ))}
      {fpError && (
        <Typography
          color="error"
          sx={{ textAlign: "center", fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          {fpError}
        </Typography>
      )}
    </Box>
  </DialogContent>

  <DialogActions>
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }} // stack on mobile
      gap={2}
      width="100%"
      px={1}
      pb={1}
    >
      <Button
        onClick={closeForgotPassword}
        sx={{
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "#333" },
          width: { xs: "100%", sm: "48%" },
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleForgotPasswordSubmit}
        sx={{
          backgroundColor: "#CEBB98",
          color: "black",
          "&:hover": { backgroundColor: "#bfa876" },
          width: { xs: "100%", sm: "48%" },
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        Update Password
      </Button>
    </Box>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Auth;
