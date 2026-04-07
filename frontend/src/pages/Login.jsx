import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            const role = user.role.toLowerCase();
            if (role === "patient") {
                navigate("/patient-dashboard");
            } else if (role === "doctor") {
                navigate("/doctor-dashboard");
            }
        } catch (err) {
            setErrorMsg(
                err.response?.data?.message || "Login failed. Please try again."
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
                    <p className="text-blue-200 text-lg mb-10">Your Health, Our Priority</p>

                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Book appointments easily</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Track your medical history</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-white text-base">Reduce waiting time</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── RIGHT SIDE: LOGIN FORM ─── */}
            <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile header (shows only on small screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-5xl block mb-2">🏥</span>
                        <h1 className="text-2xl font-bold text-[#2563EB]">HospitalApp</h1>
                        <p className="text-gray-400 text-sm mt-1">Your Health, Our Priority</p>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
                    <p className="text-gray-400 mb-8">Login to your account</p>

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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200"
                        >
                            Login
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-[#2563EB] font-semibold hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
