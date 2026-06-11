import axios from "axios";
import util from "../util/util";
import { authService } from "./AuthService";

const BASE_URL = util.API_URL;

const authAxios = () =>
  axios.create({ headers: authService.authHeader() });

export const weatherService = {

  /**
   * Fetch weather by GPS coordinates from the browser Geolocation API.
   * Returns fields ready to auto-fill CropTab, YieldTab, and RiskTab forms.
   */
  getByCoords: async (lat, lon) => {
    const res = await authAxios().get(`${BASE_URL}/weather/by-coords`, {
      params: { lat, lon },
    });
    return res.data;
  },

  /**
   * Fetch weather for a specific Turkish city name.
   * Used in YieldTab when the user selects a city from the dropdown.
   */
  getByCity: async (city) => {
    const res = await authAxios().get(`${BASE_URL}/weather/by-city`, {
      params: { city },
    });
    return res.data;
  },

  /**
   * Ask the browser for GPS position, then fetch weather.
   * Returns a Promise that resolves to the weather data object.
   * Rejects with an error message string if location is denied.
   */
  getFromBrowserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Your browser does not support Geolocation.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await weatherService.getByCoords(
              pos.coords.latitude,
              pos.coords.longitude
            );
            if (data.error) reject(data.error);
            else resolve(data);
          } catch (e) {
            reject(e.response?.data?.error || e.message);
          }
        },
        (err) => {
          const msgs = {
            1: "Location access denied. Please allow location permission.",
            2: "Location unavailable. Please select your city manually.",
            3: "Location request timed out. Please try again.",
          };
          reject(msgs[err.code] || "Could not get your location.");
        },
        { timeout: 10000, maximumAge: 300000 } // cache for 5 min
      );
    });
  },
};
