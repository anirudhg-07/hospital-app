import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* ─── NAVBAR ─── */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🏥</span>
                            <span className="text-xl font-bold text-[#2563EB]">HospitalApp</span>
                        </div>

                        {/* Right: Welcome + Logout */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                Welcome, <span className="font-semibold text-gray-800">{user.name}!</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Greeting */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                    Good day, {user.name}! 👋
                </h1>

                {/* Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {/* Card 1: Book Appointment */}
                    <div
                        onClick={() => navigate("/book-appointment")}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 group"
                    >
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                            <span className="text-3xl">📅</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Book Appointment</h3>
                        <p className="text-sm text-gray-500">Schedule a visit with a doctor</p>
                    </div>

                    {/* Card 2: My Medical Records */}
                    <div
                        onClick={() => navigate("/my-records")}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-green-200 hover:-translate-y-1 transition-all duration-200 group"
                    >
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-200">
                            <span className="text-3xl">📋</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">My Records</h3>
                        <p className="text-sm text-gray-500">View your medical history</p>
                    </div>
                </div>

                {/* Upcoming Appointments Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">My Upcoming Appointments</h2>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-base">No upcoming appointments</p>
                        <p className="text-gray-300 text-sm mt-1">Book an appointment to get started</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
