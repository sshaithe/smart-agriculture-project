import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ───────── Animated Counter ───────── */
const Counter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count}{suffix}</>;
};

/* ───────── Feature Card ───────── */
const FeatureCard = ({ icon, title, desc, color, delay, accuracy, model, specs }) => (
  <div
    className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${color}`}>
        {icon}
      </div>
      {accuracy && (
        <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
          {accuracy}
        </span>
      )}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
    {(model || specs) && (
      <div className="border-t border-gray-100 pt-3 space-y-1">
        {model && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Model:</span>
            <span className="text-xs font-semibold text-gray-600">{model}</span>
          </div>
        )}
        {specs && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Specs:</span>
            <span className="text-xs text-gray-500">{specs}</span>
          </div>
        )}
      </div>
    )}
  </div>
);

/* ───────── Navigation Card ───────── */
const NavCard = ({ icon, title, desc, to, navigate }) => (
  <button
    onClick={() => navigate(to)}
    className="group text-left bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 flex items-start gap-4"
  >
    <span className="text-3xl mt-1">{icon}</span>
    <div className="flex-1">
      <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{title}</h4>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
    <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

/* ───────── Typing Animation ───────── */
const TypingText = ({ texts, speed = 80, pause = 2000 }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(charIndex + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(charIndex - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    setDisplayText(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse text-green-400">|</span>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN HOME / LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent">

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-lime-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">AI-Powered Agriculture Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            Smart{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Agriculture
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-bold text-gray-600">
              <TypingText
                texts={[
                  "Predict crop yields with AI",
                  "Detect plant diseases instantly",
                  "Get smart crop recommendations",
                  "Assess agricultural risks",
                ]}
              />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed mb-10">
            Harness the power of machine learning to optimize your farming decisions.
            Our platform combines satellite weather data, soil analysis, and deep learning
            to help Turkish agricultural regions maximize their potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              🚀 Try the AI
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/service")}
              className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-2xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 flex items-center gap-3"
            >
              🗺️ Explore Regions
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 -mt-4 mb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["🌱", <Counter end={22} />, "Crop Species", "text-green-600"],
            ["🔬", <Counter end={38} />, "Disease Classes", "text-blue-600"],
            ["🏙️", <Counter end={81} />, "Turkish Cities", "text-purple-600"],
            ["📊", <Counter end={7} />, "Regions Covered", "text-orange-600"],
          ].map(([icon, value, label, color], i) => (
            <div key={i} className="text-center">
              <span className="text-2xl">{icon}</span>
              <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI FEATURES ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">What Our AI Can Do</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Four powerful AI modules working together to give you complete agricultural intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureCard
            icon="🌾"
            title="Crop Recommendation"
            desc="Enter your soil nutrients (N, P, K), temperature, humidity, pH, and rainfall. Our ML model analyzes 22 crop species to find the perfect match for your conditions."
            color="bg-gradient-to-br from-green-400 to-emerald-500 text-white"
            delay={0}
            accuracy="99.5%"
            model="Random Forest Classifier"
            specs="100 trees · max_depth=20 · 7 features"
          />
          <FeatureCard
            icon="📈"
            title="Yield Prediction"
            desc="Predicts expected harvest (kg/ha) using FAOSTAT historical data combined with regional climate multipliers. Covers 15 crop types across all 7 Turkish regions."
            color="bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
            delay={100}
            accuracy="R² 0.93"
            model="Random Forest Regressor"
            specs="200 trees · max_depth=15 · FAOSTAT data"
          />
          <FeatureCard
            icon="🦠"
            title="Disease Detection"
            desc="Upload a photo of a plant leaf and our CNN deep learning model identifies diseases across 38 classes — with specific cause, treatment, and prevention advice."
            color="bg-gradient-to-br from-red-400 to-rose-500 text-white"
            delay={200}
            accuracy="96.2%"
            model="CNN (Deep Learning)"
            specs="224×224 input · Keras · 38 classes"
          />
          <FeatureCard
            icon="⚡"
            title="Risk Assessment"
            desc="Evaluates environmental risk factors (drought, frost, heat stress, disease pressure) based on real-time weather inputs to protect your crops."
            color="bg-gradient-to-br from-amber-400 to-orange-500 text-white"
            delay={300}
            accuracy="Rule-based"
            model="Expert System Engine"
            specs="6 risk categories · real-time scoring"
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16 mb-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["01", "Input Your Data", "Enter soil parameters, weather data, or upload a leaf image through our intuitive interface.", "from-green-500 to-emerald-600"],
              ["02", "AI Analysis", "Our machine learning models process your data using trained algorithms and historical patterns.", "from-blue-500 to-indigo-600"],
              ["03", "Get Results", "Receive instant predictions with confidence scores, treatment plans, and actionable recommendations.", "from-purple-500 to-violet-600"],
            ].map(([num, title, desc, gradient]) => (
              <div key={num} className="relative">
                <span className={`text-6xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent opacity-30`}>{num}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK NAVIGATION ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Quick Access</h2>
          <p className="text-gray-500">Jump into any section of the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavCard icon="🤖" title="AI Dashboard" desc="Access all 4 AI prediction models in one place" to="/dashboard" navigate={navigate} />
          <NavCard icon="🗺️" title="Map Services" desc="Interactive Turkey map with regional agricultural data" to="/service" navigate={navigate} />
          <NavCard icon="📋" title="Observation History" desc="View, add, edit, and delete environmental sensor records" to="/background" navigate={navigate} />
          <NavCard icon="ℹ️" title="About the Project" desc="Learn about the technology stack and team behind the platform" to="/about" navigate={navigate} />
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Built With</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              "🐍 Python / Flask",
              "⚛️ React",
              "🧠 TensorFlow",
              "📊 Scikit-learn",
              "🗄️ SQLite",
              "🎨 Tailwind CSS",
              "🔐 JWT Auth",
              "🌐 REST API",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-600 border border-gray-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-10 shadow-2xl shadow-green-200">
          <h2 className="text-3xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-green-100 mb-8 max-w-md mx-auto">
            Start making smarter agricultural decisions today with our AI-powered tools.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-2xl hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            🚀 Launch AI Dashboard
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
