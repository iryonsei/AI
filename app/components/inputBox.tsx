'use client';

import { IoEnter } from "react-icons/io5";
import sendMessage from "./sendMessage";
import { useContext } from "react";
import { ChatContext } from "../chatContext";

export const InputBox = ( 
    {width,editableRef} : 
    {width: string,editableRef: React.RefObject<HTMLDivElement | null>}
) => {

  const props = useContext(ChatContext);
  const { 
    messages, setMessages, 
    input, setInput, 
    output, setOutput,
    reasoning, setReasoning, 
    chatStarted, setChatStarted,
    responseDone, setResponseDone, 
  } = props;

  
  return (
    <>
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
        <IoEnter />
        </button>
        <div className="text-[10px] text-slate-500 italic mt-2 pl-3">
        Press Enter to send message, Shift + Enter for new line.
        </div>
    </div>
    </div>
    </>    
    );
};