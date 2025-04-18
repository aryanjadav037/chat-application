import { FaUsers, FaUser } from "react-icons/fa"

const ChatHeader = ({ chat }) => {
  return (
    <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
        {chat.type === "group" ? <FaUsers className="text-gray-600" /> : <FaUser className="text-gray-600" />}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{chat.name}</p>
        <p className="text-xs text-gray-500">{chat.type === "group" ? "Group" : "Online"}</p>
      </div>
    </div>
  )
}

export default ChatHeader
