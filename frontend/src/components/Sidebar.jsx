"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaUsers, FaPlus, FaUser, FaCog, FaSearch } from "react-icons/fa"
import { searchUsers } from "../services/userService"

const Sidebar = ({ user, contacts, groups, activeChat, setActiveChat, onCreateGroup }) => {
  const [activeTab, setActiveTab] = useState("chats")
  const [username, setUsername] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [showSearch, setShowSearch] = useState(false) // Add this state to control search visibility

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!username.trim()) return

    setSearching(true)
    setSearchError("")

    try {
      const response = await searchUsers(username)
      if (response.success) {
        setSearchResults(response.data)
        if (response.data.length === 0) {
          setSearchError("No users found with that username")
        }
      } else {
        setSearchError(response.message || "Error searching for users")
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("An error occurred while searching")
    } finally {
      setSearching(false)
    }
  }

  const startConversation = (userId, username) => {
    setActiveChat({ type: "private", id: userId, name: username })
    setSearchResults([])
    setUsername("")
    setShowSearch(false) // Hide search after starting conversation
  }

  return (
    <div className="w-80 flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">ChatApp</h1>
        <div className="flex items-center">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-gray-500 hover:text-gray-700 mr-2">
            <FaSearch className="w-5 h-5" />
          </button>
          <Link to="/profile" className="p-2 text-gray-500 hover:text-gray-700">
            <FaCog className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {showSearch && (
        <div className="p-3 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search by username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
            />
            <button
              type="submit"
              disabled={searching || !username.trim()}
              className={`px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none ${
                searching || !username.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {searching ? "..." : <FaSearch />}
            </button>
          </form>

          {searchError && <p className="mt-2 text-xs text-red-500">{searchError}</p>}

          {searchResults.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <li key={result._id}>
                    <button
                      onClick={() => startConversation(result._id, result.username)}
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-50 text-left"
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser className="text-gray-600 text-xs" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">{result.username}</p>
                        <p className="text-xs text-gray-500">{result.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "chats" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "groups" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {activeTab === "chats" && (
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No contacts yet</p>
              <p className="text-xs mt-1">Search for users to start chatting</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <li key={contact._id}>
                  <button
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${activeChat?.type === "private" && activeChat?.id === contact._id ? "bg-gray-100" : ""}`}
                    onClick={() => setActiveChat({ type: "private", id: contact._id, name: contact.username })}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUser className="text-gray-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 text-left">{contact.username}</p>
                      <p className="text-sm text-gray-500 text-left truncate">
                        {contact.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "groups" && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={onCreateGroup}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <FaPlus className="mr-2" />
              Create New Group
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No groups yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {groups.map((group) => (
                <li key={group._id}>
                  <button
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${activeChat?.type === "group" && activeChat?.id === group._id ? "bg-gray-100" : ""}`}
                    onClick={() => setActiveChat({ type: "group", id: group._id, name: group.name })}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUsers className="text-green-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 text-left">{group.name}</p>
                      <p className="text-sm text-gray-500 text-left truncate">
                        {group.description || "No description"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.username || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
