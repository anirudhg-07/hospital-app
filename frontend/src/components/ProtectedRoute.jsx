import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - If not logged in → redirect to /login
 * - If logged in but wrong role → redirect to the correct dashboard
 * - If all good → render the page
 *
 * Usage:
 *   <ProtectedRoute role="patient"> <PatientDashboard /> </ProtectedRoute>
 *   <ProtectedRoute role="doctor">  <DoctorDashboard />  </ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
    const storedUser = localStorage.getItem("user");

    // Not logged in → go to login
    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(storedUser);

    // Wrong role → redirect to their correct dashboard
    if (role && user.role !== role) {
        if (user.role === "patient") return <Navigate to="/patient-dashboard" replace />;
        if (user.role === "doctor")  return <Navigate to="/doctor-dashboard"  replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
