import axios from "axios"

const API_URL = "http://localhost:5005/api/group"

export const getGroups = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Get groups error:", error)
    return { success: false, data: [] }
  }
}

export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Create group error:", error)
    throw error
  }
}

export const getGroupMessages = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Get group messages error:", error)
    throw error
  }
}

export const sendGroupMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/msg`, messageData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Send group message error:", error)
    throw error
  }
}
