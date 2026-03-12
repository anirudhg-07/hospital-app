import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STEPS = ["Choose Doctor", "Date & Time", "Confirmed!"];

const BookAppointment = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    // Step 1 state
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Step 2 state
    const [date, setDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [reason, setReason] = useState("");
    const [booking, setBooking] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Step 3 state
    const [tokenNumber, setTokenNumber] = useState(null);

    // Auth guard
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/doctors");
                setDoctors(res.data);
            } catch {
                setDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleBook = async () => {
        if (!date || !selectedSlot) {
            setErrorMsg("Please select a date and time slot.");
            return;
        }
        setErrorMsg("");
        setBooking(true);
        try {
            const res = await axios.post("http://localhost:8000/api/appointments/book", {
                patientId: user.id,
                doctorId: selectedDoctor._id,
                date,
                timeSlot: selectedSlot,
                reason,
            });
            setTokenNumber(res.data.tokenNumber);
            setStep(3);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setBooking(false);
        }
    };

    // Minimum date = today
    const today = new Date().toISOString().split("T")[0];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/patient-dashboard")}>
                            <span className="text-2xl">🏥</span>
                            <span className="text-xl font-bold text-[#2563EB]">HospitalApp</span>
                        </div>
                        <button
                            onClick={() => navigate("/patient-dashboard")}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] font-medium transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Book an Appointment</h1>
                    <p className="text-gray-500 mt-1">Choose a doctor and select a convenient time slot.</p>
                </div>

                {/* Step Indicator */}
                {step < 3 && (
                    <div className="flex items-center mb-10">
                        {STEPS.slice(0, 2).map((label, idx) => {
                            const num = idx + 1;
                            const active = step === num;
                            const done = step > num;
                            return (
                                <React.Fragment key={num}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${done ? "bg-green-500 text-white" : active ? "bg-[#2563EB] text-white" : "bg-gray-200 text-gray-400"}`}>
                                            {done ? "✓" : num}
                                        </div>
                                        <span className={`text-sm font-medium hidden sm:block ${active ? "text-[#2563EB]" : done ? "text-green-500" : "text-gray-400"}`}>{label}</span>
                                    </div>
                                    {idx < 1 && (
                                        <div className={`flex-1 h-0.5 mx-3 transition-colors duration-300 ${step > num ? "bg-green-400" : "bg-gray-200"}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* ──── STEP 1: Choose Doctor ──── */}
                {step === 1 && (
                    <div>
                        {loadingDoctors ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                                <p className="text-gray-400">Loading doctors...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-5xl">👨‍⚕️</span>
                                <p className="text-gray-500 text-lg font-medium">No doctors available yet</p>
                                <p className="text-gray-400 text-sm">Please check back later.</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-5">
                                {doctors.map((doc) => {
                                    const isSelected = selectedDoctor?._id === doc._id;
                                    return (
                                        <div
                                            key={doc._id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${isSelected ? "border-[#2563EB] shadow-md shadow-blue-100" : "border-gray-100"}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors duration-200 ${isSelected ? "bg-[#2563EB]" : "bg-blue-100"}`}>
                                                    👨‍⚕️
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold text-gray-800 truncate">
                                                        Dr. {doc.userId?.name || "Unknown"}
                                                    </h3>
                                                    <p className={`text-sm font-medium mt-0.5 ${isSelected ? "text-[#2563EB]" : "text-blue-500"}`}>
                                                        {doc.specialization}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {doc.experience} exp.
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            ₹{doc.fees} fee
                                                        </span>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {selectedDoctor && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-8 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                                >
                                    Continue
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ──── STEP 2: Date & Time ──── */}
                {step === 2 && selectedDoctor && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {/* Selected doctor summary */}
                        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-xl">
                                👨‍⚕️
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">Selected Doctor</p>
                                <p className="font-bold text-gray-800">Dr. {selectedDoctor.userId?.name || "Unknown"}</p>
                                <p className="text-sm text-[#2563EB]">{selectedDoctor.specialization}</p>
                            </div>
                            <button
                                onClick={() => { setStep(1); setSelectedSlot(""); setDate(""); setErrorMsg(""); }}
                                className="ml-auto text-sm text-gray-400 hover:text-gray-600 underline"
                            >
                                Change
                            </button>
                        </div>

                        {/* Date picker */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={date}
                                onChange={(e) => { setDate(e.target.value); setSelectedSlot(""); }}
                                className="w-full sm:w-64 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200"
                            />
                        </div>

                        {/* Time slots */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Available Time Slots
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {selectedDoctor.availableSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${selectedSlot === slot
                                            ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason for Visit <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                placeholder="e.g. Fever, chest pain, routine check-up..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent focus:bg-white transition duration-200 resize-none"
                            />
                        </div>

                        {/* Error message */}
                        {errorMsg && (
                            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMsg}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => { setStep(1); setErrorMsg(""); }}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleBook}
                                disabled={booking}
                                className="px-8 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            >
                                {booking ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ──── STEP 3: Success ──── */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        {/* Checkmark */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
                        <p className="text-gray-500 mb-8">Your appointment has been successfully confirmed.</p>

                        {/* Token Card */}
                        <div className="inline-block bg-gradient-to-br from-[#1e3a8a] to-[#2563EB] rounded-2xl p-8 text-white mb-8 w-full max-w-xs mx-auto shadow-xl shadow-blue-200">
                            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-2">Your Token</p>
                            <div className="text-7xl font-extrabold mb-4">#{tokenNumber}</div>
                            <div className="border-t border-white/20 pt-4 space-y-1 text-left">
                                <p className="text-blue-100 text-sm">
                                    <span className="font-semibold text-white">Doctor:</span> Dr. {selectedDoctor?.userId?.name}
                                </p>
                                <p className="text-blue-100 text-sm">
                                    <span className="font-semibold text-white">Specialization:</span> {selectedDoctor?.specialization}
                                </p>
                                <p className="text-blue-100 text-sm">
                                    <span className="font-semibold text-white">Date:</span> {date}
                                </p>
                                <p className="text-blue-100 text-sm">
                                    <span className="font-semibold text-white">Time:</span> {selectedSlot}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-8">
                            Please arrive 10 minutes before your scheduled time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedDoctor(null);
                                    setDate("");
                                    setSelectedSlot("");
                                    setReason("");
                                    setTokenNumber(null);
                                }}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                Book Another
                            </button>
                            <button
                                onClick={() => navigate("/patient-dashboard")}
                                className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookAppointment;
