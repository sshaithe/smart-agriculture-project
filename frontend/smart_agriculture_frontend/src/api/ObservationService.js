import axios from "axios";
import util from "../util/util";

const BASE_URL = util.API_URL;

export const observationService = {
  getAllObservations: async () => {
    const response = await axios.get(`${BASE_URL}/observation/all`);
    if (!response) {
      throw new Error("Failed to fetch observations");
    }
    return response.data;
  },

  getObservationById: async (id) => {
    const response = await axios.get(`${BASE_URL}/observation/${id}`);
    if (!response) {
      throw new Error("Failed to fetch observation");
    }
    return response.data;
  },

  getObservationByCityId: async (city_id) => {
    const response = await axios.get(`${BASE_URL}/observation/city/${city_id}`);
    if (!response) {
      throw new Error("Failed to fetch observation");
    }
    return response.data;
  },

  createObservation: async (observationData) => {
    const response = await axios.post(`${BASE_URL}/observation/add`, observationData);
    if (!response) {
      throw new Error("Failed to create observation");
    }
    return response.data;
  },

  updateObservation: async (id, observationData) => {
    const response = await axios.put(`${BASE_URL}/observation/${id}`, observationData);
    if (!response) {
      throw new Error("Failed to update observation");
    }
    return response.data;
  },

  deleteObservation: async (id) => {
    const response = await axios.delete(`${BASE_URL}/observation/${id}`);
    if (!response) {
      throw new Error("Failed to delete observation");
    }
    return response.data;
  },
};