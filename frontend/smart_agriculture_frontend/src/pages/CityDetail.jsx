import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cityService } from "../api/CityService";
import { observationService } from "../api/ObservationService";

// Map slug IDs from the map component to backend numeric region IDs
const SLUG_TO_REGION_ID = {
  "marmara": 1,
  "ege": 2,
  "akdeniz": 3,
  "karadeniz": 4,
  "icanadolu": 5,
  "doguanadolu": 6,
  "guneydoguanadolu": 7,
  // Also support numeric IDs directly
};

const REGION_NAMES = {
  1: "Marmara",
  2: "Aegean",
  3: "Mediterranean",
  4: "Black Sea",
  5: "Central Anatolia",
  6: "Eastern Anatolia",
  7: "Southeastern Anatolia",
};

const CityDetail = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [cityObservations, setCityObservations] = useState({});
  const [loading, setLoading] = useState(true);

  // Resolve regionId to a numeric ID
  const numericId = SLUG_TO_REGION_ID[regionId] || parseInt(regionId) || null;
  const regionName = REGION_NAMES[numericId] || regionId;

  useEffect(() => {
    const fetchData = async () => {
      if (!numericId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await cityService.getCityByRegionId(numericId);
        const cityList = Array.isArray(data) ? data : [];
        setCities(cityList);

        // Fetch observations for each city
        const obsMap = {};
        for (const city of cityList) {
          try {
            const obsRes = await observationService.getObservationByCityId(city.id);
            const obsList = obsRes.observation || obsRes.observations || obsRes || [];
            obsMap[city.id] = Array.isArray(obsList) ? obsList : [];
          } catch {
            obsMap[city.id] = [];
          }
        }
        setCityObservations(obsMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-blue-600 font-semibold animate-pulse">
        Loading cities...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          Regional Analysis Report
        </h1>
        <p className="text-gray-500 font-medium">
          {regionName} Region — {cities.length} Cities
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cities.map((city, index) => {
          const obs = cityObservations[city.id] || [];
          const latestObs = obs.length > 0 ? obs[obs.length - 1] : null;

          return (
            <div
              key={city.id || index}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 p-1"
            >
              {/* Decorative Top Bar */}
              <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-t-[22px] flex items-end p-4 relative overflow-hidden">
                <span className="text-white/10 text-6xl font-black absolute right-4 top-2 select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-white text-2xl font-bold truncate pr-12 relative z-10">
                  {city.name}
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                    📍 {regionName}
                  </div>
                  <div className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100">
                    ID: {city.id}
                  </div>
                </div>

                {/* Observation Summary */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Agricultural Observation
                  </label>
                  {latestObs ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Temp:</span>{" "}
                          <span className="font-bold text-gray-700">
                            {latestObs.t2m != null ? `${latestObs.t2m}°C` : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Humidity:</span>{" "}
                          <span className="font-bold text-gray-700">
                            {latestObs.rh2m != null ? `${latestObs.rh2m}%` : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rainfall:</span>{" "}
                          <span className="font-bold text-gray-700">
                            {latestObs.prectotcorr != null ? `${latestObs.prectotcorr} mm` : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Year:</span>{" "}
                          <span className="font-bold text-gray-700">{latestObs.year || "—"}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-green-600">
                        {obs.length} observation{obs.length > 1 ? "s" : ""} recorded
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm leading-relaxed italic bg-gray-50 p-4 rounded-xl border-l-4 border-gray-200">
                      No observation recorded yet.{" "}
                      <button
                        onClick={() => navigate("/background")}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Add one →
                      </button>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/background")}
                  className="w-full group-hover:bg-blue-600 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
                >
                  VIEW / ADD DATA
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No cities found for this region.</p>
        </div>
      )}
    </div>
  );
};

export default CityDetail;