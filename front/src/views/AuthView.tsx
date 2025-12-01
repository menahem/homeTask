import { Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { Lock} from "lucide-react";
import { ErrorAlert } from "../components/ui/ErrorAlert";

interface AuthViewProps {
  view: "login" | "register";
  onViewChange: (view: "login" | "register") => void;
  onSubmit: (username: string, password: string) => Promise<void>;
  loading: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ view, onViewChange, onSubmit, loading }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Secure Messaging
            </h1>
          </div>
          <p className="text-gray-600">End-to-end encrypted communication</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => onViewChange("login")}
            variant={view === "login" ? "primary" : "secondary"}
            className="flex-1"
          >
            Login
          </Button>
          <Button
            onClick={() => onViewChange("register")}
            variant={view === "register" ? "primary" : "secondary"}
            className="flex-1"
          >
            Register
          </Button>
        </div>

        <ErrorAlert message={error} />

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          required
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : view === "login" ? "Login" : "Register"}
        </Button>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-600 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          All communications are encrypted using RSA/AES encryption
        </div>
      </div>
    </div>
  );
};