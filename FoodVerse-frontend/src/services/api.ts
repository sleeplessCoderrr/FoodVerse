import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:7000/api/v1", // Updated to match backend API structure
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodverse-auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('foodverse-auth-token')
      localStorage.removeItem('foodverse-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
