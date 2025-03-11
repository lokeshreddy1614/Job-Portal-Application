import axios from "axios"

export const API_URL = process.env.NODE_ENV === "production" ? "https://job-portal-application-dkui.onrender.com" : "http://localhost:5000"

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export default API