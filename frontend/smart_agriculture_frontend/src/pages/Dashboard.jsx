import React, { useState } from "react";
import { predictionService } from "../api/PredictionService";


const SEVERITY_STYLE = {
  Critical: "bg-red-600 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-yellow-400 text-gray-900",
  Low: "bg-blue-400  text-white",
  Info: "bg-green-500 text-white",
};

const InputField = ({ label, id, type = "number", step, value, onChange, placeholder, hint }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
    />
    {hint && <span className="text-[10px] text-gray-400 mt-0.5">{hint}</span>}
  </div>
);

const ResultCard = ({ children, color = "green" }) => (
  <div className={`mt-6 p-5 rounded-2xl border border-${color}-200 bg-${color}-50 shadow`}>
    {children}
  </div>
);

const SpinnerBtn = ({ loading, onClick, label }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Running…
      </>
    ) : label}
  </button>
);

const ErrorAlert = ({ msg }) =>
  msg ? (
    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">⚠️ {msg}</div>
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
      <p className="text-gray-500 text-sm mb-6">
        Enter soil NPK levels, temperature, humidity, pH and rainfall to get the best crop recommendation.
      </p>
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
      <p className="text-gray-500 text-sm mb-6">
        Select a Turkish region and crop, then provide current weather conditions to get a yield forecast (scored 1–10).
      </p>
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
    if (!file) { setError("Please upload a leaf image first."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await predictionService.predictDisease(file);
      setResult(res.data);
    } catch (e) {
      const detail = e.response?.data?.error || e.message;
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">
        Upload a clear photo of a plant leaf. The AI will detect any disease and suggest treatment advice.
        {" "}<span className="text-green-600 font-semibold">CNN model ready 38 disease classes supported.</span>
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-green-400"
          }`}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Leaf preview" className="max-h-48 rounded-xl shadow-md object-contain" />
            <p className="text-xs text-gray-400">{file.name}</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-3">🍃</div>
            <p className="text-gray-500 text-sm">Drag & drop a leaf image here, or</p>
          </>
        )}
        <label className="mt-3 inline-block cursor-pointer bg-white border border-gray-300 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all">
          Browse File
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
        </label>
      </div>

      <div className="mt-4">
        <SpinnerBtn loading={loading} onClick={run} label="🔬 Detect Disease" />
      </div>
      <ErrorAlert msg={error} />

      {result && (
        <ResultCard color={result.is_healthy ? "green" : "red"}>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{result.is_healthy ? "✅" : "🚨"}</div>
            <div className="flex-1">
              <p className="font-extrabold text-lg capitalize" style={{ color: result.is_healthy ? "#16a34a" : "#dc2626" }}>
                {result.disease?.replace(/___|__/g, " — ").replace(/_/g, " ")}
              </p>
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
      <p className="text-gray-500 text-sm mb-6">
        Enter current field conditions to detect heat stress, frost, drought, fungal risks and more.
      </p>
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
  { id: "crop", label: "🌱 Crop Recommendation", Component: CropTab },
  { id: "yield", label: "📊 Yield Prediction", Component: YieldTab },
  { id: "disease", label: "🔬 Disease Detection", Component: DiseaseTab },
  { id: "risk", label: "⚠️ Risk Assessment", Component: RiskTab },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("crop");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">🤖 AI Predictions Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Smart Agriculture intelligence powered by trained ML models
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8">
          {active && <active.Component />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
