"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";

const SUGGESTIONS = [
  "Walk me through pricing a Fed December rate-cut contract on Kalshi.",
  "How do I size a position on a low-liquidity Polymarket market?",
  "Explain favorite-longshot bias and give me an example I can exploit.",
  "Give me a research checklist before buying YES on any contract.",
];

export function ChatClient({
  arenaBrief,
}: {
  arenaBrief: { fetchedAt: string; venues: string[]; points: string[] };
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the PredictionEdge research analyst, powered by NVIDIA NIM and grounded in Prediction Arena methodology. Ask me about any Kalshi or Polymarket contract and I'll walk through the probabilistic reasoning step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(content: string) {
    if (!content.trim() || loading) return;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Chat failed");
      }
      setSource(data.source || null);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <div className="rounded-2xl border border-line bg-bg-card flex flex-col h-[70vh] min-h-[520px] overflow-hidden">
        <div
          ref={viewportRef}
          className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4"
        >
          {messages.map((m, i) => (
            <Message key={i} role={m.role as "user" | "assistant"} content={m.content} />
          ))}
          {loading ? (
            <Message role="assistant" content="Thinking…" muted />
          ) : null}
          {error ? (
            <div className="rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
              {error}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className="border-t border-line p-3 flex items-end gap-2 bg-bg-soft/60"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the analyst… (Shift+Enter for newline)"
            rows={2}
            className="flex-1 resize-none rounded-lg border border-line bg-bg-card px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-10 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent to-[#6a4bff] px-4 text-sm font-medium text-white shadow-glow hover:brightness-110 disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-line bg-bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-accent-cyan" /> Model status
          </div>
          <div className="mt-2 text-xs text-ink-soft">
            Source: <span className="text-ink">{source || "nvidia-nim (ready)"}</span>
          </div>
          <div className="text-xs text-ink-soft">
            Grounded with Prediction Arena context ({new Date(arenaBrief.fetchedAt).toLocaleTimeString()}).
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-bg-card p-4">
          <div className="text-sm font-medium">Try asking</div>
          <div className="mt-2 flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-left text-xs rounded-lg border border-line px-3 py-2 hover:border-accent/40 hover:bg-bg-elev transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-bg-card p-4">
          <div className="text-sm font-medium">Context in play</div>
          <ul className="mt-2 text-xs text-ink-soft list-disc pl-4 space-y-1">
            <li>Venues: {arenaBrief.venues.join(", ")}</li>
            {arenaBrief.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Message({
  role,
  content,
  muted,
}: {
  role: "user" | "assistant";
  content: string;
  muted?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-accent/15 text-accent flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed prose-chat ${
          isUser
            ? "bg-accent text-white"
            : muted
              ? "bg-bg-elev text-ink-soft italic"
              : "bg-bg-elev text-ink"
        }`}
      >
        <MessageBody content={content} />
      </div>
      {isUser ? (
        <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-bg-elev text-ink flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}

function MessageBody({ content }: { content: string }) {
  // Extremely small markdown-ish renderer: keeps bullets, bold, line breaks.
  const lines = content.split(/\n/);
  return (
    <div>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        if (/^[-*]\s+/.test(trimmed)) {
          return (
            <div key={i} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-accent-cyan">
              {renderInline(trimmed.replace(/^[-*]\s+/, ""))}
            </div>
          );
        }
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <strong key={i}>{p.replace(/\*\*/g, "")}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
