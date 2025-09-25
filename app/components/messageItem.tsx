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
    isLastUser, 
    topUserMsgRef,
    containerRef }: { 
    msg: any, 
    index: number, 
    isLastUser: boolean, 
    topUserMsgRef: React.RefObject<HTMLDivElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>, }) => {

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
        <div  // index 0 => system, index 1 => developer, index 2 => first user message
            className={` 
                ${index == 2 ? "mt-[60px]" : ""}  
                ${msg.role === "user" ? "inline-block bg-slate-200 rounded-[20px] p-2 px-4 mt-[20px]" : ""}
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