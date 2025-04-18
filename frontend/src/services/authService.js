import axios from "axios"

const API_URL = "http://localhost:5005/api/auth"

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

export const validateToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/validate`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Token validation error:", error)
    return { isValid: false }
  }
}
