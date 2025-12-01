import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Lock,Send } from 'lucide-react';
import { ErrorAlert } from "../components/ui/ErrorAlert";

interface MessageInputProps {
  onSend: (message: string) => void;
  error: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, error }) => {
  const [message, setMessage] = useState<string>("");

  const handleSend = (): void => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <ErrorAlert message={error} />
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your encrypted message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button onClick={handleSend} className="px-6" icon={Send}>
          Send
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Messages are encrypted end-to-end
      </div>
    </div>
  );
};