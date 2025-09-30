'use client';

import { useEffect, useRef, useState } from "react";
import { ChatContext, ChatMessage } from "./chatContext";
import ChatLayout from "./components/chatLayout";
import { useMediaQuery } from "react-responsive";

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");    
  const [output, setOutput] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [responseDone, setResponseDone] = useState(false);
  const [inputInitial, setInputInitial] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewPoint, setViewPoint] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const updateVP = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setViewPoint(vh);
      const kbHeight = window.innerHeight - vh - (window.visualViewport?.offsetTop ?? 0);
      setKeyboardHeight(kbHeight > 0 ? kbHeight : 0);
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };
    updateVP();
    window.addEventListener("resize", updateVP);
    window.addEventListener("scroll", updateVP);
    window.addEventListener("orientationchange", updateVP);
    // iOS용 포커스 트릭
    inputRef.current?.addEventListener('focus', () => {
      setTimeout(updateVP, 300); // 0.3초 뒤 다시 계산
    });
    inputRef.current?.addEventListener('blur', () => setKeyboardHeight(0));
    return () => {
      window.removeEventListener("resize", updateVP);
      window.removeEventListener("scroll", updateVP);
      window.removeEventListener("orientationchange", updateVP);
    };
  }, []);
    
  // useEffect(() => {
  //   const preventScroll = (e: TouchEvent) => e.preventDefault();
  //   if (keyboardHeight > 0) {
  //     document.body.style.overflow = 'hidden';
  //     document.addEventListener('touchmove', preventScroll, { passive: false });
  //   } else {
  //     document.body.style.overflow = '';
  //     document.removeEventListener('touchmove', preventScroll);
  //   }
  //   return () => {
  //     document.body.style.overflow = '';
  //     document.removeEventListener('touchmove', preventScroll);
  //   }
  // }, [keyboardHeight]);

  return (
    <ChatContext.Provider
      value={{
        messages, setMessages,
        input, setInput,
        output, setOutput,
        reasoning, setReasoning,
        chatStarted, setChatStarted,
        responseDone, setResponseDone,
        inputInitial, setInputInitial,
        keyboardHeight, setKeyboardHeight,
        viewPoint, setViewPoint,
        isMobile
      }}
    >
      {/* 화면 전체 wrapper */}
      <div
        className="absolute inset-0 w-full flex flex-col overflow-hidden"
        style={{ height: viewPoint }}
      >
        <ChatLayout />
      </div>
    </ChatContext.Provider>
    
  );
}

