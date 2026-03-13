import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const STATUS_STYLES = {
    waiting:     { bg: "bg-yellow-100", text: "text-yellow-700", label: "Waiting" },
    "in-progress": { bg: "bg-blue-100",   text: "text-blue-700",   label: "In Progress" },
    done:        { bg: "bg-green-100",  text: "text-green-700",  label: "Done" },
    cancelled:   { bg: "bg-red-100",    text: "text-red-600",    label: "Cancelled" },
};

const PatientDashboard = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loadingAppts, setLoadingAppts] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const fetchAppointments = useCallback(async (patientId) => {
        setLoadingAppts(true);
        try {
            const res = await api.get(`/api/appointments/patient/${patientId}`);
            setAppointments(res.data);
        } catch {
            setAppointments([]);
        } finally {
            setLoadingAppts(false);
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchAppointments(user.id);
        }
    }, [user, fetchAppointments]);

    const handleCancel = async (appointmentId) => {
        setCancellingId(appointmentId);
        try {
            await api.put(`/api/appointments/cancel/${appointmentId}`);
            // Update the local state immediately for instant UI feedback
            setAppointments((prev) =>
                prev.map((a) => a._id === appointmentId ? { ...a, status: "cancelled" } : a)
            );
        } catch (err) {
            alert("Failed to cancel. Please try again.");
        } finally {
            setCancellingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!user) return null;

    const activeAppointments = appointments.filter((a) => a.status !== "cancelled" && a.status !== "done");
    const pastAppointments = appointments.filter((a) => a.status === "cancelled" || a.status === "done");

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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-gray-800">My Upcoming Appointments</h2>
                        <button
                            onClick={() => fetchAppointments(user.id)}
                            className="text-sm text-[#2563EB] font-medium hover:underline flex items-center gap-1"
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
                            <p className="text-gray-400 text-sm">Loading appointments...</p>
                        </div>
                    ) : activeAppointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-base">No upcoming appointments</p>
                            <p className="text-gray-300 text-sm mt-1">Book an appointment to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeAppointments.map((appt) => {
                                const statusStyle = STATUS_STYLES[appt.status] || STATUS_STYLES.waiting;
                                return (
                                    <div key={appt._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-4">
                                            {/* Token badge */}
                                            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs font-medium leading-none">Token</span>
                                                <span className="text-white text-lg font-extrabold leading-none">#{appt.tokenNumber}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    Dr. {appt.doctorId?.name || appt.doctorId?.userId?.name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {appt.date} · {appt.timeSlot}
                                                </p>
                                                {appt.reason && (
                                                    <p className="text-xs text-gray-400 mt-0.5 italic">"{appt.reason}"</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                {statusStyle.label}
                                            </span>
                                            {appt.status === "waiting" && (
                                                <button
                                                    onClick={() => handleCancel(appt._id)}
                                                    disabled={cancellingId === appt._id}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-all duration-200"
                                                >
                                                    {cancellingId === appt._id ? "..." : "Cancel"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Past Appointments</h2>
                        <div className="space-y-3">
                            {pastAppointments.map((appt) => {
                                const statusStyle = STATUS_STYLES[appt.status] || STATUS_STYLES.done;
                                return (
                                    <div key={appt._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 opacity-70">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-300 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs font-medium leading-none">Token</span>
                                                <span className="text-white text-lg font-extrabold leading-none">#{appt.tokenNumber}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-600 text-sm">
                                                    Dr. {appt.doctorId?.name || appt.doctorId?.userId?.name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{appt.date} · {appt.timeSlot}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                            {statusStyle.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientDashboard;
