import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('medlist_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('medlist_token')
      localStorage.removeItem('medlist_user')
    }
    return Promise.reject(err)
  }
)

export default api

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login:       (data: any) => api.post('/auth/login', data),

  // ✅ OTP flow (replace register)
  sendOtp:     (data: any) => api.post('/auth/send-otp', data),
  verifyOtp:   (data: any) => api.post('/auth/verify-otp', data),
  resendOtp:   (data: any) => api.post('/auth/resend-otp', data),

  me:          ()          => api.get('/auth/me'),
  update:      (data: any) => api.put('/auth/me', data),
  saveDoctor:  (id: string) => api.post(`/auth/save-doctor/${id}`),
}

// ─── Doctors ─────────────────────────────────────────────────────────────────
export const doctorsApi = {
  list:      (params?: any) => api.get('/doctors', { params }),
  featured:  ()             => api.get('/doctors/featured'),
  topRated:  (city?: string)=> api.get('/doctors/top-rated', { params: { city } }),
  getBySlug: (slug: string) => api.get(`/doctors/${slug}`),
  create:    (data: any)    => api.post('/doctors', data),
  update:    (id: string, data: any) => api.put(`/doctors/${id}`, data),
  delete:    (id: string)   => api.delete(`/doctors/${id}`),
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewsApi = {
  list:    (doctorId: string, params?: any) => api.get(`/doctors/${doctorId}/reviews`, { params }),
  create:  (doctorId: string, data: any)    => api.post(`/doctors/${doctorId}/reviews`, data),
  helpful: (doctorId: string, id: string)   => api.put(`/doctors/${doctorId}/reviews/${id}/helpful`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: any)     => api.post('/bookings', data),
  my:     ()              => api.get('/bookings/my'),
  cancel: (id: string, reason?: string) => api.put(`/bookings/${id}/cancel`, { reason }),
}

// ─── Categories & Locations ───────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get('/categories'),
}
export const locationsApi = {
  list: () => api.get('/locations'),
}
export const statsApi = {
  get: () => api.get('/stats'),
}
