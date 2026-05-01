import axios from "axios";
import util from "../util/util";

const BASE_URL = util.API_URL;

export const cropService = {
  getAllCrops: async () => {
    const response = await axios.get(`${BASE_URL}/crop/all`);
    if (!response) {
      throw new Error("Failed to fetch crops");
    }
    return response.data;
  },

  getCropById: async (id) => {
    const response = await axios.get(`${BASE_URL}/crop/${id}`);
    if (!response) {
      throw new Error("Failed to fetch crop");
    }
    return response.data;
  },
};
