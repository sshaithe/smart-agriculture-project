import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS_DATA } from "../../../features/map_model";

// ── Yield badge colour ────────────────────────────────────────────
const YIELD_STYLE = {
  Excellent: "bg-green-500 text-white",
  Good:      "bg-lime-500  text-white",
  Average:   "bg-yellow-400 text-gray-800",
  Poor:      "bg-red-400   text-white",
};

// ── Region hover colours (from the user-provided HTML) ────────────
const REGION_HOVER_FILL = {
  marmara:       "rgba(24,  95, 165, 0.40)",
  aegean:        "rgba(29, 158, 117, 0.40)",
  blacksea:      "rgba(59, 109,  17, 0.40)",
  central:       "rgba(186,117,  23, 0.40)",
  mediterranean: "rgba(216, 90,  48, 0.40)",
  eastern:       "rgba(83,  74, 183, 0.40)",
  southeast:     "rgba(163, 45,  45, 0.40)",
};

// CSS class → REGIONS_DATA id mapping
const CLASS_TO_ID = {
  marmara:       "marmara",
  aegean:        "ege",
  blacksea:      "karadeniz",
  central:       "icanadolu",
  mediterranean: "akdeniz",
  eastern:       "doguanadolu",
  southeast:     "guneydoguanadolu",
};

// ── SVG polygon definitions (from user-provided HTML, viewBox 0 0 1000 500) ─
const POLYGONS = [
  {
    key: "marmara",
    points: "30,60 95,45 140,50 165,70 195,80 230,90 250,100 255,115 240,130 220,145 195,155 175,160 155,165 130,160 110,155 90,150 70,145 50,135 30,120 20,100 20,75",
  },
  {
    key: "aegean",
    points: "30,120 50,135 70,145 90,150 110,155 130,160 155,165 175,160 195,155 220,145 240,130 255,115 260,130 265,155 260,175 255,200 245,225 235,250 220,270 205,285 190,295 175,300 160,295 145,285 130,270 115,255 100,235 85,215 70,195 55,175 40,155",
  },
  {
    key: "blacksea",
    points: "165,70 230,90 290,85 370,72 450,65 530,60 610,65 670,60 720,70 730,85 720,100 680,112 620,110 550,115 490,125 430,130 370,122 310,120 260,130 255,115 250,100 230,90",
  },
  {
    key: "central",
    points: "260,130 310,120 370,122 430,130 490,125 550,115 610,108 628,128 628,150 620,162 595,185 560,198 518,210 478,218 438,220 398,215 358,210 318,215 285,230 262,252 258,205 252,178 248,148 260,130",
  },
  {
    key: "mediterranean-1",
    regionKey: "mediterranean",
    points: "175,300 205,285 235,250 260,175 270,200 290,225 315,250 338,265 340,290 325,325 310,355 320,395 340,420 320,432 280,420 245,395 210,362 188,328 180,312",
  },
  {
    key: "mediterranean-2",
    regionKey: "mediterranean",
    points: "338,265 360,278 395,290 408,312 408,358 390,378 368,362 345,330 338,310 338,280",
  },
  {
    key: "eastern",
    points: "628,62 700,55 775,58 850,68 920,82 960,105 975,135 960,162 918,178 845,185 770,175 700,168 640,158 628,150 628,118 628,62",
  },
  {
    key: "southeast",
    points: "398,215 478,218 558,200 628,150 640,158 700,168 770,175 820,182 815,220 790,252 730,282 660,294 585,285 510,278 435,280 408,292 395,330 395,358 378,375 345,330 340,290 338,265 358,210 398,215",
  },
];

// ── Side info panel shown on hover ────────────────────────────────
const InfoPanel = ({ region }) => {
  if (!region) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-6 gap-2">
        <span className="text-5xl">🗺️</span>
        <p className="text-sm font-medium">Hover over a region<br />to see agricultural data</p>
      </div>
    );
  }

  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-xl font-extrabold text-gray-800">{region.name}</h3>
        <p className="text-xs text-gray-400">Capital: {region.capital}</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${YIELD_STYLE[region.yield_potential]}`}>
          {region.yield_potential} Yield
        </span>
        <span className="text-xs text-gray-500">Score: <strong>{region.yield_score}/10</strong></span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          ["🌡️ Avg Temp",    `${region.avg_temp_c} °C`],
          ["🧪 Soil pH",     region.soil_ph],
          ["🌧️ Rainfall",   `${region.avg_rainfall_mm} mm/yr`],
          ["💧 Humidity",   `${region.avg_humidity_pct}%`],
          ["⚗️ Nitrogen",   `${region.nitrogen} ppm`],
          ["🧬 Phosphorus",  `${region.phosphorus} ppm`],
          ["🪨 Potassium",  `${region.potassium} ppm`],
        ].map(([label, value]) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2 flex flex-col">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-sm font-bold text-gray-700">{value}</span>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">🌾 Best Crops</p>
        <div className="flex flex-wrap gap-1">
          {region.best_crops.map((c) => (
            <span key={c} className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {c}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 italic leading-relaxed border-t border-gray-100 pt-3">
        {region.notes}
      </p>
    </div>
  );
};

// ── Main Map component ────────────────────────────────────────────
const Map = () => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip]       = useState({ x: 0, y: 0, label: "" });
  const navigate = useNavigate();

  const hoveredRegionId = CLASS_TO_ID[hoveredKey] || null;
  const hoveredRegion   = REGIONS_DATA.find((r) => r.id === hoveredRegionId) || null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip((prev) => ({ ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }));
  };

  const REGION_LABELS = {
    marmara:       "Marmara Region",
    aegean:        "Aegean Region",
    blacksea:      "Black Sea Region",
    central:       "Central Anatolia Region",
    mediterranean: "Mediterranean Region",
    eastern:       "Eastern Anatolia Region",
    southeast:     "Southeast Anatolia Region",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">

      {/* ── Map Image + SVG overlay ── */}
      <div
        className="relative rounded-2xl shadow-inner border border-blue-200 overflow-hidden"
        style={{ display: "inline-block", lineHeight: 0 }}
        onMouseMove={handleMouseMove}
      >
        {/* Real Turkey map photo */}
        <img
          src="/Turkey-Province-Map.jpg"
          alt="Turkey Regional Map"
          className="w-full h-auto select-none block"
          draggable={false}
        />

        {/* SVG polygon overlay — all events handled at SVG level to avoid border glitches */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}
          onMouseMove={(e) => {
            const rk = e.target.getAttribute("data-region");
            setHoveredKey(rk || null);
            const rect = e.currentTarget.parentElement.getBoundingClientRect();
            setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => {
            const rk = e.target.getAttribute("data-region");
            if (rk && CLASS_TO_ID[rk]) navigate(`/regions/${CLASS_TO_ID[rk]}`);
          }}
        >
          {POLYGONS.map((poly) => {
            const rk = poly.regionKey || poly.key;
            const isHovered = hoveredKey === rk;
            return (
              <polygon
                key={poly.key}
                data-region={rk}
                points={poly.points}
                fill={isHovered ? REGION_HOVER_FILL[rk] : "transparent"}
                stroke={isHovered ? "rgba(255,255,255,0.7)" : "transparent"}
                strokeWidth={2}
                strokeLinejoin="round"
                style={{ transition: "fill 0.18s", pointerEvents: "all" }}
              />
            );
          })}
        </svg>

        {/* Floating tooltip near cursor */}
        {hoveredKey && (
          <div
            className="pointer-events-none absolute z-20 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
            style={{
              left: tooltip.x,
              top:  tooltip.y,
              transform: "translate(-50%, -140%)",
            }}
          >
            <span className="font-bold">{REGION_LABELS[hoveredKey]}</span>
            {hoveredRegion && (
              <span className="ml-2 opacity-70">— {hoveredRegion.yield_potential} Yield</span>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-xl p-2 text-xs shadow border border-gray-100">
          <p className="font-bold text-gray-600 mb-1">Yield Potential</p>
          {[
            ["Excellent", "#4ade80"],
            ["Good",      "#a3e635"],
            ["Average",   "#facc15"],
            ["Poor",      "#f87171"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 mb-0.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: color }} />
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
          <p className="text-gray-400 mt-1 text-[10px]">Click region to explore</p>
        </div>
      </div>

      {/* ── Side info panel ── */}
      <div className="w-full lg:w-72 xl:w-80 min-h-[320px] bg-white rounded-2xl shadow border border-gray-100">
        <InfoPanel region={hoveredRegion} />
      </div>

    </div>
  );
};

export default Map;