import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");

        try {
            await axios.post("http://localhost:8000/api/auth/register", {
                name,
                email,
                password,
                role,
            });
            setSuccessMsg("Account created! Redirecting to login...");
            setName("");
            setEmail("");
            setPassword("");
            setRole("");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setErrorMsg(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ─── LEFT SIDE: GRADIENT PANEL ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#2563EB] flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/2 right-[-40px] w-40 h-40 bg-white/5 rounded-full"></div>

                <div className="relative z-10 text-center">
                    <span className="text-7xl block mb-4">🏥</span>
                    <h1 className="text-4xl font-bold text-white mb-3">HospitalApp</h1>
                    <p className="text-blue-200 text-lg mb-10">Join thousands of patients</p>

                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Easy appointment booking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Digital medical records</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Real-time queue tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── RIGHT SIDE: REGISTER FORM ─── */}
            <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile header (shows only on small screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-5xl block mb-2">🏥</span>
                        <h1 className="text-2xl font-bold text-[#2563EB]">HospitalApp</h1>
                        <p className="text-gray-400 text-sm mt-1">Join thousands of patients</p>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
                    <p className="text-gray-400 mb-8">Start your healthcare journey</p>

                    {/* Success Message */}
                    {successMsg && (
                        <div className="mb-5 p-3.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {successMsg}
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMsg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                I am a
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200"
                                >
                                    <option value="">Select Role</option>
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                                {/* Custom dropdown arrow */}
                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#2563EB] font-semibold hover:underline"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
