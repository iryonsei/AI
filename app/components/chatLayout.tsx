"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContext } from "../chatContext";
import { MessageItem } from "./messageItem";
import { InputBox } from "./inputBox";
import { HeaderBox } from "./headerBox";
import { InitialSystemMessages } from "./systemMessages";
import { Preahvihear } from "next/font/google";

export default function ChatLayout() {
  const props = useContext(ChatContext);
  const { 
    messages, setMessages, 
    input, setInput, 
    output, setOutput,
    reasoning, setReasoning, 
    chatStarted, setChatStarted,
    responseDone, setResponseDone, 
    inputFocus, setInputFocus
  } = props;

  const totalContainerRef = useRef<HTMLDivElement | null>(null);
  const editableRef = useRef<HTMLDivElement | null>(null);
  const topUserMsgRef = useRef<HTMLDivElement | null>(null);
  const topAssistantMsgRef = useRef<HTMLDivElement | null>(null);
  const messageItemRef = useRef<HTMLDivElement | null>(null);    
  const width = "max-w-[960px] min-w-[300px] w-full sm:w-[620px] md:w-[700px] lg:w-[740px] xl:w-[960px]";

  useEffect(() => {
    setMessages(InitialSystemMessages)
  }, []);

  useEffect(() => {
    if (responseDone) {
      setChatStarted(false);
      setResponseDone(false);
    }
  }, [responseDone]);

  useEffect(() => {
    editableRef.current && editableRef.current.focus();
    setInputFocus(false);
  }, [chatStarted, inputFocus]); 

  const [clientHeight, setClientHeight] = useState(0);
  useEffect(() => {
    setClientHeight(window.innerHeight);
    // console.log("★clientHeight:", window.innerHeight);
  }, []);


  const [containerHeight, setContainerHeight] = useState(0);
  const [lastContainerHeight, setLastContainerHeight] = useState(0);  // const [last2ContainerHeight, setLast2ContainerHeight] = useState(0);
  useEffect(() => {
    if (messageItemRef.current) {
      if (messages[messages.length - 1].role === "user" && chatStarted===false) return;
      const currentHeight = messageItemRef.current.getBoundingClientRect().height;
      const currentTotalHeight = currentHeight + containerHeight;
      setContainerHeight(currentTotalHeight);  // setLast2ContainerHeight(currentHeight + lastContainerHeight);
      setLastContainerHeight(currentHeight);  
      console.log(messages[messages.length - 1].role)
      console.log("마지막메세지높이:", currentHeight);
      console.log("컨테이너높이:", currentTotalHeight);
      if (chatStarted){
        totalContainerRef.current && totalContainerRef.current.scrollTo({
          top: currentTotalHeight,
          behavior: "smooth",
        });
      }
    }
  }, [chatStarted]);  

  useEffect(() => {
    setContainerHeight(0);
    setLastContainerHeight(0);  // setLast2ContainerHeight(0);
  }, [inputFocus]);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <>
    <div 
      className="flex flex-col justify-start items-center h-screen px-2 sm:px-0 custom-scrollbar overflow-hidden"      
    >
      <HeaderBox width={width} />
            
      <div 
        className={`w-full min-w-[300px] h-[calc(100vh-150px)] text-[15px] 
          overflow-x-hidden overflow-y-scroll flex justify-center 
          md:pl-[15px]
        `}
        ref={totalContainerRef}
      >
        <div className={`relative ${width}`}>
          {messages.map((msg, index) => {
            if(msg.role == "system" || msg.role === "developer") return null;
            const isLastMsg = index === messages.length - 1
            return (
              <MessageItem
                key={index}
                msg={msg}
                index={index}
                isLastMsg={isLastMsg}
                topUserMsgRef={topUserMsgRef}
                topAssistantMsgRef={topAssistantMsgRef}
                messageItemRef={messageItemRef}
                chatStarted={chatStarted}
                containerHeight={containerHeight}
                setContainerHeight={setContainerHeight}
                lastContainerHeight={lastContainerHeight}
                setLastContainerHeight={setLastContainerHeight}
              />
            )}
          )}
          <div 
            className={`relative w-full`} 
            style={{ 
              height: 
                chatStarted ? `calc(100vh - 150px - 50px)` :
                (messageItemRef?.current?.getBoundingClientRect().height ?? 0) >= clientHeight ? `0px` : 
                `calc(100vh - 150px - ${lastContainerHeight}px - 50px)` 
            }}
          /> 
        </div>
      </div>
      <div className={`relative w-full h-[100px]`} />
      {/* <div className={`relative ${width} ${lastContainerHeight > clientHeight && "min-h-[150px]"}`} /> */}

      <InputBox 
        width={width}
        editableRef={editableRef}
        totalContainerRef={totalContainerRef}
      />
    </div>
    </>    
  );
}