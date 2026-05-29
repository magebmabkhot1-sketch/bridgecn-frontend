import apiClient from '../config/axios'

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  university: string
  studentType: 'chinese' | 'international'
  yearOfStudy: string
  interests?: string[]
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  message: string
  token: string
  user: any
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data)
  return response.data
}

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile')
  return response.data
}
