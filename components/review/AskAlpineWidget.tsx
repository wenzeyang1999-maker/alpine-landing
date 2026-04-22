"use client";

import { useState } from "react";
import type { DemoApi } from "@/lib/demo-api-factory";

export function AskAlpineWidget({ slug, api }: { slug: string; api: DemoApi }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [streaming, setStreaming] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim() || streaming) return;
    const q = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setStreaming(true);

    try {
      const res = await api.chatStream(slug, q, messages);
      if (!res.ok) throw new Error("Chat error");

      const reader = res.body?.getReader();
      if (!reader) return;

      let assistantMsg = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                assistantMsg += parsed.token;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMsg };
                  return updated;
                });
              }
            } catch {
              assistantMsg += data;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantMsg };
                return updated;
              });
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setStreaming(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-alpine-violet text-white shadow-lg hover:bg-alpine-violet-light transition-colors flex items-center justify-center z-50"
        title="Ask Alpine"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5h14a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V6a1 1 0 011-1z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[480px] bg-br-card border border-br rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-br flex items-center justify-between bg-br-surface">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-alpine-violet flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h8a1 1 0 011 1v4a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-[13px] font-heading font-semibold text-br-text-primary">Ask Alpine</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-br-text-muted hover:text-br-text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[12px] text-br-text-muted">Ask questions about this fund&apos;s ODD review.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] font-body ${
                msg.role === "user"
                  ? "bg-alpine-violet text-white"
                  : "bg-br-surface text-br-text-primary"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex items-center gap-1 text-br-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-br-text-muted animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-br-text-muted animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-br-text-muted animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-br p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask about this review…"
            className="flex-1 bg-br-surface border border-br rounded-lg px-3 py-2 text-[12px] text-br-text-primary placeholder:text-br-text-muted focus:outline-none focus:ring-1 focus:ring-alpine-violet"
            disabled={streaming}
          />
          <button
            onClick={handleSubmit}
            disabled={streaming || !question.trim()}
            className="px-3 py-2 rounded-lg bg-alpine-violet text-white text-[12px] font-medium hover:bg-alpine-violet-light transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
