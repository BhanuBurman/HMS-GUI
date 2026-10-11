
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUser, FaLock, FaUserShield } from "react-icons/fa";
import api from "../AxiosConfig";
import { ButtonSpinner } from "./Spinner";

const Login = (props) => {
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    regNumber: "",
    password: "",
    roleType: "Student",
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsUserLoggingIn(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", formData);
      const token = response.data;
      setIsUserLoggingIn(false);

      if (token) {
        localStorage.setItem("token", token);
        props.onClose?.();
        window.location.reload();
      } else {
        setErrorMessage("Authentication failed: No token received.");
      }
    } catch (error) {
      setIsUserLoggingIn(false);
      setErrorMessage(
        error.response?.data || "Invalid credentials. Please verify and try again."
      );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose?.();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-blue-500/10 text-white"
      >
        {/* Close Button */}
        <button
          onClick={props.onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <FaTimes className="text-base" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <FaUserShield className="text-xs" />
            <span>Secure Portal Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to Smart Hostels
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your room booking, complaints desk, and dining timetable.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registration Number / Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                type="text"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleChange}
                placeholder="e.g. 20MIP10019 or 20WAR990"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Account Role
            </label>
            <select
              name="roleType"
              id="roleType"
              value={formData.roleType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="Student">Student (Resident)</option>
              <option value="Warden">Warden (Administration)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isUserLoggingIn}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
          >
            {isUserLoggingIn ? (
              <ButtonSpinner text="Authenticating..." />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
