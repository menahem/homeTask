import { useState } from "react";
import type { KeyPair, Message } from "../types";
import { CryptoUtils } from "../utils/crypto";
import { MessageService } from "../services/message.services";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageList } from "../chat/MessageList";
import { MessageInput } from "../chat/MessageInput";
import { useMessagePolling } from "../hook/useMessagePolling";

interface ChatViewProps {
  username: string;
  token: string;
  keyPair: KeyPair;
  onLogout: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ username, token, keyPair, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");

  const handleNewMessages = (newMessages: Message[]): void => {
    setMessages((prev) => [...prev, ...newMessages]);
  };

  useMessagePolling(token, keyPair, handleNewMessages);

  const handleSendMessage = async (messageText: string): Promise<void> => {
    setError("");
    try {
      const encrypted = CryptoUtils.encryptMessage(messageText, keyPair.publicKey);
      const success = await MessageService.send(token, encrypted);
      
      if (!success) {
        setError("Failed to send message");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <ChatHeader username={username} onLogout={onLogout} />
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          <MessageList messages={messages} currentUser={username} />
        </div>

        <MessageInput onSend={handleSendMessage} error={error} />
      </div>
    </div>
  );
};