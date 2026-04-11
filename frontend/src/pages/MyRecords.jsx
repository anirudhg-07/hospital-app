import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const MyRecords = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/records/patient/${user.id}`);
        setRecords(res.data || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load records");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user]);

  const grouped = useMemo(() => records, [records]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/patient-dashboard")}
              className="text-sm font-medium text-[#2563EB] hover:underline"
            >
              ← Back
            </button>
            <div className="text-xl font-bold text-[#2563EB]">My Medical Records</div>
            <div className="w-10" />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <div className="w-6 h-6 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading records...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500 font-medium">No records yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Once a doctor completes your appointment and adds a diagnosis/prescription, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Doctor</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {r.doctorId?.userId?.name || "Doctor"}
                      {r.doctorId?.specialization ? (
                        <span className="ml-2 text-sm font-medium text-blue-500">· {r.doctorId.specialization}</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500">Diagnosis</p>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.diagnosis || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500">Symptoms</p>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.symptoms || "—"}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.notes || "—"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Medicines</p>
                  {Array.isArray(r.medicines) && r.medicines.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Name</th>
                            <th className="py-2 pr-4">Dosage</th>
                            <th className="py-2 pr-4">Frequency</th>
                            <th className="py-2 pr-4">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.medicines.map((m, idx) => (
                            <tr key={`${r._id}-m-${idx}`} className="border-t border-gray-100">
                              <td className="py-2 pr-4 font-medium text-gray-800">{m.name}</td>
                              <td className="py-2 pr-4 text-gray-600">{m.dosage || "—"}</td>
                              <td className="py-2 pr-4 text-gray-600">{m.frequency || "—"}</td>
                              <td className="py-2 pr-4 text-gray-600">{m.duration || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRecords;
