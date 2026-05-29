import axios from "axios";

export const api = axios.create({
  baseURL: "https://bridgecn-api.onrender.com/api",
});
