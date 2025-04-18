"use client"

import { useAuth } from "../context/AuthContext"

const MessageList = ({ messages, loading }) => {
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isSentByMe = message.senderId === user?._id

        return (
          <div key={message._id} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
            <div className={`message-bubble ${isSentByMe ? "message-sent" : "message-received"}`}>
              <p className="text-sm">{message.message}</p>
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
