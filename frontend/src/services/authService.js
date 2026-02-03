import axios from "axios";

// Match backend PORT
const API = "http://localhost:5080/api/auth";

export const login = (data) =>
  axios.post(`${API}/login`, data);

export const register = (data) =>
  axios.post(`${API}/register`, data);
