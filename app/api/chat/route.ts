import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `Kamu adalah AI asisten Islami yang berpengetahuan luas bernama "Islametra AI".

Kamu membantu pengguna memahami Islam dengan cara yang:
- Ramah, sopan, dan penuh kasih sayang
- Berdasarkan Al-Quran dan hadits shahih
- Mudah dipahami oleh semua kalangan
- Menggunakan bahasa Indonesia yang baik
- Menyertakan referensi Al-Quran atau hadits bila memungkinkan

PENTING:
- JANGAN memberikan fatwa definitif untuk masalah sensitif — sarankan konsultasi dengan ulama
- JANGAN mendukung pandangan ekstremis atau radikal
- Selalu tambahkan disclaimer untuk pertanyaan hukum fiqih yang kompleks
- Mulai dengan "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم" hanya untuk permintaan doa/dzikir
- Gunakan "ﷺ" setelah menyebut Nabi Muhammad
- Jawab dalam Bahasa Indonesia kecuali ditanya dalam bahasa lain

Format jawaban:
- Ringkas dan jelas
- Gunakan paragraf yang mudah dibaca
- Sertakan referensi bila ada (contoh: QS. Al-Baqarah: 183 atau HR. Bukhari No. 1)`;

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60_000;

function getClientKey(req: NextRequest): string {
  // Prefer the first IP in x-forwarded-for (before any proxies)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  // Vercel also provides a real IP header
  const realIp = req.headers.get("x-real-ip");
  return ip || realIp || "anonymous";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();

  // Cleanup stale entries to avoid memory leak
  if (RATE_LIMIT_MAP.size > 5000) {
    for (const [k, v] of RATE_LIMIT_MAP) {
      if (now > v.resetTime) RATE_LIMIT_MAP.delete(k);
    }
  }

  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetTime) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req);

  if (!checkRateLimit(clientKey)) {
    return new Response(
      JSON.stringify({ error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Pesan tidak valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sanitizedMessages = messages
      .filter((m) => m.role && m.content && typeof m.content === "string" && m.content.length <= 4000)
      .slice(-20)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: (m.content as string).slice(0, 2000),
      }));

    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...sanitizedMessages,
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan. Coba lagi." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
