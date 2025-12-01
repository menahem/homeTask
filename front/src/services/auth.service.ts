import { API_URL } from "../config/constants";
import type { AuthResponse } from "../types";

export const AuthService = {
  register: async (
    username: string,
    password: string,
    publicKey: string
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, publicKey }),
    });
    return response.json();
  },

  login: async (
    username: string,
    password: string,
    publicKey: string
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, publicKey }),
    });
    return response.json();
  },
};
