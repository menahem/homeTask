import { useEffect, useRef } from "react";
import type { KeyPair, Message } from "../types";
import { MessageService } from "../services/message.services";
import { CryptoUtils } from "../utils/crypto";
import { POLLING_INTERVAL } from "../config/constants";

export const useMessagePolling = (
  token: string | null,
  keyPair: KeyPair | null,
  onNewMessages: (messages: Message[]) => void
): void => {
  const pollingRef = useRef<number | null>(null);
  const lastMessageId = useRef<number>(0);

  useEffect(() => {
    if (!token || !keyPair) return;

    const poll = async (): Promise<void> => {
      try {
        const data = await MessageService.poll(token, lastMessageId.current);

        if (data.messages && data.messages.length > 0) {
          const decryptedMessages = data.messages.map((msg) => ({
            ...msg,
            content: CryptoUtils.decryptMessage(
              msg.content,
              keyPair.privateKey
            ),
          }));
          onNewMessages(decryptedMessages);
          lastMessageId.current = data.messages[data.messages.length - 1].id;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }

      pollingRef.current = window.setTimeout(poll, POLLING_INTERVAL);
    };

    poll();

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, [token, keyPair, onNewMessages]);
};
