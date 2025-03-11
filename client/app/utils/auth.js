import API from "./api"

export const login = async (credentials) => {
  try {
    const response = await API.post("/api/auth/login", credentials)
    return response.data
  } catch (error) {
    throw error.response?.data || "Login failed"
  }
}

export const logout = async () => {
  try {
    const response = await API.post("/api/auth/logout")
    return response.data
  } catch (error) {
    throw error.response?.data || "Logout failed"
  }
}

export const signup = async (userData) => {
  try {
    const response = await API.post("/api/auth/signup", userData)
    return response.data
  } catch (error) {
    throw error.response?.data || "Signup failed"
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/api/auth/reset-password-request", { email })
    return response.data
  } catch (error) {
    throw error.response?.data || "Reset password request failed"
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.put("/api/auth/reset-password", { token, newPassword })
    return response.data
  } catch (error) {
    throw error.response?.data || "Password reset failed"
  }
}

export const verifyEmail = async (token) => {
  try {
    const response = await API.get(`/api/auth/verify-email?token=${token}`)
    return response.data
  } catch (error) {
    throw error.response?.data || "Email verification failed"
  }
}