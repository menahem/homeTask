import { useState } from "react";
import { CryptoUtils } from "./utils/crypto";
import type { KeyPair } from "./types";
import { AuthService } from "./services/auth.service";
import { ChatView } from "./views/ChatView";
import { AuthView } from "./views/AuthView";

const SecureMessagingApp: React.FC = () => {
  const [view, setView] = useState<"login" | "register" | "chat">("login");
  const [username, setUsername] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAuth = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const keys = CryptoUtils.generateKeyPair();
      const authMethod = view === "login" ? AuthService.login : AuthService.register;
      const data = await authMethod(username, password, keys.publicKey);

      if (data.token) {
        setKeyPair(keys);
        setToken(data.token);
        setUsername(username);
        setView("chat");
      } else {
        throw new Error(data.error || "Authentication failed");
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Network error. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    setToken(null);
    setKeyPair(null);
    setUsername("");
    setView("login");
  };

  if (view === "chat" && token && keyPair) {
    return (
      <ChatView
        username={username}
        token={token}
        keyPair={keyPair}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AuthView
      view={view as "login" | "register"}
      onViewChange={(newView) => setView(newView)}
      onSubmit={handleAuth}
      loading={loading}
    />
  );
};

export default SecureMessagingApp;