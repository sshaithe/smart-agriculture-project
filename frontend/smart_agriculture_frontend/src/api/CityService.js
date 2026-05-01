import axios from "axios";
import util from "../util/util";

const BASE_URL = util.API_URL;

export const cityService = {
  getAllCities: async () => {
    const response = await axios.get(`${BASE_URL}/city/all`);
    if (!response) {
      throw new Error("Failed to fetch cities");
    }
    return response.data;
  },

  getCityById: async (id) => {
    const response = await axios.get(`${BASE_URL}/city/${id}`);
    if (!response) {
      throw new Error("Failed to fetch city");
    }
    return response.data;
  },

  getCityByRegionId: async (region_id) => {
    try {
      const response = await axios.get(`${BASE_URL}/city/region/${region_id}`);

      
      if (response.data && response.data.city) {
        return response.data.city;
      }

      
      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("API Hatası:", error);
      return [];
    }
  },
};
