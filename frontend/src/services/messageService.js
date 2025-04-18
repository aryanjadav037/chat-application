import axios from "axios"

const API_URL = "http://localhost:5005/api/message"

export const getMessages = async (senderId, receiverId) => {
  try {
    const response = await axios.get(`${API_URL}/${senderId}/${receiverId}`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Get messages error:", error)
    throw error
  }
}

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(API_URL, messageData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Send message error:", error)
    throw error
  }
}

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.put(`${API_URL}/${messageId}/read`, null, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.error("Mark message as read error:", error)
    throw error
  }
}
