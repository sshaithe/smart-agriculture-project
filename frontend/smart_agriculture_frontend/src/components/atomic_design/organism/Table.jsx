import React from 'react';

const Table = ({ data, renderActions }) => {
  const headers = [
    "Location & Crop",
    "Temperature (T2M)",
    "Humidity & Rainfall",
    "Wind & Solar",
    "Soil Analysis (0-7cm)",
    "Soil Analysis (7-28cm)"
  ];

  return (
    <div className="relative overflow-x-auto shadow-2xl sm:rounded-3xl border border-gray-100">
      <table className="w-full text-sm text-left text-gray-500 bg-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 font-black tracking-wider">{h}</th>
            ))}
            {renderActions && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors group">

                {/* Location & Crop */}
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 text-base">
                    ID: {row.city_id}
                  </div>
                  <div className="text-xs text-blue-500 font-medium uppercase">
                    Crop ID: {row.crop_id} — {row.year}
                  </div>
                </td>

                {/* Temperature (T2M) */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-orange-600 font-extrabold text-lg">
                      {row.t2m}°C
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Min: {row.t2m_min}° / Max: {row.t2m_max}°
                    </span>
                  </div>
                </td>

                {/* Humidity & Rainfall */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span className="font-medium text-gray-700">{row.rh2m}% Humidity</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>🌧️ {row.prectotcorr} mm</span>
                    </div>
                  </div>
                </td>

                {/* Wind & Solar */}
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1 text-gray-600 font-medium">
                    <div>💨 Wind: {row.ws2m} m/s</div>
                    <div>☀️ Radiation: {row.allsky_sfc_sw_dwn}</div>
                  </div>
                </td>

                {/* Soil Top Layer (0-7) */}
                <td className="px-6 py-4 bg-green-50/20">
                  <div className="text-xs font-bold text-green-700">
                    Moisture: {row.soil_moisture_0_7}%
                  </div>
                  <div className="text-[10px] text-green-600/70">
                    Temp: {row.soil_temp_0_7}°C
                  </div>
                </td>

                {/* Soil Deep Layer (7-28) */}
                <td className="px-6 py-4 bg-orange-50/20">
                  <div className="text-xs font-bold text-orange-700">
                    Moisture: {row.soil_moisture_7_28}%
                  </div>
                  <div className="text-[10px] text-orange-600/70">
                    Temp: {row.soil_temp_7_28}°C
                  </div>
                </td>

                {/* Actions Column */}
                {renderActions && (
                  <td className="px-6 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={renderActions ? 7 : 6} className="px-6 py-10 text-center text-gray-400 italic">
                No data to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;