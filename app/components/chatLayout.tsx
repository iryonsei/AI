"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContext } from "../chatContext";
import { MessageItem } from "./messageItem";
import { InputBox } from "./inputBox";

export default function ChatLayout() {
  const props = useContext(ChatContext);
  const { 
    messages, setMessages, 
    input, setInput, 
    output, setOutput,
    reasoning, setReasoning, 
    chatStarted, setChatStarted,
    responseDone, setResponseDone, 
  } = props;
  const editableRef = useRef<HTMLDivElement | null>(null);
  const topUserMsgRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);    
  const width = "max-w-[1024px] min-w-[300px] w-full sm:w-[620px] md:w-[700px] lg:w-[800px] xl:w-[1024px]";

  useEffect(() => {
    setMessages([
      { 
        role: "system", 
        content: 
          `You are a helpful AI assistant. 
            You are locally installed in Yonsei university's AI Center to help internal uesrs.
            When responding in tables, use correct Markdown syntax so that the tables do not break.` 
      },
      { 
        role: "developer", 
        content: 
          `Try to answer correctly and if you don't know, say "I don't know" or "I'm not sure" instead of making up an answer.` 
      },
    ])
  }, []);

  useEffect(() => {
    if (responseDone) {
      setChatStarted(false);
      setResponseDone(false);
    }
  }, [responseDone]);

  useEffect(() => {
    editableRef.current && editableRef.current.focus();
  }, [chatStarted]); 

  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "user" && topUserMsgRef.current) {
      topUserMsgRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  const [containerHeight, setContainerHeight] = useState(0);
  const [lastContainerHeight, setLastContainerHeight] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.getBoundingClientRect().height + containerHeight;      
      setContainerHeight(height);
      setLastContainerHeight(containerRef.current.getBoundingClientRect().height);
      // console.log("chatStarted:", chatStarted);
      // console.log("responseDone:", responseDone);
      console.log("lastContainerHeight:", containerRef.current.getBoundingClientRect().height );
      console.log("containerHeight:", height);
    }
  }, [chatStarted]);
  
  const [clientHeight, setClientHeight] = useState(0);
  useEffect(() => {
    setClientHeight(window.innerHeight);
    console.log("clientHeight:", window.innerHeight);
  }, []);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <>
    <div className="flex flex-col justify-start items-center min-h-screen px-2 sm:px-0">
      <div className={`flex-1 overflow-auto ${width} text-[15px]`}>
        <div className={`w-full`} 
          style={{
            minHeight: 
              messages.length > 2 && chatStarted ? `${containerHeight + clientHeight}px`: 
              (containerRef?.current?.getBoundingClientRect().height ?? 0) < clientHeight ? `${containerHeight + clientHeight - lastContainerHeight}px`: 
              `${containerHeight}px`
          }}
        >
          {messages.map((msg, index) => {
            if(msg.role == "system" || msg.role === "developer") return null;
            const isLastUser = index === messages.length - 1 && msg.role === "user";
            return (
              <MessageItem
                key={index}
                msg={msg}
                index={index}
                isLastUser={isLastUser}
                topUserMsgRef={topUserMsgRef}
                containerRef={containerRef}
              />
            )}
          )}
        </div>
      </div>
      <div className={`relative ${width} ${lastContainerHeight > clientHeight && "min-h-[150px]"}`} />

      <InputBox 
        width={width}
        editableRef={editableRef}
      />
    </div>
    </>    
  );
}