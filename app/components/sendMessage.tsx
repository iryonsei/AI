import { useEffect } from "react";

export default async function sendMessage(
    { 
        messages, setMessages, 
        input, setInput, 
        output, setOutput, 
        reasoning, setReasoning, 
        chatStarted, setChatStarted,
        responseDone, setResponseDone,
    } : { 
        messages: { role: string; reasoning?: string, content: string }[]; 
        setMessages: React.Dispatch<React.SetStateAction<{ role: string; reasoning?: string, content: string; }[]>>;         
        input: string; setInput: React.Dispatch<React.SetStateAction<string>>; 
        output: string; setOutput: React.Dispatch<React.SetStateAction<string>>; 
        reasoning: string; setReasoning: React.Dispatch<React.SetStateAction<string>>; 
        chatStarted: boolean; setChatStarted: React.Dispatch<React.SetStateAction<boolean>>;
        responseDone: boolean; setResponseDone: React.Dispatch<React.SetStateAction<boolean>>;
    }
) {

    setOutput("");
    setReasoning("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]); 
    setChatStarted(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          // 기존 messages에서 reasoning 제거
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: "user", content: input },
        ],
      }),
    });

    if (!res.body) {
        console.error("No response body");
        return null };  // res.body는 ReadaSbleStream<Uint8Array> 타입 → 서버에서 오는 데이터를 조금씩 받아올 수 있음.
    const reader = res.body.getReader();  // ReadableStream에서 reader를 꺼냄. 이 reader는 스트림을 한 번에 다 읽는 게 아니라, 조각(chunk) 단위로 읽기를 가능하게 해줌.
    const decoder = new TextDecoder("utf-8"); // 서버에서 오는 chunk는 바이너리(바이트 배열) 형태라 바로 문자열로 못 씀. TextDecoder("utf-8")을 써서 Uint8Array → 문자열 변환기로 준비.

    let buffer = ""; // 누적 버퍼
    let isDone = false;

    try {
      while (!isDone) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("✅ Stream finished (done=true)");
            setResponseDone(true);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 마지막 라인은 불완전할 수 있으므로 buffer 에 남김

          
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const data = line.replace(/^data: /, "").trim();
            console.log("📩 raw line:", data);
            
            if (!data) continue;

            if (data === "[DONE]") {
              console.log("🛑 Received [DONE]");
              setResponseDone(true);
              isDone = true;
              break;
            }

            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta;
              if (!delta) continue;

              // if (delta.content) setOutput(prev => prev + delta.content);
              // if (delta.reasoning_content) setReasoning(prev => prev + delta.reasoning_content);
              setMessages(prev => {
                const last = prev[prev.length - 1];
                let newMessage;
                if (delta.content || delta.reasoning_content) {
                  if (!last || last.role === "user") {
                    newMessage = {
                      role: "assistant",
                      content: delta.content || "",
                      reasoning: delta.reasoning_content || ""
                    };
                    return [...prev, newMessage];
                  } else {
                    newMessage = {
                      ...last,
                      content: (last.content || "") + (delta.content || ""),
                      reasoning: (last.reasoning || "") + (delta.reasoning_content || "")
                    };
                    const updated = [...prev];
                    updated[updated.length - 1] = newMessage;
                    return updated;
                  }
                }
                return prev;
              });
            } catch (err) {
              console.warn("⚠️ JSON parse error, skipping:", err);
            }
          }
          if (isDone) {
            setResponseDone(true);
            break; 
          }
        }
    } catch (err) {
      console.error("❌ Stream error:", err);
    } finally {
      setInput("");
    }
  };
