import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

// Optional: import your brand logo if you have it
// import logo from '../assets/ELYSIAN JEWELS-logo.svg';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/user/admin`, { email, password });
      if (data.success) {
        setToken(data.token);
        toast.success('Welcome back!');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Top promo bar */}
      <div className="w-full bg-[#CEBB98] text-white text-center py-2 text-sm">
        ✨ Admin Access • ELYSIAN JEWELS Jewellers
      </div>

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {/* {logo && <img src={logo} alt="ELYSIAN JEWELS" className="h-9" />} */}
            <span className="text-xl sm:text-2xl font-semibold text-BLACK">
              ELYSIAN JEWELS Admin
            </span>
          </div>
          <div className="hidden sm:block text-sm text-gray-500">
            Manage products & orders with elegance.
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 bg-gradient-to-b from-purple-50/40 to-white">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-md">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-purple-100/60 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-BLACK mb-1 text-center">
                Admin Sign In
              </h1>
              <p className="text-sm text-gray-600 text-center mb-6">
                Use your ELYSIAN JEWELS admin credentials to continue.
              </p>

              <form onSubmit={onsubmitHandler} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder="admin@ELYSIAN JEWELS.com"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none
                               shadow-sm focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]
                               transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 outline-none
                                 shadow-sm focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]
                                 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute inset-y-0 right-2 px-2 text-sm text-gray-500 hover:text-[#4f1c51]"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 select-none">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <span className="text-pink-500 hover:text-pink-600 cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#CEBB98] text-white py-2.5 mt-2
                             shadow hover:shadow-md active:scale-[0.99]
                             transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in…' : 'Login'}
                </button>
              </form>
            </div>

            {/* Footnote */}
            <p className="text-xs text-center text-gray-500 mt-4">
              Protected area • Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </main>

      {/* Footer (minimal to match theme) */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} ELYSIAN JEWELS Jewellers • All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
