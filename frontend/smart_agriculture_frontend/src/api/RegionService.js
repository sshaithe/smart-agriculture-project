import axios from "axios";
import util from "../util/util";

const BASE_URL = util.API_URL;


export const regionService = {
    
    getAllRegions: async () => {
        const response = await axios.get(`${BASE_URL}/region/all`);
        if(!response) {
            throw new Error('Failed to fetch regions')
        }
        return response.data;
    },

    getRegionById: async (id) => {
        const response = await axios.get(`${BASE_URL}/region/${id}`);
        if(!response) {
            throw new Error('Failed to fetch region')
        }
        return response.data;
    }
}

