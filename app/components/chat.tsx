"use client";

import { useEffect, useRef, useState } from "react";
import sendMessage from "./sendMessage";
import { BsSoundwave } from "react-icons/bs";
import Reasoning from "./reasoning";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw'
import { myMarkdown } from "./markdown";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string, reasoning?: string }[]>([
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
  ]);
  const [input, setInput] = useState("");    
  const [output, setOutput] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [responseDone, setResponseDone] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const topUserMsgRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const props = 
    { messages, setMessages, 
      input, setInput, 
      output, setOutput, 
      reasoning, setReasoning, 
      chatStarted, setChatStarted,
      responseDone, setResponseDone,
    };
    
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

  const [containerHeight, setContainerHeight] = useState(20);
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.getBoundingClientRect().height + containerHeight;      
      setContainerHeight(height);
      // console.log("chatStarted:", chatStarted);
      // console.log("responseDone:", responseDone);
      // console.log("메시지 컨테이너 높이:", containerRef.current.getBoundingClientRect().height );
      // console.log("메시지 컨테이너 총높이:", height);
    }
  }, [chatStarted]);
  
  useEffect(() => {
    console.log(messages);
  }, [messages]);


  const width = "max-w-[1024px] min-w-[300px] w-full sm:w-[620px] md:w-[700px] lg:w-[800px] xl:w-[1024px]";

  return (
    <>
    <div className="flex flex-col justify-start items-center min-h-screen px-2 sm:px-0">
      <div className={`flex-1 overflow-auto ${width} text-[15px]`}>
        <div className={`w-full pt-[20px]`} 
          style={{
            minHeight: messages.length > 2 ? `calc(${containerHeight}px + 100dvh - 125px )` : `calc(${containerHeight}px)`
          }}
        >
          {messages.map((msg, index) => {
            if(msg.role == "system" || msg.role === "developer") return null;
            const isLastUser = index === messages.length - 1 && msg.role === "user";
            return (
              <div  
                key={index} 
                ref={containerRef}
                className="pb-2"
              >
                <div 
                  ref={isLastUser ? topUserMsgRef : null}
                  className={`${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  {msg.role === "assistant" && msg?.reasoning && (
                    <Reasoning reasoning={msg.reasoning} />
                  )}
                  <div
                    className={`${msg.role === "user" ? "inline-block bg-slate-200 rounded-[20px] p-2 px-4 mt-[20px]" : ""}`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks, remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={myMarkdown({ markDownProps: {} })}
                    >
                      {
                        msg.content
                            .replace(/[\u2010-\u2015\u2212\uFE63\uFF0D]/g, "-")
                            .replace(/[\u00A0\u202F]/g, " ")
                            .replace(/(\d)\s+%/g, "$1%")
                            .replace(/\|\|/g, "|---|")
                            .replace(/\*\*(.*?)\*\*/g, (_m, inner) => `<strong>${inner}</strong>`)
                      } 
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          )}
        </div>
      </div>
      <div className={`relative ${width} ${messages.length < 3 ? "":"min-h-[150px]"}`} />

      {/* input area */}
      <div className={`fixed bottom-0 ${width} h-[25px] bg-white`} />
      <div className={`fixed bottom-3 ${width} px-2 sm:px-0`}>
        <div className={`
            flex flex-col w-full border border-slate-500 rounded-[15px] ${chatStarted ? "bg-slate-300" : "bg-white"}
          `}>
          <div
            className={`
              rounded-[15px] mt-3 p-3 resize-none overflow-y-auto max-h-[30.5rem] min-h-[1.5rem] break-words whitespace-pre-wrap focus:outline-none              
              custom-scrollbar
              `}           
            contentEditable={!chatStarted}
            suppressContentEditableWarning={true}
            ref={editableRef}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              setInput(target.innerText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                input !== "" && sendMessage(props);
                (editableRef.current as HTMLDivElement).innerText = '';
                setInput('');
              }
            }}
          ></div>
          <button
            className="absolute bottom-2 right-4 md:right-2 border p-2 bg-slate-500 text-white self-end rounded-[10px] font-bold cursor-pointer"
            onClick={() => {
                input !== "" && sendMessage(props);
                (editableRef.current as HTMLDivElement).innerText = '';
                setInput('');
            }}
          >
            <BsSoundwave />
          </button>
          <div className="text-[10px] text-slate-500 italic mt-2 pl-3">
            Press Enter to send message, Shift + Enter for new line.
          </div>
        </div>
      </div>
    </div>
    </>    
  );
}