import React, { useEffect, useState } from "react";
import { observationService } from "../api/ObservationService";
import { regionService } from "../api/RegionService";
import { cityService } from "../api/CityService";
import { cropService } from "../api/CropService";

const Background = () => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Lookup data for dropdowns
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [crops, setCrops] = useState([]);

  const emptyForm = {
    region_id: "", city_id: "", crop_id: "", year: new Date().getFullYear(),
    latitude: "", longitude: "",
    t2m: "", t2m_max: "", t2m_min: "",
    rh2m: "", prectotcorr: "", ws2m: "", allsky_sfc_sw_dwn: "",
    soil_temp_0_7: "", soil_temp_7_28: "",
    soil_moisture_0_7: "", soil_moisture_7_28: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchObservations();
    fetchLookups();
  }, []);

  const fetchObservations = async () => {
    try {
      setLoading(true);
      const response = await observationService.getAllObservations();
      const rawData = response.observations || response.observation || response;
      setObservations(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Error fetching observations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const [regRes, cityRes, cropRes] = await Promise.all([
        regionService.getAllRegions(),
        cityService.getAllCities(),
        cropService.getAllCrops(),
      ]);
      setRegions(regRes.regions || regRes || []);
      setCities(cityRes.cities || cityRes.city || cityRes || []);
      setCrops(cropRes.crops || cropRes.crop || cropRes || []);
    } catch (err) {
      console.error("Error fetching lookup data:", err);
    }
  };

  useEffect(() => {
    if (form.region_id) {
      const regionCities = cities.filter(
        (c) => String(c.region_id) === String(form.region_id)
      );
      setFilteredCities(regionCities);
      if (!regionCities.find((c) => String(c.id) === String(form.city_id))) {
        setForm((prev) => ({ ...prev, city_id: "" }));
      }
    } else {
      setFilteredCities(cities);
    }
  }, [form.region_id, cities]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildPayload = () => {
    const payload = {};
    for (const [key, val] of Object.entries(form)) {
      if (val === "" || val === null || val === undefined) continue;
      if (["region_id", "city_id", "crop_id", "year"].includes(key)) {
        payload[key] = parseInt(val);
      } else {
        payload[key] = parseFloat(val);
      }
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const payload = buildPayload();
      if (editingId) {
        await observationService.updateObservation(editingId, payload);
        setSuccess("Observation updated successfully!");
      } else {
        await observationService.createObservation(payload);
        setSuccess("Observation added successfully!");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchObservations();
      setTimeout(() => { setShowForm(false); setSuccess(""); }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (obs) => {
    setEditingId(obs.id);
    setForm({
      region_id: obs.region_id || "",
      city_id: obs.city_id || "",
      crop_id: obs.crop_id || "",
      year: obs.year || new Date().getFullYear(),
      latitude: obs.latitude ?? "",
      longitude: obs.longitude ?? "",
      t2m: obs.t2m ?? "",
      t2m_max: obs.t2m_max ?? "",
      t2m_min: obs.t2m_min ?? "",
      rh2m: obs.rh2m ?? "",
      prectotcorr: obs.prectotcorr ?? "",
      ws2m: obs.ws2m ?? "",
      allsky_sfc_sw_dwn: obs.allsky_sfc_sw_dwn ?? "",
      soil_temp_0_7: obs.soil_temp_0_7 ?? "",
      soil_temp_7_28: obs.soil_temp_7_28 ?? "",
      soil_moisture_0_7: obs.soil_moisture_0_7 ?? "",
      soil_moisture_7_28: obs.soil_moisture_7_28 ?? "",
    });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this observation?")) return;
    try {
      await observationService.deleteObservation(id);
      fetchObservations();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete observation.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const selectClass =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm w-full";
  const inputClass = selectClass;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              📋 Observation History
            </h1>
            <p className="text-gray-500 mt-1">
              Environmental sensor data records for Turkish agricultural regions
            </p>
          </div>
          <button
            onClick={() => { if (showForm) handleCancel(); else { setShowForm(true); setEditingId(null); setForm(emptyForm); } }}
            className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {showForm ? "✕ Close" : "＋ Add Observation"}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? `Edit Observation #${editingId}` : "Add New Observation"}
            </h2>
            <form onSubmit={handleSubmit}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Location & Crop
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Region</label>
                  <select name="region_id" value={form.region_id} onChange={onChange} required className={selectClass}>
                    <option value="">Select region</option>
                    {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">City</label>
                  <select name="city_id" value={form.city_id} onChange={onChange} required className={selectClass}>
                    <option value="">Select city</option>
                    {filteredCities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Crop</label>
                  <select name="crop_id" value={form.crop_id} onChange={onChange} required className={selectClass}>
                    <option value="">Select crop</option>
                    {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Year</label>
                  <input name="year" type="number" value={form.year} onChange={onChange} required className={inputClass} />
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Weather Data</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  ["Temp (°C)", "t2m", "e.g. 22.5"],
                  ["Temp Max (°C)", "t2m_max", "e.g. 28.0"],
                  ["Temp Min (°C)", "t2m_min", "e.g. 15.0"],
                  ["Humidity (%)", "rh2m", "e.g. 65"],
                  ["Rainfall (mm)", "prectotcorr", "e.g. 2.5"],
                  ["Wind Speed (m/s)", "ws2m", "e.g. 3.1"],
                  ["Solar Radiation", "allsky_sfc_sw_dwn", "e.g. 18.45"],
                ].map(([label, name, placeholder]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
                    <input name={name} type="number" step="any" value={form[name]} onChange={onChange} placeholder={placeholder} className={inputClass} />
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Soil Data</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  ["Soil Temp 0-7cm (°C)", "soil_temp_0_7", "e.g. 20"],
                  ["Soil Temp 7-28cm (°C)", "soil_temp_7_28", "e.g. 18"],
                  ["Soil Moisture 0-7cm", "soil_moisture_0_7", "e.g. 0.25"],
                  ["Soil Moisture 7-28cm", "soil_moisture_7_28", "e.g. 0.28"],
                ].map(([label, name, placeholder]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
                    <input name={name} type="number" step="any" value={form[name]} onChange={onChange} placeholder={placeholder} className={inputClass} />
                  </div>
                ))}
              </div>

              {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">⚠️ {error}</div>}
              {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">✅ {success}</div>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? "Saving..." : editingId ? "✏️ Update Observation" : "💾 Save Observation"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="py-3 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading observations...</p>
        ) : (
          <div className="relative overflow-x-auto shadow-2xl sm:rounded-3xl border border-gray-100">
            <table className="w-full text-sm text-left text-gray-500 bg-white">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
                <tr>
                  <th className="px-5 py-4 font-black tracking-wider">Location & Crop</th>
                  <th className="px-5 py-4 font-black tracking-wider">Temperature</th>
                  <th className="px-5 py-4 font-black tracking-wider">Humidity & Rain</th>
                  <th className="px-5 py-4 font-black tracking-wider">Wind & Solar</th>
                  <th className="px-5 py-4 font-black tracking-wider">Soil (0-7cm)</th>
                  <th className="px-5 py-4 font-black tracking-wider">Soil (7-28cm)</th>
                  <th className="px-5 py-4 font-black tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {observations.length > 0 ? (
                  observations.map((row, i) => (
                    <tr key={row.id || i} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900">{row.city_name || `City #${row.city_id}`}</div>
                        <div className="text-xs text-blue-500 font-medium">{row.region_name || `Region #${row.region_id}`}</div>
                        <div className="text-xs text-gray-400 mt-0.5">🌾 {row.crop_name || `Crop #${row.crop_id}`} — {row.year}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-orange-600 font-extrabold text-lg">{row.t2m != null ? `${row.t2m}°C` : "—"}</span>
                        <div className="text-[10px] text-gray-400">Min: {row.t2m_min ?? "—"}° / Max: {row.t2m_max ?? "—"}°</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span className="font-medium text-gray-700">{row.rh2m != null ? `${row.rh2m}%` : "—"}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">🌧️ {row.prectotcorr != null ? `${row.prectotcorr} mm` : "—"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs space-y-1 text-gray-600 font-medium">
                          <div>💨 {row.ws2m != null ? `${row.ws2m} m/s` : "—"}</div>
                          <div>☀️ {row.allsky_sfc_sw_dwn != null ? row.allsky_sfc_sw_dwn : "—"}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 bg-green-50/20">
                        <div className="text-xs font-bold text-green-700">Moisture: {row.soil_moisture_0_7 != null ? row.soil_moisture_0_7 : "—"}</div>
                        <div className="text-[10px] text-green-600/70">Temp: {row.soil_temp_0_7 != null ? `${row.soil_temp_0_7}°C` : "—"}</div>
                      </td>
                      <td className="px-5 py-4 bg-orange-50/20">
                        <div className="text-xs font-bold text-orange-700">Moisture: {row.soil_moisture_7_28 != null ? row.soil_moisture_7_28 : "—"}</div>
                        <div className="text-[10px] text-orange-600/70">Temp: {row.soil_temp_7_28 != null ? `${row.soil_temp_7_28}°C` : "—"}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(row)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400 italic">
                      No observations recorded yet. Click "Add Observation" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Background;
