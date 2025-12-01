import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { Lock} from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} currentUser={currentUser} />
      ))}
    </div>
  );
};