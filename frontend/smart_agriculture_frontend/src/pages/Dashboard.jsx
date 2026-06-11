import React, { useState } from "react";
import { predictionService } from "../api/PredictionService";
import { weatherService } from "../api/WeatherService";

const TURKISH_REGIONS = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
  "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane",
  "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu",
  "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya",
  "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
];

/* ─── Shared Weather Auto-fill Button ──────────────────────────────────────── */
/**
 * Props:
 *   onFill(weatherData) – called with the weather object when fetch succeeds
 *   city               – optional city name to fetch by city instead of GPS
 */
const WeatherAutofill = ({ onFill, city }) => {
  const [loading, setLoading] = useState(false);
  const [badge, setBadge]     = useState(null);
  const [err,   setErr]       = useState("");
  const [selectedCity, setSelectedCity] = useState("auto"); // "auto" for GPS

  const fetch = async () => {
    setLoading(true); setErr(""); setBadge(null);
    try {
      let data;
      const targetCity = city || (selectedCity !== "auto" ? selectedCity : null);
      if (targetCity) {
        data = await weatherService.getByCity(targetCity);
      } else {
        data = await weatherService.getFromBrowserLocation();
      }
      if (data.error) { setErr(data.error); return; }
      onFill(data);
      setBadge(data);
    } catch (e) {
      setErr(typeof e === "string" ? e : e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {!city && (
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-sky-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-sky-50/50 text-sky-800 shadow-sm transition-all"
          >
            <option value="auto">📍 Use Device GPS Location</option>
            <optgroup label="Or select a Turkish City">
              {TURKISH_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </optgroup>
          </select>
        )}
        <button
          onClick={fetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-400/20 hover:shadow-blue-300/40 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Fetching weather…
            </>
          ) : (
            <>
              <span>{selectedCity !== "auto" || city ? "🌍" : "📍"}</span>
              {city ? `Auto-fill for ${city}` : (selectedCity === "auto" ? "Fetch via GPS" : `Auto-fill for ${selectedCity}`)}
            </>
          )}
        </button>
      </div>

      {badge && (
        <div className="fade-up mt-2 flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-sky-50/80 border border-sky-200/60 backdrop-blur-sm text-sm">
          <span className="text-sky-700 font-bold">🌤️ {badge.city}, {badge.country}</span>
          <span className="text-gray-500">{badge.description}</span>
          <span className="text-orange-600 font-semibold">🌡 {badge.temperature_c}°C</span>
          <span className="text-blue-600 font-semibold">💧 {badge.humidity_percent}%</span>
          {badge.rainfall_mm > 0 && <span className="text-blue-500 font-semibold">🌧 {badge.rainfall_mm} mm</span>}
          <span className="text-gray-400 text-[10px] ml-auto">Fields auto-filled ✓</span>
        </div>
      )}

      {err && (
        <div className="fade-up mt-2 px-4 py-2.5 rounded-xl bg-red-50/80 border border-red-200/60 text-red-600 text-sm">
          ⚠️ {err}
        </div>
      )}
    </div>
  );
};


const SEVERITY_STYLE = {
  Critical: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-500/30 shadow-lg",
  High: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-400/30 shadow-lg",
  Medium: "bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 shadow-yellow-300/30 shadow-lg",
  Low: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue-300/30 shadow-lg",
  Info: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-green-400/30 shadow-lg",
};

const InputField = ({ label, id, type = "number", step, value, onChange, placeholder, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-bold text-emerald-700/70 uppercase tracking-widest">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      step={step || "any"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="premium-input rounded-xl px-4 py-2.5 text-sm bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400"
    />
    {hint && <span className="text-[10px] text-gray-400 mt-0.5">{hint}</span>}
  </div>
);

const ResultCard = ({ children, color = "green" }) => (
  <div className={`fade-up mt-6 p-6 rounded-2xl border border-${color}-200/60 bg-gradient-to-br from-${color}-50/80 to-white shadow-xl shadow-${color}-100/40 backdrop-blur-sm`}>
    {children}
  </div>
);

const SpinnerBtn = ({ loading, onClick, label }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="tracking-wide">Analyzing…</span>
      </>
    ) : <span className="tracking-wide">{label}</span>}
  </button>
);

const ErrorAlert = ({ msg }) =>
  msg ? (
    <div className="fade-up mt-4 p-4 rounded-xl bg-red-50/80 border border-red-200/60 text-red-700 text-sm backdrop-blur-sm flex items-center gap-2">
      <span className="text-lg">⚠️</span> {msg}
    </div>
  ) : null;



const CropTab = () => {
  const [form, setForm] = useState({
    nitrogen: "", phosphorus: "", potassium: "",
    temp_celsius: "", humidity_percent: "", soil_ph: "", rainfall_mm: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)]));
      const res = await predictionService.predictCrop(payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const confidence_pct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div>
      <p className="text-gray-500/80 text-sm mb-4 leading-relaxed">
        Enter soil NPK levels, temperature, humidity, pH and rainfall to get the best crop recommendation.
      </p>
      <WeatherAutofill
        onFill={(w) => setForm(f => ({
          ...f,
          temp_celsius:     String(w.temp_celsius ?? w.temperature_c ?? ""),
          humidity_percent: String(w.humidity_percent ?? ""),
          rainfall_mm:      String(w.rainfall_mm ?? ""),
          nitrogen:         String(w.nitrogen ?? ""),
          phosphorus:       String(w.phosphorus ?? ""),
          potassium:        String(w.potassium ?? ""),
          soil_ph:          String(w.soil_ph ?? ""),
        }))}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          ["Nitrogen (N)", "nitrogen", "Valid range: 0 - 300 ppm"],
          ["Phosphorus (P)", "phosphorus", "Valid range: 0 - 100 ppm"],
          ["Potassium (K)", "potassium", "Valid range: 0 - 300 ppm"],
          ["Temp (°C)", "temp_celsius", "Valid range: -5 - 50 °C"],
          ["Humidity (%)", "humidity_percent", "Valid range: 20 - 100 %"],
          ["Soil pH", "soil_ph", "Valid range: 4.0 - 9.0"],
          ["Rainfall (mm)", "rainfall_mm", "Valid range: 0 - 1000 mm"],
        ].map(([label, id, hint]) => (
          <InputField key={id} label={label} id={id} value={form[id]} onChange={onChange} placeholder="Enter value" hint={hint} />
        ))}
      </div>
      <SpinnerBtn loading={loading} onClick={run} label="🌱 Recommend Crop" />
      <ErrorAlert msg={error} />
      {result && (
        <ResultCard color="green">
          {result.input_validation?.warnings && (
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-bold mb-1">Unrealistic Inputs Clamped</p>
                  <ul className="space-y-1 text-xs text-yellow-700 list-disc list-inside">
                    {result.input_validation.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🌾</span>
            <div>
              <p className="text-2xl font-extrabold text-green-700 capitalize">{result.crop}</p>
              <p className="text-sm text-gray-500">Confidence: <span className="font-bold text-green-600">{confidence_pct}%</span></p>
            </div>
            <div className="ml-auto w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center bg-white">
              <span className="text-green-600 font-extrabold text-sm">{confidence_pct}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Top Alternatives</p>
          <div className="flex gap-3 flex-wrap">
            {result.top_3?.map((item, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold capitalize">
                {item.crop} — {Math.round(item.confidence * 100)}%
              </span>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  );
};




const CROPS = [
  "Wheat", "Barley", "Maize", "Chick peas", "Lentils",
  "Apples", "Grapes", "Hazelnuts", "Olives", "Sugar Beet",
  "Sunflower", "Tea", "Tomatoes", "Walnuts", "Watermelons"
];

const YieldTab = () => {
  const [form, setForm] = useState({
    region: "Konya", crop: "Wheat",
    temperature_c: "", humidity_percent: "", rainfall_mm: "",
    wind_speed_ms: "", solar_radiation: "",
    soil_temp_0_7cm: "", soil_moisture_0_7cm: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const payload = { ...form };
      // Convert numeric strings to floats where set
      ["temperature_c", "humidity_percent", "rainfall_mm", "wind_speed_ms",
        "solar_radiation", "soil_temp_0_7cm", "soil_moisture_0_7cm"].forEach(
          k => { if (payload[k]) payload[k] = parseFloat(payload[k]); else delete payload[k]; }
        );
      const res = await predictionService.predictYield(payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const CATEGORY_COLOR = { Excellent: "text-green-600", Good: "text-lime-600", Average: "text-yellow-500", Poor: "text-red-500" };
  const gauge = result ? Math.round((result.yield_score / 10) * 100) : 0;

  return (
    <div>
      <p className="text-gray-500/80 text-sm mb-4 leading-relaxed">
        Select a Turkish region and crop, then provide current weather conditions to get a yield forecast (scored 1–10).
      </p>
      <WeatherAutofill
        city={form.region}
        onFill={(w) => setForm(f => ({
          ...f,
          temperature_c:      String(w.temperature_c ?? ""),
          humidity_percent:   String(w.humidity_percent ?? ""),
          rainfall_mm:        String(w.rainfall_mm ?? ""),
          wind_speed_ms:      String(w.wind_speed_ms ?? ""),
          solar_radiation:    String(w.solar_radiation ?? ""),
        }))}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</label>
          <select name="region" value={form.region} onChange={onChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm">
            {TURKISH_REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</label>
          <select name="crop" value={form.crop} onChange={onChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm">
            {CROPS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {[
          ["Temp (°C)", "temperature_c", "Range: -30 to 60 °C"],
          ["Humidity (%)", "humidity_percent", "Range: 0 to 100 %"],
          ["Rainfall (mm)", "rainfall_mm", "Range: 0 to 2000 mm"],
          ["Wind (m/s)", "wind_speed_ms", "Range: 0 to 100 m/s"],
          ["Solar Radiation", "solar_radiation", "Range: 0 to 100 MJ/m²"],
          ["Soil Temp 0-7cm", "soil_temp_0_7cm", "Range: -30 to 60 °C"],
          ["Soil Moisture 0-7cm", "soil_moisture_0_7cm", "Range: 0 to 100 %"],
        ].map(([label, id, hint]) => (
          <InputField key={id} label={label} id={id} value={form[id]} onChange={onChange} placeholder="optional" hint={hint} />
        ))}
      </div>
      <SpinnerBtn loading={loading} onClick={run} label="📊 Predict Yield" />
      <ErrorAlert msg={error} />
      {result && (
        <ResultCard color="blue">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 rotate-[-90deg]">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.8" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={gauge >= 80 ? "#16a34a" : gauge >= 60 ? "#65a30d" : gauge >= 40 ? "#eab308" : "#dc2626"}
                  strokeWidth="3.8"
                  strokeDasharray={`${gauge} ${100 - gauge}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-extrabold text-lg text-gray-700">{result.yield_score}</span>
              </div>
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${CATEGORY_COLOR[result.yield_category]}`}>
                {result.yield_category}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {result.yield_kg_ha ? `${result.yield_kg_ha.toLocaleString()} kg/ha` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">Yield Score <span className="font-bold">{result.yield_score}/10</span></p>
              <p className="text-xs text-gray-400 mt-1">{form.crop} — {form.region}</p>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
};


const DiseaseTab = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [inputMode, setInputMode] = useState("upload"); // 'upload' or 'camera'
  const [plantType, setPlantType] = useState("Auto");   // Plant-guided prediction

  const PLANT_OPTIONS = [
    "Auto", "Apple", "Bell Pepper", "Blueberry", "Cherry",
    "Corn", "Grape", "Orange", "Peach", "Potato",
    "Raspberry", "Soybean", "Squash", "Strawberry", "Tomato"
  ];

  // Camera states
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setError("");
    setPreview(null);
    setFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    setPreview(null);
    setFile(null);
    setResult(null);
    setError("");
    if (mode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const f = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          handleFile(f);
          stopCamera();
        }
      }, "image/jpeg", 0.9);
    }
  };

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const run = async () => {
    if (!file) { setError("Please provide a leaf image first."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      // Send plant_type only when user explicitly chose one
      if (plantType && plantType !== "Auto") fd.append("plant_type", plantType);
      const res = await predictionService.predictDisease(fd);
      setResult(res.data);
    } catch (e) {
      const detail = e.response?.data?.error || e.message;
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div>
      <p className="text-gray-500/80 text-sm mb-6 leading-relaxed">
        Provide a clear photo of a plant leaf using upload or camera.
        {" "}<span className="text-emerald-600 font-bold">MobileNetV2 model • 38 disease classes • 95.9% accuracy</span>
      </p>

      {/* Plant Type Selector — Guided Prediction */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          🌿 Select Plant Type <span className="text-emerald-600 font-bold">(Optional — improves accuracy!)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PLANT_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setPlantType(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                plantType === p
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {p === "Auto" ? "🤖 Auto" : p}
            </button>
          ))}
        </div>
        {plantType !== "Auto" && (
          <p className="mt-2 text-xs text-emerald-600 font-medium">
            ✅ Guided mode: AI will only check <strong>{plantType}</strong> diseases.
          </p>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-gray-100/70 p-1 rounded-xl w-full max-w-sm mx-auto mb-6 backdrop-blur-sm border border-gray-200/50">
        <button
          onClick={() => handleModeChange("upload")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${inputMode === "upload" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30" : "text-gray-500 hover:text-emerald-700"}`}
        >
          📁 Upload
        </button>
        <button
          onClick={() => handleModeChange("camera")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${inputMode === "camera" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30" : "text-gray-500 hover:text-emerald-700"}`}
        >
          📷 Camera
        </button>
      </div>

      {inputMode === "upload" && !preview && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${dragging ? "border-emerald-400 bg-emerald-50/60 shadow-inner" : "border-gray-300/80 bg-gradient-to-br from-gray-50/80 to-white hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
        >
          <div className="text-5xl mb-3 drop-shadow-sm">🍃</div>
          <p className="text-gray-500 text-sm font-medium">Drag & drop a leaf image here, or</p>
          <label className="mt-4 inline-block cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold">
            Browse File
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
          </label>
        </div>
      )}

      {inputMode === "camera" && !preview && (
        <div className="border border-emerald-500/30 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden relative min-h-[300px] flex items-center justify-center shadow-xl shadow-black/20">
          <video
            ref={videoRef}
            className={`w-full max-h-[400px] object-cover ${cameraActive ? "block" : "hidden"}`}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanning animation overlay */}
          {cameraActive && <div className="absolute inset-0 scan-anim pointer-events-none"></div>}
          
          {!cameraActive && !error && (
            <div className="text-center">
              <div className="animate-pulse text-4xl mb-3">📷</div>
              <p className="text-emerald-400/80 text-sm font-medium">Initializing camera...</p>
            </div>
          )}

          {cameraActive && (
            <button
              onClick={captureImage}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-white to-gray-100 p-2 rounded-full shadow-2xl border-4 border-emerald-400/50 hover:scale-110 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full border-3 border-white shadow-inner"></div>
            </button>
          )}
        </div>
      )}

      {preview && (
        <div className="border border-emerald-200/50 bg-gradient-to-br from-gray-50/80 to-emerald-50/30 rounded-2xl p-6 text-center mb-4 shadow-lg backdrop-blur-sm">
          <img src={preview} alt="Leaf preview" className="max-h-64 mx-auto rounded-xl shadow-xl object-contain mb-4 ring-2 ring-emerald-200/40" />
          {file && <p className="text-xs text-gray-400 mb-4 font-medium">{file.name}</p>}
          <div className="flex gap-3 justify-center">
             <button
                onClick={() => {
                   setPreview(null);
                   setFile(null);
                   if (inputMode === "camera") startCamera();
                }}
                className="py-2.5 px-6 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-all shadow-sm backdrop-blur-sm"
              >
                ↩ Retake
              </button>
             <SpinnerBtn loading={loading} onClick={run} label="🔬 Analyze Leaf" />
          </div>
        </div>
      )}

      {!preview && inputMode === "upload" && (
        <div className="mt-4">
          <SpinnerBtn loading={loading} onClick={run} label="🔬 Detect Disease" />
        </div>
      )}

      <ErrorAlert msg={error} />

      {result && (
        <ResultCard color={result.is_healthy ? "green" : "red"}>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{result.is_healthy ? "✅" : "🚨"}</div>
            <div className="flex-1">
              <p className="font-extrabold text-lg capitalize" style={{ color: result.is_healthy ? "#16a34a" : "#dc2626" }}>
                {result.disease?.replace(/___|__/g, " — ").replace(/_/g, " ")}
              </p>
              {/* Guided badge */}
              {result.plant_guided && (
                <span className="inline-block mt-1 mb-2 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  🌿 Guided: {result.plant_type} mode
                </span>
              )}
              <p className="text-sm text-gray-500 mb-2">
                Confidence: <span className="font-bold">{Math.round(result.confidence * 100)}%</span>
              </p>
              {/* Confidence Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(result.confidence * 100)}%`,
                    backgroundColor: result.confidence >= 0.8 ? "#16a34a" : result.confidence >= 0.5 ? "#eab308" : "#dc2626"
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-400">
                {result.confidence >= 0.8 ? "High confidence" : result.confidence >= 0.5 ? "Moderate confidence" : "Low confidence — consider re-uploading a clearer image"}
              </p>
            </div>
          </div>

          {/* Cause */}
          {result.cause && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 mb-3">
              <p className="font-semibold mb-1">🔍 Cause</p>
              <p>{result.cause}</p>
            </div>
          )}

          {/* Treatment */}
          {!result.is_healthy && result.treatment && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-3">
              <p className="font-semibold mb-1">💊 Treatment</p>
              <p>{result.treatment}</p>
            </div>
          )}

          {/* Prevention */}
          {result.prevention && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              <p className="font-semibold mb-1">🛡️ Prevention</p>
              <p>{result.prevention}</p>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
};



const RiskTab = () => {
  const [form, setForm] = useState({
    temperature_c: "", humidity_percent: "", rainfall_mm: "",
    soil_moisture_0_7cm: "", wind_speed_ms: "", solar_radiation_mj_m2_day: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "").map(([k, v]) => [k, parseFloat(v)])
      );
      const res = await predictionService.assessRisk(payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-gray-500/80 text-sm mb-4 leading-relaxed">
        Enter current field conditions to detect heat stress, frost, drought, fungal risks and more.
      </p>
      <WeatherAutofill
        onFill={(w) => setForm(f => ({
          ...f,
          temperature_c:             String(w.temperature_c ?? ""),
          humidity_percent:          String(w.humidity_percent ?? ""),
          rainfall_mm:               String(w.rainfall_mm ?? ""),
          wind_speed_ms:             String(w.wind_speed_ms ?? ""),
          solar_radiation_mj_m2_day: String(w.solar_radiation ?? ""),
        }))}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        {[
          ["Temperature (°C)", "temperature_c", "Range: -30 to 60 °C"],
          ["Humidity (%)", "humidity_percent", "Range: 0 to 100 %"],
          ["Rainfall (mm)", "rainfall_mm", "Range: 0 to 2000 mm"],
          ["Soil Moisture (0-7cm)", "soil_moisture_0_7cm", "Range: 0 to 100 %"],
          ["Wind Speed (m/s)", "wind_speed_ms", "Range: 0 to 100 m/s"],
          ["Solar Radiation (MJ/m²)", "solar_radiation_mj_m2_day", "Range: 0 to 100 MJ/m²"],
        ].map(([label, id, hint]) => (
          <InputField key={id} label={label} id={id} value={form[id]} onChange={onChange} placeholder="Enter value" hint={hint} />
        ))}
      </div>
      <SpinnerBtn loading={loading} onClick={run} label="⚠️ Assess Risks" />
      <ErrorAlert msg={error} />

      {result && (
        <div className="mt-6 space-y-3">
          {/* Summary Banner */}
          <div className={`p-4 rounded-xl flex items-center gap-3 ${result.all_clear ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
            <span className="text-3xl">{result.all_clear ? "🟢" : "🔴"}</span>
            <div>
              <p className="font-bold text-gray-700">
                {result.all_clear ? "All Clear — No active risks detected" : `${result.active_risks_count} Active Risk${result.active_risks_count > 1 ? "s" : ""}`}
              </p>
              {!result.all_clear && (
                <p className="text-sm text-gray-500">
                  Highest severity: <span className="font-semibold text-red-600">{result.highest_severity}</span>
                </p>
              )}
            </div>
          </div>
          {/* Risk Cards */}
          {result.active_risks?.map((risk, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-3">
              <span className={`px-2 py-1 rounded-lg text-xs font-bold h-fit ${SEVERITY_STYLE[risk.severity] || "bg-gray-200 text-gray-700"}`}>
                {risk.severity}
              </span>
              <div>
                <p className="font-semibold text-gray-700 text-sm">{risk.name}</p>
                <p className="text-xs text-gray-500 mt-1">{risk.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const TABS = [
  { id: "crop",    icon: "🌱", label: "Crop Rec",          Component: CropTab },
  { id: "yield",   icon: "📊", label: "Yield Predict",     Component: YieldTab },
  { id: "disease", icon: "🔬", label: "Disease Detect",    Component: DiseaseTab },
  { id: "risk",    icon: "⚠️",  label: "Risk Assessment",  Component: RiskTab },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("crop");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-transparent py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ─── Premium Header ─── */}
        <div className="relative mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#0a1f14] via-[#0f2e1d] to-[#1a4a2e] overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
              🌿
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                AI Predictions <span className="text-emerald-400">Dashboard</span>
              </h1>
              <p className="text-emerald-300/60 text-sm font-medium mt-0.5">
                Smart Agriculture intelligence • MobileNetV2 + Random Forest
              </p>
            </div>
          </div>
        </div>

        {/* ─── Premium Tab Bar ─── */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl glass-card shadow-lg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-green-600/30 tab-active"
                  : "text-gray-500 hover:bg-white/60 hover:text-emerald-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <div className="glass-card rounded-2xl shadow-lg p-6 md:p-8">
          {active && <active.Component />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

