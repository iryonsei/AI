'use client';

import sendMessage from "./sendMessage";
import { useContext } from "react";
import { ChatContext } from "../chatContext";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";

export const InputBox = ( 
    {width, editableRef, totalContainerRef}: 
    {width: string, editableRef: React.RefObject<HTMLDivElement | null>, totalContainerRef: React.RefObject<HTMLDivElement | null>}
) => {

  const props = useContext(ChatContext);
  const { 
    messages, setMessages, 
    input, setInput, 
    output, setOutput,
    reasoning, setReasoning, 
    chatStarted, setChatStarted,
    responseDone, setResponseDone, 
    inputInitial, setInputInitial
  } = props;
  
  return (
    <>
    {/* input area */}
    {/* <div className={`fixed bottom-0 ${width} h-[25px] bg-white`} /> */}
    {/* <div className={`fixed bottom-3 ${width} px-2 sm:px-0`} */}
    <div className={`absolute bottom-3 ${width} px-2 sm:px-0 `}>
        <div className={`
            flex flex-col w-full border rounded-[10px] focus-within:border-blue-500
            ${chatStarted ? "animate-pulse bg-gradient-to-r from-blue-200 via-green-200/70 to-sky-300 border-blue-500" : "bg-white border-slate-500"}
            `}>
            <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-blue-700 italic select-none animate-pulse
                ${ chatStarted ? "block" : "hidden"}
                `}>
                Responding...
            </div>
            <div
                className={`
                    rounded-[10px] mt-3 px-3 resize-none overflow-y-auto max-h-[30.5rem] min-h-[3.0rem] break-words whitespace-pre-wrap focus:outline-none              
                    custom-scrollbar
                    `}           
                contentEditable={!chatStarted}
                suppressContentEditableWarning={true}
                ref={editableRef}
                onInput={(e) => setInput((e.target as HTMLDivElement).innerText)}
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
                className={`
                    absolute bottom-2 right-4 md:right-2 border p-2 text-white self-end rounded-[10px] font-bold cursor-pointer select-none
                    active:scale-70 transition
                    ${ input.replace(/\n/g, "").trim()!=="" || chatStarted  ? "bg-blue-700" : "bg-slate-500" }
                    `}
                onClick={() => {
                    input !== "" && sendMessage(props);
                    (editableRef.current as HTMLDivElement).innerText = '';
                    setInput('');
                }}
            >
                <HiOutlineChatBubbleLeftEllipsis />
            </button>
            <div className="text-[10px] text-slate-500 italic mt-2 pl-3 select-none">
                Press Enter to send message, Shift + Enter for new line.
            </div>
        </div>
    </div>
    </>    
    );
};