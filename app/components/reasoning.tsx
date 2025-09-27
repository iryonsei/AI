'use client';

import { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function Reasoning({ 
  reasoning, 
  isLastMsg,
  chatStarted,
  containerHeight,
  setContainerHeight,
  lastContainerHeight,
  setLastContainerHeight
}: { 
  reasoning: string, 
  isLastMsg: boolean,
  chatStarted: boolean,
  containerHeight: number,
  setContainerHeight: React.Dispatch<React.SetStateAction<number>>,
  lastContainerHeight: number,
  setLastContainerHeight: React.Dispatch<React.SetStateAction<number>>
}) {

  const reasoningRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [reasoningHeight, setReasoningHeight] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
          setReasoningHeight(reasoningRef?.current?.getBoundingClientRect().height ?? 0);
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!chatStarted && isOpen) {      
      const reasoningHeightCalc = reasoningRef?.current?.getBoundingClientRect().height ?? 0;
      setContainerHeight(prev => prev + reasoningHeightCalc);
      isLastMsg && setLastContainerHeight(prv => prv + reasoningHeightCalc);
    }
    if (!chatStarted && !isOpen) {
      setContainerHeight(prev => prev - reasoningHeight);
      isLastMsg && setLastContainerHeight(prv => prv - reasoningHeight);
    }
    if (chatStarted && isOpen) {
      const reasoningHeightCalc = reasoningRef?.current?.getBoundingClientRect().height ?? 0;
      !isLastMsg && setContainerHeight(prev => prev + reasoningHeightCalc);
    }
    if (chatStarted && !isOpen) {
      !isLastMsg && setContainerHeight(prev => prev - reasoningHeight);
      !isLastMsg && setLastContainerHeight(prv => prv - reasoningHeight);
    }
    // console.log("isOpen:", isOpen);
    // console.log("chatStarted:", chatStarted);
    // console.log(!chatStarted && isOpen)
  }, [isOpen]);

  // useEffect(() => {
  //   console.log("reasoning높이:", reasoningHeight);
  //   console.log("!마지막메세지높이:", lastContainerHeight);
  //   console.log("!전체높이:", containerHeight);
  // }, [containerHeight, lastContainerHeight]);

  return (
    <div 
      className="pt-[20px] pb-[10px] text-[12px] text-gray-500"
    >
      <button
        className="flex items-center mb-1 justify-between px-2 py-1 bg-gray-100 rounded-[5px] hover:bg-gray-200 cursor-pointer select-none"
        onClick={() => {
          setIsOpen(!isOpen);          
        }}
      >
        <span className="font-semibold">Thinking</span>
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>

      {isOpen && (
        <div 
          className="w-fit px-2 py-1 italic bg-sky-100 rounded-[5px] leading-[22px]"          
          ref={reasoningRef}
        >
          {reasoning}
        </div>
      )}
    </div>
  );
}