import { API_URL } from "../config/constants";
import type { MessagePollResponse } from "../types";

export const MessageService = {
  poll: async (
    token: string,
    lastMessageId: number
  ): Promise<MessagePollResponse> => {
    const response = await fetch(
      `${API_URL}/api/messages/poll?since=${lastMessageId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to poll messages");
  },

  send: async (token: string, encryptedContent: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/api/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: encryptedContent }),
    });
    return response.ok;
  },
};
