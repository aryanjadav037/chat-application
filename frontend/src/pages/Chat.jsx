"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import { getMessages, sendMessage } from "../services/messageService"
import { getGroups, createGroup, getGroupMessages, sendGroupMessage } from "../services/groupService"
import Sidebar from "../components/Sidebar"
import ChatHeader from "../components/ChatHeader"
import MessageList from "../components/MessageList"
import ChatInput from "../components/ChatInput"
import CreateGroupModal from "../components/CreateGroupModal"

const Chat = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch groups and contacts on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch groups
        const groupsResponse = await getGroups()
        if (groupsResponse.success) {
          setGroups(groupsResponse.data)
        }

        // You might want to fetch contacts here as well
        // const contactsResponse = await getContacts()
        // if (contactsResponse.success) {
        //   setContacts(contactsResponse.data)
        // }
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }

    if (user) {
      fetchInitialData()
    }
  }, [user])

  // Handle socket events
  useEffect(() => {
    if (!socket || !user) return

    // Listen for private messages
    socket.on("receive-message", (data) => {
      if (activeChat && activeChat.type === "private" && activeChat.id === data.senderId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: Date.now().toString(),
            senderId: data.senderId,
            receiverId: user._id,
            message: data.message,
            createdAt: new Date().toISOString(),
            read: false,
          },
        ])
      }
    })

    // Listen for group messages
    socket.on("receive-group-message", (data) => {
      if (activeChat && activeChat.type === "group" && activeChat.id === data.groupId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: Date.now().toString(),
            senderId: data.senderId,
            groupId: data.groupId,
            message: data.message,
            createdAt: new Date().toISOString(),
          },
        ])
      }
    })

    return () => {
      socket.off("receive-message")
      socket.off("receive-group-message")
    }
  }, [socket, user, activeChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat || !user) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        if (activeChat.type === "private") {
          // Check if this is a new contact we need to add
          const contactExists = contacts.some((contact) => contact._id === activeChat.id)

          if (!contactExists) {
            // Add this user to contacts
            setContacts((prevContacts) => [...prevContacts, { _id: activeChat.id, username: activeChat.name }])
          }

          const response = await getMessages(user._id, activeChat.id)
          if (response.success) {
            setMessages(response.data)
          }
        } else if (activeChat.type === "group") {
          const response = await getGroupMessages(activeChat.id)
          if (response.success) {
            setMessages(response.data)
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [activeChat, user, contacts])

  const handleSendMessage = async (message) => {
    if (!message.trim() || !activeChat || !user) return

    try {
      const newMessage = {
        message,
        createdAt: new Date().toISOString(),
      }

      if (activeChat.type === "private") {
        newMessage.senderId = user._id
        newMessage.receiverId = activeChat.id

        // Add message to UI immediately (optimistic update)
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, _id: Date.now().toString() }])

        // Send via API
        await sendMessage(newMessage)

        // Emit socket event
        if (socket) {
          socket.emit("send-message", newMessage)
        }
      } else if (activeChat.type === "group") {
        newMessage.senderId = user._id
        newMessage.groupId = activeChat.id

        // Add message to UI immediately
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, _id: Date.now().toString() }])

        // Send via API
        await sendGroupMessage(newMessage)

        // Emit socket event
        if (socket) {
          socket.emit("group-message", newMessage)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await createGroup({
        ...groupData,
        admin: user._id,
      })

      if (response.success) {
        setGroups((prevGroups) => [...prevGroups, response.data])
        setShowCreateGroup(false)

        // Join the group via socket
        if (socket) {
          socket.emit("create-group", {
            groupId: response.data._id,
            userId: user._id,
            name: response.data.name,
            description: response.data.description,
          })
        }
      }
    } catch (error) {
      console.error("Error creating group:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        contacts={contacts}
        groups={groups}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {activeChat ? (
          <>
            <ChatHeader chat={activeChat} />

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <MessageList messages={messages} currentUser={user} loading={loading} />
              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700">Welcome to ChatApp</h3>
              <p className="mt-2 text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={handleCreateGroup} />}
    </div>
  )
}

export default Chat
