// Contact form data interface
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// API response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

// Health check response
export interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
  environment: string
}
