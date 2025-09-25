'use client';

import { useState } from "react";
import { ChatContext, ChatMessage } from "./chatContext";
import ChatLayout from "./components/chatLayout";

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");    
  const [output, setOutput] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [responseDone, setResponseDone] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        messages, setMessages,
        input, setInput,
        output, setOutput,
        reasoning, setReasoning,
        chatStarted, setChatStarted,
        responseDone, setResponseDone,
      }}
    >
      <ChatLayout />
    </ChatContext.Provider>
    
  );
}

