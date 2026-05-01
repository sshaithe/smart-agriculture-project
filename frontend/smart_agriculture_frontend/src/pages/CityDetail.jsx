import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { cityService } from "../api/CityService";

const CityDetail = () => {
  const { regionId } = useParams();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const data = await cityService.getCityByRegionId(regionId);
        setCities(data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (regionId) fetchCities();
  }, [regionId]);

  if (loading) return (
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
        <p className="text-gray-500 font-medium">Region ID: {regionId} — System Records</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cities.map((city, index) => (
          <div
            key={city.id || index}
            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 p-1"
          >
            {/* Decorative Top Bar */}
            <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-t-[22px] flex items-end p-4">
              <span className="text-white/20 text-6xl font-black absolute right-4 top-2 select-none">
                0{index + 1}
              </span>
              <h3 className="text-white text-2xl font-bold truncate pr-12">
                {city.name}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-3">
                {/* Dynamic Region Name */}
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                  📍 {city.region || "Not specified"}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100">
                  ID: {city.id}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Agricultural Observation Note
                </label>
                <p className="text-gray-600 text-sm leading-relaxed italic bg-gray-50 p-4 rounded-xl border-l-4 border-blue-200">
                  "{city.observation || "No field observation has been recorded for this location yet."}"
                </p>
              </div>

              <button className="w-full group-hover:bg-blue-600 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200">
                ANALYZE DATA
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No data records found for this region.</p>
        </div>
      )}
    </div>
  );
};

export default CityDetail;