
import mermaid from "mermaid";
import React, { useEffect, useRef } from "react";

export function safeMarkdown(str: string) {
  let patched = str;

  // 닫히지 않은 ** 처리
  const boldCount = (patched.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) patched += '**';

  // 닫히지 않은 코드블록 처리
  const codeBlockCount = (patched.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) patched += '\n```';

  return patched;
}


export const MermaidChart = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<div class="mermaid">${chart}</div>`;
      mermaid.init(undefined, ref.current.querySelectorAll(".mermaid"));
    }
  }, [chart]);

  return <div ref={ref} />;
};


export const normalizeMarkdown = (raw: string): string => {
  return raw
    .replace(/[\u2010-\u2015\u2212\uFE63\uFF0D]/g, "-")
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/(\d)\s+%/g, "$1%")
    .replace(/\|\|/g, "|---|")
    .replace(/\*\*(.*?)\*\*/g, (_, inner) => `<strong>${inner}</strong>`);
};