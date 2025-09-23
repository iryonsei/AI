import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  // console.log("messages before send to server:", messages);

  const upstream  = await fetch("https://webapi.yonsei.ac.kr/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer EMPTY", // API Key
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      // model: "deepseek-ai/DeepSeek-V3.1",
      messages,
      temperature: 0,
      max_tokens: 20000,
      stream: true, // 스트리밍 활성화
      // extra_body: {"chat_template_kwargs": {"thinking": true}}
    }),
  });

  const stream = upstream.body;
  if (!stream) {
    return new Response("No stream returned", { status: 502 });
  }
  // console.log("stream:", stream);
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}