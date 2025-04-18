"use client"

import { useState } from "react"
import { FaPaperPlane } from "react-icons/fa"

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  )
}

export default ChatInput
