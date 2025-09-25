import { createContext } from "react";

export type ChatMessage = {
  role: string;
  content: string;
  reasoning?: string;
};

type ChatContextType = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  output: string;
  setOutput: React.Dispatch<React.SetStateAction<string>>;
  reasoning: string;
  setReasoning: React.Dispatch<React.SetStateAction<string>>;
  chatStarted: boolean;
  setChatStarted: React.Dispatch<React.SetStateAction<boolean>>;
  responseDone: boolean;
  setResponseDone: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContext = createContext<ChatContextType>(
  {
    messages: [],
    setMessages: () => {},
    input: "",
    setInput: () => {},
    output: "",
    setOutput: () => {},
    reasoning: "",
    setReasoning: () => {},
    chatStarted: false,
    setChatStarted: () => {},
    responseDone: false,
    setResponseDone: () => {},
  }
);