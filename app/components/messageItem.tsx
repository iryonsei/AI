import React from "react";
import Reasoning from "./reasoning";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc'
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw'
import { myMarkdown } from "./markdown";
import { normalizeMarkdown } from "./functions";


export const MessageItem = React.memo(({ 
    msg, 
    index, 
    isLastMsg, 
    topUserMsgRef,
    topAssistantMsgRef,
    messageItemRef,
    chatStarted,
    containerHeight,
    setContainerHeight,
    lastContainerHeight,
    setLastContainerHeight
 }: { 
    msg: any, 
    index: number, 
    isLastMsg: boolean, 
    topUserMsgRef: React.RefObject<HTMLDivElement | null>,
    topAssistantMsgRef: React.RefObject<HTMLDivElement | null>,
    messageItemRef: React.RefObject<HTMLDivElement | null>,
    chatStarted: boolean,
    containerHeight: number,
    setContainerHeight: React.Dispatch<React.SetStateAction<number>>,
    lastContainerHeight: number,
    setLastContainerHeight: React.Dispatch<React.SetStateAction<number>>
  }) => {

  return (
    <div  
        key={index} 
        ref={messageItemRef}
        className="pb-2"
    >
        <div 
            ref={isLastMsg && msg.role === "user" ? topUserMsgRef : isLastMsg && msg.role === "assistant" ? topAssistantMsgRef : null}
            className={`${msg.role === "user" ? "text-right" : "text-left"}`}
        >
        {msg.role === "assistant" && msg?.reasoning && (
            <Reasoning 
                reasoning={msg.reasoning} 
                isLastMsg={isLastMsg} 
                chatStarted={chatStarted}
                containerHeight={containerHeight}
                setContainerHeight={setContainerHeight}
                lastContainerHeight={lastContainerHeight}
                setLastContainerHeight={setLastContainerHeight}
            />
        )}
        <div
            className={` 
                ${msg.role === "user" ? "inline-block bg-slate-200 rounded-[10px] p-2 px-4" : "pb-[40px]"}
            `}
        >
            <ReactMarkdown
                remarkPlugins={[remarkBreaks, remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={myMarkdown()}
                >
                {normalizeMarkdown(msg.content)} 
            </ReactMarkdown>
        </div>
        </div>
    </div>
  );
}); 