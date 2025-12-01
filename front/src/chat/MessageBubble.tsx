import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  currentUser: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isOwn = message.sender === currentUser;
  
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-indigo-600 text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="text-xs opacity-75 mb-1">{message.sender}</div>
        <div>{message.content}</div>
        <div className="text-xs opacity-75 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};