import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const STATUS_STYLES = {
    waiting: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Waiting" },
    "in-progress": { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
    done: { bg: "bg-green-100", text: "text-green-700", label: "Done" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", label: "Cancelled" },
};

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [queue, setQueue] = useState([]);
    const [loadingQueue, setLoadingQueue] = useState(false);

    // Walk-in form
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Load logged-in user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // Load all doctors to choose from
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get("/api/doctors");
                const valid = (res.data || []).filter((d) => d && d._id && d.userId);
                setDoctors(valid);
                if (valid.length > 0) setSelectedDoctorId(valid[0]._id);
            } catch {
                setDoctors([]);
            }
        };
        fetchDoctors();
    }, []);

    // Fetch the selected doctor's queue for today
    const fetchQueue = useCallback(async (doctorId) => {
        if (!doctorId) return;
        setLoadingQueue(true);
        try {
            const res = await api.get(`/api/appointments/doctor/${doctorId}`);
            setQueue(res.data || []);
        } catch {
            setQueue([]);
        } finally {
            setLoadingQueue(false);
        }
    }, []);

    useEffect(() => {
        if (selectedDoctorId) fetchQueue(selectedDoctorId);
    }, [selectedDoctorId, fetchQueue]);

    const handleAddWalkIn = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMsg("");
        if (!selectedDoctorId || !name.trim()) {
            setErrorMsg("Please select a doctor and enter the patient's name.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post("/api/appointments/walk-in", {
                doctorId: selectedDoctorId,
                patientName: name.trim(),
                patientPhone: phone.trim(),
                reason: reason.trim(),
            });
            setMessage(`Added! ${name.trim()} is token #${res.data.tokenNumber}.`);
            setName("");
            setPhone("");
            setReason("");
            fetchQueue(selectedDoctorId);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Failed to add walk-in. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        try {
            await api.put(`/api/appointments/cancel/${appointmentId}`);
            setQueue((prev) =>
                prev.map((a) => (a._id === appointmentId ? { ...a, status: "cancelled" } : a))
            );
        } catch {
            alert("Failed to cancel. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);
    const waiting = queue.filter((a) => a.status === "waiting").length;

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🏥</span>
                            <span className="font-bold text-[#2563EB] text-lg">Reception Desk</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 hidden sm:block">
                                {user?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Add walk-in */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">Add Walk-in Patient</h2>
                        <p className="text-sm text-gray-400 mb-5">
                            Issues a token and adds them to the queue.
                        </p>

                        {message && (
                            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                                {message}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleAddWalkIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor</label>
                                <select
                                    value={selectedDoctorId}
                                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                >
                                    {doctors.length === 0 && <option value="">No doctors available</option>}
                                    {doctors.map((d) => (
                                        <option key={d._id} value={d._id}>
                                            Dr. {d.userId?.name} {d.specialization ? `— ${d.specialization}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Ramesh Kumar"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Reason <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. Fever"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#2563EB] text-white py-2.5 rounded-xl font-semibold hover:bg-[#1e3a8a] disabled:opacity-50 transition-all duration-200"
                            >
                                {submitting ? "Adding..." : "Add to Queue"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Queue */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Today's Queue
                                    {selectedDoctor && (
                                        <span className="text-gray-400 font-normal"> · Dr. {selectedDoctor.userId?.name}</span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-400">{waiting} waiting</p>
                            </div>
                            <button
                                onClick={() => fetchQueue(selectedDoctorId)}
                                className="px-3 py-1.5 text-sm font-medium text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                Refresh
                            </button>
                        </div>

                        {loadingQueue ? (
                            <p className="text-gray-400 text-center py-10">Loading queue...</p>
                        ) : queue.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No patients in the queue yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {queue.map((appt) => {
                                    const style = STATUS_STYLES[appt.status] || STATUS_STYLES.waiting;
                                    return (
                                        <div
                                            key={appt._id}
                                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-700 flex flex-col items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-[10px] font-medium leading-none">Token</span>
                                                    <span className="text-white text-lg font-extrabold leading-none">
                                                        #{appt.tokenNumber}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                                                        {appt.patientId?.name || appt.patientName || "Unknown"}
                                                        {appt.source === "walk-in" && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
                                                                Walk-in
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {appt.patientPhone && <span>📞 {appt.patientPhone} </span>}
                                                        {appt.reason && <span className="italic text-gray-400">· "{appt.reason}"</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                                    {style.label}
                                                </span>
                                                {appt.status === "waiting" && (
                                                    <button
                                                        onClick={() => handleCancel(appt._id)}
                                                        className="px-3 py-1.5 bg-white border border-gray-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-all duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
