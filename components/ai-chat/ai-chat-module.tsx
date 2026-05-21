"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Copy,
  Trash2,
  Plus,
  MessageCircle,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}


/* ─── Typing indicator ─── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "oklch(0.62 0.13 155 / 0.15)",
          border: "1px solid oklch(0.62 0.13 155 / 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Sparkles size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "10px 14px",
          borderRadius: 16,
          borderTopLeftRadius: 4,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
          border: "1px solid var(--islametra-line)",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--islametra-fg-dim)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Message bubble ─── */
function MessageBubble({
  message,
  onCopy,
  isLight,
}: {
  message: Message;
  onCopy: (text: string) => void;
  isLight: boolean;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        gap: 10,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "oklch(0.62 0.13 155 / 0.15)",
            border: "1px solid oklch(0.62 0.13 155 / 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          <Sparkles size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
        </div>
      )}
      <div className="group" style={{ maxWidth: "80%" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            fontSize: 14,
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            ...(isUser
              ? {
                  background:
                    "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                  color: "#08110b",
                  borderTopRightRadius: 4,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px -4px oklch(0.62 0.13 155 / 0.4)",
                }
              : {
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                  border: "1px solid var(--islametra-line)",
                  color: "var(--islametra-fg-soft)",
                  borderTopLeftRadius: 4,
                }),
          }}
        >
          {message.content}
        </div>
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={() => onCopy(message.content)}
            aria-label="Salin pesan"
            style={{
              padding: "3px 6px",
              borderRadius: 6,
              border: "none",
              background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)",
              color: "var(--islametra-fg-dim)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Copy size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sidebar inner content (shared between desktop + mobile) ─── */
function SidebarContent({
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  onClose,
  mobile,
  isLight,
}: {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onClose?: () => void;
  mobile?: boolean;
  isLight: boolean;
}) {
  const { lang } = useLang();
  const ta = translations[lang].aiChat;
  return (
    <>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 16px 14px",
          borderBottom: "1px solid var(--islametra-line)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={13} style={{ color: "oklch(0.72 0.12 155)", opacity: 0.8 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'Geist', sans-serif",
              color: "var(--islametra-fg-soft)",
              letterSpacing: "-0.015em",
              lineHeight: 1,
            }}
          >
            AI Chat
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {mobile && onClose && (
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "1px solid var(--islametra-line)",
                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                color: "var(--islametra-fg-dim)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              aria-label={ta.closeSidebar}
            >
              <X size={13} />
            </button>
          )}
          <button
            onClick={onNewSession}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid oklch(0.62 0.13 155 / 0.30)",
              background:
                "linear-gradient(145deg, oklch(0.65 0.13 155) 0%, oklch(0.48 0.12 155) 100%)",
              color: "#051a0e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 12px -4px oklch(0.62 0.13 155 / 0.55)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 16px -4px oklch(0.62 0.13 155 / 0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 12px -4px oklch(0.62 0.13 155 / 0.55)";
            }}
            aria-label={ta.newChat}
            title={ta.newChat}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Sessions label */}
      {sessions.length > 0 && (
        <div style={{ padding: "14px 16px 6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: 9,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--islametra-fg-dim)",
              fontWeight: 500,
            }}
          >
            {ta.history}
          </span>
          <button
            onClick={onClearAll}
            style={{
              fontSize: 10,
              fontFamily: "'Geist', sans-serif",
              color: "var(--islametra-fg-dim)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 5,
              opacity: 0.7,
            }}
            title={ta.clearAllTitle}
          >
            {ta.clearAll}
          </button>
        </div>
      )}

      {/* Sessions list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px" }}>
        {sessions.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 16px",
              gap: 8,
            }}
          >
            <MessageCircle
              size={20}
              style={{ color: "var(--islametra-fg-dim)", opacity: 0.5 }}
            />
            <p
              style={{
                fontSize: 11.5,
                color: "var(--islametra-fg-dim)",
                textAlign: "center",
                lineHeight: 1.6,
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {ta.emptyHint}
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = currentSessionId === session.id;
            return (
              <div
                key={session.id}
                className="group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 11px",
                  borderRadius: 10,
                  cursor: "pointer",
                  marginBottom: 2,
                  transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
                  background: isActive
                    ? isLight ? "rgba(0,0,0,0.06)" : "linear-gradient(135deg, oklch(0.62 0.13 155 / 0.14) 0%, oklch(0.62 0.13 155 / 0.06) 100%)"
                    : "transparent",
                  border: isActive
                    ? isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid oklch(0.62 0.13 155 / 0.22)"
                    : "1px solid transparent",
                  boxShadow: isActive && !isLight ? "0 1px 8px -2px oklch(0.62 0.13 155 / 0.12)" : "none",
                }}
                onClick={() => onSelectSession(session.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <MessageCircle
                  size={13}
                  style={{
                    color: isActive ? "oklch(0.82 0.12 155)" : "var(--islametra-fg-dim)",
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
                <span
                  style={{
                    fontSize: 12.5,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: isActive ? "var(--islametra-fg)" : "var(--islametra-fg-mute)",
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {session.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  aria-label="Hapus sesi"
                  className="opacity-0 group-hover:opacity-100"
                  style={{
                    padding: "2px 4px",
                    borderRadius: 5,
                    border: "none",
                    background: "none",
                    color: "var(--islametra-fg-dim)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer disclaimer */}
      <div
        style={{
          padding: "12px 14px 16px",
          borderTop: "1px solid var(--islametra-line)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 12px",
            borderRadius: 10,
            background: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.02)",
            border: "1px solid var(--islametra-line)",
          }}
        >
          <AlertTriangle
            size={10}
            style={{ color: "var(--islametra-fg-dim)", flexShrink: 0, opacity: 0.7 }}
          />
          <span
            style={{
              fontSize: 10.5,
              color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist', sans-serif",
              lineHeight: 1.4,
              opacity: 0.8,
            }}
          >
            {ta.disclaimer}
          </span>
        </div>
      </div>
    </>
  );
}

/* ─── Main export ─── */
export function AiChatModule() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const ta = translations[lang].aiChat;
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Load sessions: from DB if signed in, else from localStorage
  useEffect(() => {
    if (!authLoaded) return;

    if (isSignedIn) {
      fetch("/api/chat-sessions")
        .then((r) => r.json())
        .then((data: { sessions: { id: string; title: string | null; createdAt: string; updatedAt: string; messages: { id: string; role: string; content: string; createdAt: string }[] }[] }) => {
          const loaded: ChatSession[] = (data.sessions ?? []).map((s) => ({
            id: s.id,
            title: s.title ?? ta.newSession,
            createdAt: new Date(s.createdAt),
            messages: s.messages.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: new Date(m.createdAt),
            })),
          }));
          if (loaded.length > 0) {
            setSessions(loaded);
            setCurrentSessionId(loaded[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setMounted(true));
    } else {
      try {
        const saved = localStorage.getItem("islametra-chat-sessions");
        if (saved) {
          const parsed = JSON.parse(saved);
          const loadedSessions: ChatSession[] = parsed.map((s: ChatSession & { createdAt: string; messages: (Message & { timestamp: string })[] }) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            messages: s.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
          }));
          if (loadedSessions.length > 0) {
            setSessions(loadedSessions);
            setCurrentSessionId(loadedSessions[0].id);
          }
        }
      } catch { /* ignore */ }
      setMounted(true);
    }
  }, [isSignedIn, authLoaded, ta.newSession]);

  // Persist to localStorage for guests
  useEffect(() => {
    if (mounted && !isSignedIn) {
      localStorage.setItem("islametra-chat-sessions", JSON.stringify(sessions));
    }
  }, [sessions, mounted, isSignedIn]);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const createNewSession = useCallback(async () => {
    if (isSignedIn) {
      try {
        const res = await fetch("/api/chat-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: ta.newSession }),
        });
        const data = await res.json() as { session: { id: string; title: string | null; createdAt: string } };
        const newSession: ChatSession = {
          id: data.session.id,
          title: data.session.title ?? ta.newSession,
          messages: [],
          createdAt: new Date(data.session.createdAt),
        };
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMobileSidebarOpen(false);
        return newSession.id;
      } catch { /* fallback to local */ }
    }
    const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newSession: ChatSession = { id, title: ta.newSession, messages: [], createdAt: new Date() };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(id);
    setMobileSidebarOpen(false);
    return id;
  }, [ta, isSignedIn]);

  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, [currentSessionId, createNewSession]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createNewSession();
    }

    const isFirstMessage = (sessions.find((s) => s.id === sessionId)?.messages.length ?? 0) === 0;
    const newTitle = isFirstMessage ? text.slice(0, 40) + (text.length > 40 ? "..." : "") : undefined;

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            title: newTitle ?? s.title,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );
    setInput("");
    setIsLoading(true);

    // Update session title in DB on first message
    if (isSignedIn && sessionId && newTitle) {
      fetch(`/api/chat-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      }).catch(() => {});
    }

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text }],
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      const aiMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-ai`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, aiMessage] } : s
        )
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              aiContent += delta;
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === sessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === aiMessage.id ? { ...m, content: aiContent } : m
                        ),
                      }
                    : s
                )
              );
            } catch {
              /* skip malformed chunks */
            }
          }
        }
      }

      // Save both messages to DB after stream completes
      if (isSignedIn && sessionId && aiContent) {
        fetch(`/api/chat-sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: text },
              { role: "assistant", content: aiContent },
            ],
          }),
        }).catch(() => {});
      }
    } catch {
      toast.error(ta.toastError);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: s.messages.filter((m) => m.role !== "assistant" || m.content),
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(ta.toastCopied);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
    if (isSignedIn) {
      fetch(`/api/chat-sessions/${id}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const handleClearAll = () => {
    if (isSignedIn) {
      sessions.forEach((s) => {
        fetch(`/api/chat-sessions/${s.id}`, { method: "DELETE" }).catch(() => {});
      });
    } else {
      localStorage.removeItem("islametra-chat-sessions");
    }
    setSessions([]);
    setCurrentSessionId(null);
  };

  return (
    <>
      {/* ── Mobile sidebar backdrop ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              backgroundColor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar — slide-in overlay ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 264,
              height: "100vh",
              zIndex: 52,
              display: "flex",
              flexDirection: "column",
              backgroundColor: isLight ? "rgba(250,249,246,0.97)" : "rgba(8, 10, 9, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRight: "1px solid var(--islametra-line-strong)",
            }}
          >
            <SidebarContent
              sessions={sessions}
              currentSessionId={currentSessionId}
              onNewSession={createNewSession}
              onSelectSession={(id) => {
                setCurrentSessionId(id);
                setMobileSidebarOpen(false);
              }}
              onDeleteSession={handleDeleteSession}
              onClearAll={handleClearAll}
              onClose={() => setMobileSidebarOpen(false)}
              mobile
              isLight={isLight}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Root flex container: sidebar + chat, fills remaining viewport ── */}
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 64px)",
          backgroundColor: "var(--islametra-bg)",
        }}
      >
        {/* ── Desktop sidebar spacer — keeps main content offset right ── */}
        <div className="hidden lg:block" style={{ width: 264, flexShrink: 0 }} />

        {/* ── Desktop sidebar — fixed, full viewport height ── */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 264,
            height: "100vh",
            zIndex: 52,
            display: "flex",
            flexDirection: "column",
            backgroundColor: isLight ? "rgba(252,251,248,0.97)" : "rgba(9, 11, 10, 0.97)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            borderRight: "1px solid var(--islametra-line)",
            boxShadow: isLight
              ? "2px 0 16px -4px rgba(0,0,0,0.07), 1px 0 0 rgba(0,0,0,0.04)"
              : "2px 0 24px -6px rgba(0,0,0,0.6), 1px 0 0 rgba(255,255,255,0.04)",
          }}
          className="hidden lg:flex"
        >
          <SidebarContent
            sessions={sessions}
            currentSessionId={currentSessionId}
            onNewSession={createNewSession}
            onSelectSession={setCurrentSessionId}
            onDeleteSession={handleDeleteSession}
            onClearAll={handleClearAll}
            isLight={isLight}
          />
        </aside>

        {/* ── Main chat column ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100%",
          }}
        >
          {/* Mobile top bar */}
          <div
            className="flex lg:hidden"
            style={{
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderBottom: "1px solid var(--islametra-line)",
              flexShrink: 0,
              backgroundColor: "var(--islametra-bg)",
            }}
          >
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--islametra-line)",
                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                color: "var(--islametra-fg-mute)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label={ta.openSidebar}
            >
              <Menu size={15} />
            </button>
            <span
              style={{
                fontSize: 13,
                color: "var(--islametra-fg-soft)",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentSession?.title || ta.defaultTitle}
            </span>
          </div>

          {/* Messages — scrollable */}
          <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {messages.length === 0 ? (
              /* ── Empty state ── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100%",
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                {/* Icon with glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ position: "relative", marginBottom: 22 }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: -24,
                      background:
                        "radial-gradient(circle, oklch(0.62 0.13 155 / 0.14), transparent 70%)",
                      filter: "blur(14px)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: "oklch(0.62 0.13 155 / 0.1)",
                      border: "1px solid oklch(0.62 0.13 155 / 0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Sparkles size={22} style={{ color: "oklch(0.78 0.13 155)" }} />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.07 }}
                  style={{
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(22px, 3.5vw, 30px)",
                    letterSpacing: "-0.03em",
                    color: "var(--islametra-fg)",
                    marginBottom: 10,
                    lineHeight: 1.1,
                  }}
                >
                  AI Chat{" "}
                  <em
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: "var(--islametra-emerald-soft)",
                    }}
                  >
                    {ta.titleEm}
                  </em>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.13 }}
                  style={{
                    fontSize: "clamp(13px, 1.6vw, 14px)",
                    color: "var(--islametra-fg-mute)",
                    lineHeight: 1.65,
                    maxWidth: 360,
                    marginBottom: 32,
                  }}
                >
                  {ta.sub}
                </motion.p>

                {/* Prompt chips */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 8,
                    width: "100%",
                    maxWidth: 520,
                    textAlign: "left",
                    marginBottom: 24,
                  }}
                >
                  {ta.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      style={{
                        padding: "11px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--islametra-line)",
                        background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                        color: "var(--islametra-fg-mute)",
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Geist', sans-serif",
                        transition: "border-color 0.15s, background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.35)";
                        e.currentTarget.style.background = "oklch(0.62 0.13 155 / 0.06)";
                        e.currentTarget.style.color = "var(--islametra-fg-soft)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--islametra-line)";
                        e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)";
                        e.currentTarget.style.color = "var(--islametra-fg-mute)";
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.32 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 13px",
                    borderRadius: 999,
                    background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  <AlertTriangle
                    size={10}
                    style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "var(--islametra-fg-dim)",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {ta.disclaimer2}
                  </span>
                </motion.div>
              </div>
            ) : (
              /* ── Messages list ── */
              <div
                style={{
                  maxWidth: 700,
                  margin: "0 auto",
                  padding: "24px 24px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={handleCopy}
                    isLight={isLight}
                  />
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <TypingIndicator />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input bar — pinned to bottom ── */}
          <div
            style={{
              padding: "12px 20px 16px",
              borderTop: "1px solid var(--islametra-line)",
              backgroundColor: "var(--islametra-bg)",
              flexShrink: 0,
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                maxWidth: 700,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={ta.inputPlaceholder}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                    border: "1px solid var(--islametra-line)",
                    color: "var(--islametra-fg)",
                    fontSize: 14,
                    fontFamily: "'Geist', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--islametra-line)";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                aria-label="Kirim pesan"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  border: "none",
                  background:
                    !input.trim() || isLoading
                      ? (isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)")
                      : "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                  color:
                    !input.trim() || isLoading ? "var(--islametra-fg-dim)" : "#08110b",
                  cursor:
                    !input.trim() || isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                  boxShadow:
                    !input.trim() || isLoading
                      ? "none"
                      : "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px -4px oklch(0.62 0.13 155 / 0.4)",
                }}
              >
                <Send size={16} />
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                fontSize: 10.5,
                color: "var(--islametra-fg-dim)",
                fontFamily: "'Geist Mono', monospace",
                marginTop: 8,
                opacity: 0.6,
              }}
            >
              {ta.inputHint}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
