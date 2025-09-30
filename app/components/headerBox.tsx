'use client';

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { ChatContext } from "../chatContext";
import { InitialSystemMessages } from "./systemMessages";

export const HeaderBox = ( 
    {width} : 
    {width: string}
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
    <div className={`
        w-full text-sm font-bold select-none flex justify-between items-center
    `}>
        <div className="w-fit p-3 text-center h-[50px] flex items-center">
            <Link 
                href="/" 
                className="flex items-center" 
                onClick={() => {
                    setMessages(InitialSystemMessages);
                    setInputInitial(true);
                }}>
            <Image
                src="/yonsei.gif"
                alt="Logo"
                width={36}
                height={36}
                className="cursor-pointer"
            />
            </Link>
        </div>
        <div className="w-fit pr-3 text-center h-[50px] flex items-center">
            <Image
                src="/dataportal_mark.gif"
                alt="Logo"
                width={36}
                height={36}
                className=""
            />
        </div>
    </div>
    </>    
    );
};