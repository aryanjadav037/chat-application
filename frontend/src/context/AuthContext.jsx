"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"
import { login, logout, validateToken } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await validateToken()
        if (response.isValid) {
          const userProfile = await axios.get("http://localhost:5005/api/user/me", {
            withCredentials: true,
          })

          if (userProfile.data.success) {
            setUser(userProfile.data.data)
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials)
      if (response.success) {
        const userProfile = await axios.get("http://localhost:5005/api/user/me", {
          withCredentials: true,
        })

        if (userProfile.data.success) {
          setUser(userProfile.data.data)
          return { success: true }
        }
        return { success: false, message: "Failed to get user profile" }
      }
      return { success: false, message: response.message || "Login failed" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Login failed" }
    }
  }

  const logoutUser = async () => {
    try {
      await logout()
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false, message: error.message || "Logout failed" }
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login: loginUser,
    logout: logoutUser,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
