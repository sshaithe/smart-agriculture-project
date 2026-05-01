import React, { useState, useEffect } from "react";
import { authService } from "../api/AuthService";
import { useNavigate } from "react-router-dom";


const UserIcon = () => (
  <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PRED_ICONS = { crop: "🌱", yield: "📊", disease: "🔬", risk: "⚠️" };
const PRED_LABELS = { crop: "Crop Rec.", yield: "Yield Pred.", disease: "Disease Det.", risk: "Risk Assess." };

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/sign-in");
      return;
    }
    loadProfile();
    loadPredictions();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.user);
      setEditData({ username: res.user.username || "", email: res.user.email });
    } catch (err) {
      setError("Failed to load profile. Please log in again.");
      authService.logout();
      setTimeout(() => navigate("/sign-in"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const loadPredictions = async () => {
    try {
      const res = await authService.getUserPredictions();
      setPredictions(res.predictions || []);
    } catch {
     
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await authService.updateProfile(editData);
      setUser(res.user);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

 
  const statCounts = { crop: 0, yield: 0, disease: 0, risk: 0 };
  predictions.forEach((p) => { if (statCounts[p.prediction_type] !== undefined) statCounts[p.prediction_type]++; });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Profile Card ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500" />

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <UserIcon />
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">⚠️ {error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">✅ {success}</div>
            )}

            {editing ? (
              /* ── Edit Mode ──────────────────────────────────── */
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditData({ username: user.username || "", email: user.email }); }}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── View Mode ──────────────────────────────────── */
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    {user?.username || "No Username Set"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg transition-all border border-red-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statCounts).map(([key, count]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className="text-2xl mb-1">{PRED_ICONS[key]}</div>
              <p className="text-2xl font-extrabold text-gray-800">{count}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{PRED_LABELS[key]}</p>
            </div>
          ))}
        </div>

        {/* ── Prediction History ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Prediction History</h2>
          <p className="text-sm text-gray-500 mb-5">All your AI analysis records</p>

          {predictions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 text-sm">No predictions yet. Head to the <span className="font-semibold text-green-600 cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>AI Dashboard</span> to get started!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {predictions.map((p) => (
                <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl mt-0.5">{PRED_ICONS[p.prediction_type] || "🔮"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm capitalize">
                        {PRED_LABELS[p.prediction_type] || p.prediction_type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                        {p.prediction_type}
                      </span>
                    </div>
                    {/* Show key result info based on type */}
                    <p className="text-xs text-gray-500 truncate">
                      {p.prediction_type === "crop" && p.result?.crop && `Recommended: ${p.result.crop}`}
                      {p.prediction_type === "yield" && p.result?.yield_category && `Category: ${p.result.yield_category} — Score: ${p.result.yield_score}/10`}
                      {p.prediction_type === "disease" && p.result?.disease && `Detected: ${p.result.disease.replace(/_/g, " ")}`}
                      {p.prediction_type === "risk" && `Risks: ${p.result?.active_risks_count ?? 0} active`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{p.created_at}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
