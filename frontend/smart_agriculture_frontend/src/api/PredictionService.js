import axios from "axios";
import util from "../util/util";
import { authService } from "./AuthService";

const BASE_URL = util.API_URL;

const authAxios = () =>
  axios.create({ headers: authService.authHeader() });

export const predictionService = {
 
  predictCrop: async (data) => {
    const res = await authAxios().post(`${BASE_URL}/prediction/crop`, data);
    return res.data;
  },

 

  predictYield: async (data) => {
    const res = await authAxios().post(`${BASE_URL}/prediction/yield`, data);
    return res.data;
  },

 
  predictDisease: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await authAxios().post(`${BASE_URL}/prediction/disease`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

 
  assessRisk: async (data) => {
    const res = await authAxios().post(`${BASE_URL}/prediction/risk`, data);
    return res.data;
  },
};
