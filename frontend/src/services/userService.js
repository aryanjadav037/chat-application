import axios from "axios"

const API_URL = "http://localhost:5005/api/user"

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Get profile error:", error)
    throw error
  }
}

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/me`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Update profile error:", error)
    throw error
  }
}

export const deleteAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/me`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Delete account error:", error)
    throw error
  }
}

export const searchUsers = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { username },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Search users error:", error)
    throw error
  }
}
