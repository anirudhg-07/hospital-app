import React from 'react';
import { Link } from 'react-router-dom';
import sarahPhoto from '../assets/doctors/sarah.png';
import michaelPhoto from '../assets/doctors/michael.png';
import emilyPhoto from '../assets/doctors/emily.png';
import jamesPhoto from '../assets/doctors/james.png';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            {/* SECTION 1 - Navbar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                                🏥 HospitalApp
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-6 py-2.5 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* SECTION 2 - Hero Section */}
            <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold tracking-wide border border-blue-100">
                                Healthcare Made Simple 🏥
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Book Doctor <br />
                                <span className="text-blue-600">Appointments</span> <br />
                                with Ease
                            </h1>
                            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                                Skip the long queues. Book your appointment online, get a token number and know exactly when it's your turn.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300"
                                >
                                    Book Appointment
                                </Link>
                                <button className="px-8 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Right Illustration */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl -z-10"></div>
                            <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>

                                {/* Token Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 relative animate-bounce-slow">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-blue-600 font-bold">🎫 Token #3</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">Waiting</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg text-gray-800">Dr. Anirudh</h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                            🕒 Scheduled for 11:00 AM
                                        </p>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform rotate-2">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        👥 Queue Status
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">👤</div>
                                                <span className="text-sm font-medium text-gray-700">Patient #1</span>
                                            </div>
                                            <span className="text-xs text-green-600 font-bold">In Progress</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">👤</div>
                                                <span className="text-sm font-medium text-gray-700">Patient #2</span>
                                            </div>
                                            <span className="text-xs text-blue-600 font-bold">Next</span>
                                        </div>
                                        <div className="flex items-center justify-between opacity-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</div>
                                                <span className="text-sm font-medium text-gray-700">You (Token #3)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <style dangerouslySetInnerHTML={{
                                    __html: `
                  @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                  .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                  }
                `}} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 - Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HospitalApp?</h2>
                    <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
                        Experience the future of healthcare management with our intuitive features designed for your convenience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100 text-left">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                📅
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Easy Booking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Book appointments in less than 2 minutes from anywhere. Choose your preferred doctor and time slot instantly.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100 text-left">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                🎫
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Smart Queue</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get a token number and track your position in real time. No more sitting in crowded waiting rooms for hours.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100 text-left">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                📋
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Medical Records</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access your complete medical history anytime. Securely view prescriptions, lab reports, and doctor notes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 - How It Works */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-20">How It Works</h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
                        {/* Step 1 */}
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-blue-200">
                                1
                            </div>
                            <div className="text-4xl">👤</div>
                            <h3 className="text-xl font-bold">Create Account</h3>
                            <p className="text-gray-600">Register as a patient in seconds with minimal details.</p>
                        </div>

                        <div className="hidden md:block text-blue-200 text-4xl transform -mt-20">➜</div>

                        {/* Step 2 */}
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-blue-200">
                                2
                            </div>
                            <div className="text-4xl">📅</div>
                            <h3 className="text-xl font-bold">Book Appointment</h3>
                            <p className="text-gray-600">Choose your favorite doctor and select a convenient time slot.</p>
                        </div>

                        <div className="hidden md:block text-blue-200 text-4xl transform -mt-20">➜</div>

                        {/* Step 3 */}
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-blue-200">
                                3
                            </div>
                            <div className="text-4xl">🎫</div>
                            <h3 className="text-xl font-bold">Get Token</h3>
                            <p className="text-gray-600">Receive your token and track your queue position live.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 - Stats Section */}
            <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-2">
                            <div className="text-5xl font-extrabold">500+</div>
                            <div className="text-blue-100 text-lg">Doctors</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-extrabold">10,000+</div>
                            <div className="text-blue-100 text-lg">Patients</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-extrabold">98%</div>
                            <div className="text-blue-100 text-lg">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 - About Doctors */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Specialist Doctors</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Meet our team of highly qualified and experienced specialists dedicated to your well-being.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { name: "Dr. Sarah Johnson", specialty: "Cardiologist", image: sarahPhoto, experience: "12+ Years" },
                            { name: "Dr. Michael Chen", specialty: "Neurologist", image: michaelPhoto, experience: "10+ Years" },
                            { name: "Dr. Emily Brown", specialty: "Pediatrician", image: emilyPhoto, experience: "8+ Years" },
                            { name: "Dr. James Wilson", specialty: "Orthopedic", image: jamesPhoto, experience: "15+ Years" }
                        ].map((dr, index) => (
                            <div key={index} className="bg-gray-50 rounded-3xl p-6 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-blue-100 group">
                                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white shadow-lg group-hover:border-blue-600 transition-all duration-300">
                                    <img src={dr.image} alt={dr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{dr.name}</h3>
                                <p className="text-blue-600 font-medium mb-4">{dr.specialty}</p>
                                <div className="text-sm text-gray-500 bg-white inline-block px-3 py-1 rounded-full border border-gray-100">
                                    {dr.experience} Experience
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7 - Location Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 p-12 lg:p-20 space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-semibold border border-green-100">
                                Our Location 📍
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900">Visit Us at SRM Hospital</h2>
                            <p className="text-lg text-gray-600">
                                SRM Hospital, Kattankulathur is equipped with state-of-the-art facilities and a dedicated team of healthcare professionals.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">🏢</span>
                                    <div>
                                        <p className="font-bold text-gray-900">Address</p>
                                        <p className="text-gray-600">Potheri, SRM Nagar, Kattankulathur, Tamil Nadu 603203</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <p className="font-bold text-gray-900">Emergency Contact</p>
                                        <p className="text-gray-600">+91 44 2741 7000</p>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="https://www.google.com/maps/search/SRM+hospital+Kattankulathur"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all duration-300 shadow-xl"
                            >
                                Get Directions ↗️
                            </a>
                        </div>
                        <div className="lg:w-1/2 bg-blue-100 relative min-h-[400px] flex items-center justify-center overflow-hidden">
                            {/* Decorative Map Illustration */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                                    {[...Array(100)].map((_, i) => (
                                        <div key={i} className="border border-blue-600/10"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white shadow-2xl animate-bounce mb-4 mx-auto">
                                    📍
                                </div>
                                <p className="text-blue-900 font-bold bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
                                    Kattankulathur, Chennai
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8 - Footer */}
            <footer className="bg-gray-900 text-gray-300 py-20 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        <div>
                            <div className="text-2xl font-bold text-white mb-4">🏥 HospitalApp</div>
                            <p className="text-gray-500">
                                Your Health, Our Priority. Providing digital healthcare solutions for a better tomorrow.
                            </p>
                        </div>
                        <div className="flex justify-center flex-wrap gap-8 text-lg font-medium">
                            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
                            <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
                            <Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link>
                        </div>
                        <div className="text-right text-gray-500">
                            © 2026 HospitalApp. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
