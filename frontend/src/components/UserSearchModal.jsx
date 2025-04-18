"use client"

import { useState } from "react"
import { FaTimes, FaSearch, FaUser } from "react-icons/fa"
import { searchUsers } from "../services/userService"

const UserSearchModal = ({ onClose, onSelectUser }) => {
  const [username, setUsername] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!username.trim()) return

    setSearching(true)
    setError("")

    try {
      const response = await searchUsers(username)
      if (response.success) {
        setSearchResults(response.data)
        if (response.data.length === 0) {
          setError("No users found with that username")
        }
      } else {
        setError(response.message || "Error searching for users")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("An error occurred while searching")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Find User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search by username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={searching || !username.trim()}
              className={`px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none ${
                searching || !username.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {searching ? "..." : <FaSearch />}
            </button>
          </form>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          {searchResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Results:</h4>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                {searchResults.map((user) => (
                  <li key={user._id}>
                    <button
                      onClick={() => onSelectUser(user)}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSearchModal
