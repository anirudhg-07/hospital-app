import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STATUS_STYLES = {
    waiting:       { bg: "bg-yellow-100", text: "text-yellow-700", label: "Waiting" },
    "in-progress": { bg: "bg-blue-100",   text: "text-blue-700",   label: "In Progress" },
    done:          { bg: "bg-green-100",  text: "text-green-700",  label: "Done" },
    cancelled:     { bg: "bg-red-100",    text: "text-red-600",    label: "Cancelled" },
};

const DoctorDashboard = () => {
    const [user, setUser] = useState(null);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [profileError, setProfileError] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const navigate = useNavigate();

    // Auth guard + load user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // Step 1: Find this doctor's Doctor-profile using their User ID
    useEffect(() => {
        if (!user?.id) return;
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/doctors/by-user/${user.id}`);
                setDoctorProfile(res.data);
            } catch {
                setProfileError(true);
            }
        };
        fetchProfile();
    }, [user]);

    // Step 2: Once we have the Doctor profile _id, fetch today's queue
    const fetchQueue = useCallback(async (doctorId) => {
        setLoadingAppts(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/appointments/doctor/${doctorId}`);
            setAppointments(res.data);
        } catch {
            setAppointments([]);
        } finally {
            setLoadingAppts(false);
        }
    }, []);

    useEffect(() => {
        if (doctorProfile?._id) {
            fetchQueue(doctorProfile._id);
        }
    }, [doctorProfile, fetchQueue]);

    // Update appointment status (in-progress / done)
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setUpdatingId(appointmentId);
        try {
            await axios.put(`http://localhost:8000/api/appointments/status/${appointmentId}`, {
                status: newStatus,
            });
            setAppointments((prev) =>
                prev.map((a) => a._id === appointmentId ? { ...a, status: newStatus } : a)
            );
        } catch {
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!user) return null;

    // Stats
    const totalToday = appointments.filter((a) => a.status !== "cancelled").length;
    const pending = appointments.filter((a) => a.status === "waiting").length;
    const inProgress = appointments.filter((a) => a.status === "in-progress").length;
    const done = appointments.filter((a) => a.status === "done").length;
    const activeQueue = appointments.filter((a) => a.status !== "done" && a.status !== "cancelled");

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* ─── NAVBAR ─── */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🏥</span>
                            <span className="text-xl font-bold text-[#2563EB]">HospitalApp</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                Dr. <span className="font-semibold text-gray-800">{user.name}</span>
                                {doctorProfile && (
                                    <span className="ml-1 text-blue-500">· {doctorProfile.specialization}</span>
                                )}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Good day, Dr. {user.name}! 👨‍⚕️
                </h1>
                <p className="text-gray-400 text-sm mb-8">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>

                {/* No doctor profile warning */}
                {profileError && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                        <span className="text-orange-400 text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-orange-700">Doctor profile not set up</p>
                            <p className="text-sm text-orange-600 mt-0.5">
                                Your doctor profile hasn't been created yet. Please contact admin to create a profile linked to your account. Without it, patients cannot book appointments with you.
                            </p>
                        </div>
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Today's Patients", value: totalToday, color: "text-[#2563EB]",  bg: "bg-blue-100",   icon: (
                            <svg className="w-7 h-7 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )},
                        { label: "Waiting",          value: pending,     color: "text-yellow-500", bg: "bg-yellow-100", icon: (
                            <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )},
                        { label: "In Progress",      value: inProgress,  color: "text-blue-500",   bg: "bg-blue-50",   icon: (
                            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        )},
                        { label: "Done",             value: done,        color: "text-green-600",  bg: "bg-green-100", icon: (
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )},
                    ].map(({ label, value, color, bg, icon }) => (
                        <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                                    <p className={`text-4xl font-bold ${color}`}>{value}</p>
                                </div>
                                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center`}>
                                    {icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Today's Queue */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-gray-800">Today's Queue</h2>
                        <button
                            onClick={() => doctorProfile && fetchQueue(doctorProfile._id)}
                            disabled={!doctorProfile}
                            className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {loadingAppts ? (
                        <div className="flex items-center justify-center py-10 gap-3">
                            <div className="w-6 h-6 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">Loading queue...</p>
                        </div>
                    ) : activeQueue.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-base">No patients in queue today</p>
                            <p className="text-gray-300 text-sm mt-1">New appointments will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeQueue.map((appt) => {
                                const statusStyle = STATUS_STYLES[appt.status] || STATUS_STYLES.waiting;
                                const isUpdating = updatingId === appt._id;
                                return (
                                    <div
                                        key={appt._id}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4 transition-all duration-200 ${
                                            appt.status === "in-progress"
                                                ? "border-blue-200 bg-blue-50"
                                                : "border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Token badge */}
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${appt.status === "in-progress" ? "bg-[#2563EB]" : "bg-gray-700"}`}>
                                                <span className="text-white text-xs font-medium leading-none">Token</span>
                                                <span className="text-white text-lg font-extrabold leading-none">#{appt.tokenNumber}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {appt.patientId?.name || "Unknown Patient"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    ⏰ {appt.timeSlot}
                                                    {appt.reason && <span className="ml-2 italic text-gray-400">· "{appt.reason}"</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:flex-shrink-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                {statusStyle.label}
                                            </span>
                                            {appt.status === "waiting" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, "in-progress")}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 transition-all duration-200"
                                                >
                                                    {isUpdating ? "..." : "Call In"}
                                                </button>
                                            )}
                                            {appt.status === "in-progress" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, "done")}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
                                                >
                                                    {isUpdating ? "..." : "Mark Done"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Completed section */}
                    {done > 0 && (
                        <div className="mt-6 pt-5 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-400 mb-3">Completed Today ({done})</p>
                            <div className="space-y-2">
                                {appointments.filter((a) => a.status === "done").map((appt) => (
                                    <div key={appt._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-100 opacity-70">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">#{appt.tokenNumber}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{appt.patientId?.name || "Unknown"}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600">✓ Done</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
