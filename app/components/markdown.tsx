'use client'

import { ReactNode, use, useEffect, useRef, useState, JSX } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownComponents {
  [key: string]: ({ node, ...props }: { node?: React.ReactNode; [key: string]: any }) => JSX.Element | null;
}

export const myMarkdown = (markDownProps: any): MarkdownComponents => {
  return {
        h1: ({node, ...props}) => (
          <h1 
            className="text-xl font-bold mt-5"
            {...props} 
          />
        ),
        h2: ({node, ...props}) => (
          <h2 
            className="text-lg font-bold mt-5"
            {...props} 
          />
        ),
        h3: ({node, ...props}) => (
          <h3 
            className="text-lg font-bold mt-5"
            {...props} 
          />
        ),
        h4: ({node, ...props}) => (
          <h4 
            className="font-bold mt-10"
            {...props} 
          />
        ),
        h5: ({node, ...props}) => (
          <h5 
            className="font-bold mb-1"
            {...props} 
          />
        ),
        h6: ({node, ...props}) => (
          <h6 
            className="font-bold mb-1"
            {...props} 
          />
        ),
        table: ({node, ...props}) => (
          <div className="overflow-x-auto w-full mt-2 mb-5">
            <table 
              className="w-full"
              {...props} 
            />
          </div>
        ),
        th: ({node, ...props}) => (
          <th 
            className="px-2 py-1 uppercase tracking-wider border-y border-gray-500"
            {...props} 
          />
        ),
        td: ({node, ...props}) => (
          <td 
            className="px-2 py-1 border-y border-dotted border-gray-300"
            {...props} 
          />
        ),
        button: ({ node, ...props }) => (
          <div className="overflow-x-hidden w-full">
          <button
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...props}
          />
          </div>
        ),
        notice: ({ node, ...props }) => (
          <span 
            className="text-xs leading-[36px] text-gray-500"
            {...props}
          />
        ),
        blue: ({ node, ...props }) => (
          <span 
            className="text-xs text-white font-bold bg-[#205edc] px-1 py-[1px] rounded-sm leading-[20px]"
            {...props}
          />
        ),
        gray: ({ node, ...props }) => (
          <>
          <span 
            className="text-gray-500 underline mb-[15px]"
            {...props}
          ></span><br/>
          </>
        ),
        note: ({ node, ...props }) => (
          <span 
            className="block bg-gray-400 text-gray-100 p-1 rounded-b-sm mt-[20px]"
            {...props}
          ></span>
        ),
        strong: ({node, children}: any) => (
          <span className='font-semibold'>
            {children}
          </span>
        ),
        // 숫자 리스트 <ol> list-decimal 사용 안함
        ol: ({node, children}: any) => (
          <ol className="ml-4 mt-1 list-disc">  
            {children}
          </ol>
        ),
        // 하위 리스트 <ul>
        ul: ({node, children}: any) => (
          <ul className="ml-4 mt-1 list-disc">
            {children}
          </ul>
        ),
        // 리스트 항목 <li>
        li: ({node, children}: any) => (
          <li className='my-1'>{children}</li>
        ),
        hr: ({node, ...props}: any) => (
          <hr className="my-5 border-gray-300" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          const content = String(children || '').trim();
          
          if (!content) return null; // 빈 문자열이거나 inline code면 인라인으로만 처리

          const match = /language-(\w+)/.exec(className || '');
          const lang = match ? match[1] : null;

          if (inline) { // inline code
            return <code className="rounded px-1 bg-stone-100 text-sm">{children}</code>;
          }
          
          if (!lang) { // 일반 텍스트 블록 (fenced code가 아닌 경우)도 출력
            return <span className="my-2 whitespace-pre-wrap">{content}</span>;
          }

          const [copied, setCopied] = useState(false);

          async function onCopy() {
            try {
              await navigator.clipboard.writeText(content);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {}
          }

          return (
            <>
              <div className="my-2 overflow-hidden bg-stone-100 rounded-sm overflow-x-auto">
                <div className="flex items-center justify-between p-1 text-[12px]">
                  <span className='ml-1'>{lang}</span>
                  <button
                    onClick={onCopy}
                    className="text-sm px-2 py-0.5 bg-white rounded text-[12px] cursor-pointer"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                {/* <pre className="overflow-x-auto p-4 text-[13px]">
                  <code className={className}>{content}</code>
                </pre> */}
                <div className='bg-black'>
                  <SyntaxHighlighter
                    language={lang}
                    style={oneDark} // VS Code 느낌
                    customStyle={{ padding: '16px', fontSize: '13px', margin: 0 }}
                  >
                    {content}
                  </SyntaxHighlighter>
                </div>
              </div>
            </>
          );
        }
      }
  }
