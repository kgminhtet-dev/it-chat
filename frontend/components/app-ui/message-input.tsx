"use client";

import { Input } from "@/components/ui/input";
import { IAccount } from "@/lib/types/IAccount";
import { useState } from "react";
import useAppStore from "../hooks/use-app-store";

export default function MessageInput() {
  const chat = useAppStore((state) => state.currentChat);
  const account = useAppStore((state) => state.account) as IAccount;
  const [message, setMessage] = useState("");

  return (
    <div className="bg-muted p-1 flex items-center gap-2 rounded-md bg-gray-300">
      <Input
        id="message"
        name={"message"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && message) {
            setMessage("");
          }
        }}
        placeholder="Type your message..."
        className="flex-1 border-blue-500 rounded-2xl px-4 py-2 bg-white"
        autoFocus
      />
    </div>
  );
}
