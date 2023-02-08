import { API_URL } from "@/constants";

const { default: axios } = require("axios");

export const httpClent = (token) => {
  if (token) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });    
  }

  return axios.create({
    baseURL: API_URL
  });
}