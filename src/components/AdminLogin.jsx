import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const navigateToRecruiterLogin=()=>{
    navigate("/recruiter-login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://qualace-recruitpro.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/admin-home");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };
  

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleForgotPassword = () => {
    const otp = generateOTP();
    setGeneratedOtp(otp);

    const templateParams = {
      to_name: "Mr. Farid Shaikh",
      to_email: email,
      subject: "Your OTP for Password Reset",
      message: `Your OTP for resetting your password is: ${otp}`,
    };

    emailjs
      .send(
        "service_bbl248o",
        "template_xmzfff7",
        templateParams,
        "YUYcyrU3zAYXGVdah"
      )
      .then(
        (response) => {
          alert("✅OTP sent successfully. Please check your email.");
          setOtpSent(true);
        },
        (error) => {
          alert("Failed to send OTP. Please try again.");
        }
      );
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert("✅OTP verified successfully.");
      alert("Enter Email and New Password.");
      setOtpVerified(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("https://qualace-recruitpro.onrender.com/api/admin/reset-password", {
        email,
        newPassword,
      });

      if (response.status === 200) {
        alert("Password reset successfully.✅");
        navigate("/admin-home");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 flex flex-col items-center justify-start font-poppins">
      <header className="w-full p-6 bg-white shadow-lg rounded-b-lg">
        <div className="flex items-center justify-start space-x-4">
          <img
            src="/Qualace.jpg"
            alt="Company Logo"
            className="w-40 h-25 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-bold text-black mb-1">
              Qualace Staffing Solutions LLP
            </h2>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Admin Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Forgot password?{" "}
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={handleForgotPassword}
          >
            Reset it here
          </a>
        </p>

        {otpSent && !otpVerified && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={verifyOtp}
              className="w-full py-2 mt-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              Verify OTP
            </button>
          </div>
        )}

        {otpVerified && (
          <div className="mt-6">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
      <div>
          <button
            onClick={navigateToRecruiterLogin}
            className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Recruiter Login
          </button>
        {/* Recruiter Login Button */}
      </div>
    </div>
  );
};

export default AdminLogin;
