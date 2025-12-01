import { Shield, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";

interface ChatHeaderProps {
  username: string;
  onLogout: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ username, onLogout }) => (
  <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Shield className="w-6 h-6" />
      <h1 className="text-xl font-bold">Secure Messaging</h1>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm">👤 {username}</span>
      <Button variant="danger" onClick={onLogout} className="px-3 py-1" icon={LogOut}>
        Logout
      </Button>
    </div>
  </div>
);