export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
}

export interface MessagePollResponse {
  messages: Message[];
}

export interface User {
  username: string;
  token: string;
}
