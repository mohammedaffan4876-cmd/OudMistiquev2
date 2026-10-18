import axios from 'axios'

/*
 * Vite injects environment variables prefixed with VITE_. In development we
 * fall back to the local API; in Render the production variable will be set
 * in the Render dashboard.
 */
const API_BASE = import.meta.env.VITE_API_BASE ??
  'http://localhost:8000/api' // dev fallback

const api = axios.create({
  baseURL: API_BASE,
})

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-perfume.jpg'
  
  const backendBase = API_BASE.replace(/\/api$/, '')

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const url = new URL(imagePath)
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (!isLocal && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
        return `${backendBase}${url.pathname}`
      }
      return imagePath
    } catch (e) {
      return imagePath
    }
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${backendBase}${cleanPath}`
}

// Keep the JWT interceptor – unchanged logic
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken })
          localStorage.setItem('access_token', response.data.access)
          return api(error.config)
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api