'use client';

import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function Reasoning({ reasoning }: { reasoning: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-2 text-[12px] text-gray-500">
      <button
        className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold ">Thinking</span>
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>

      {isOpen && (
        <div className="w-fit mt-1 mb-3 px-2 py-1 italic bg-sky-100 rounded-[5px]">
          {reasoning}
        </div>
      )}
    </div>
  );
}