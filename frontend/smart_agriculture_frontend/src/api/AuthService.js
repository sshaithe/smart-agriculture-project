import axios from "axios";
import util from "../util/util";

const BASE_URL = util.API_URL;

export const authService = {
 
  register: async (email, password, username = null) => {
    const response = await axios.post(`${BASE_URL}/register`, { email, password, username });
    return response.data;
  },

  
  login: async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChange"));
    }
    return response.data;
  },

  
  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
  },

 
  getProfile: async () => {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: authService.authHeader(),
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axios.put(`${BASE_URL}/profile`, data, {
      headers: authService.authHeader(),
    });
    // Update local storage with new user data
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("authChange"));
    }
    return response.data;
  },

  
  getUserPredictions: async () => {
    const response = await axios.get(`${BASE_URL}/user/predictions`, {
      headers: authService.authHeader(),
    });
    return response.data;
  },

  
  getToken: () => localStorage.getItem("jwt_token"),

  isAuthenticated: () => !!localStorage.getItem("jwt_token"),

  getUser: () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },

  
  authHeader: () => {
    const token = localStorage.getItem("jwt_token");
    return (token && token !== "undefined" && token !== "null") ? { Authorization: `Bearer ${token}` } : {};
  },
};
