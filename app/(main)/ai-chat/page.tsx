import type { Metadata } from "next";
import { AiChatModule } from "@/components/ai-chat/ai-chat-module";

export const metadata: Metadata = {
  title: "AI Chat Islami",
  description:
    "Tanya jawab tentang Islam menggunakan AI yang berpengetahuan luas tentang Al-Quran, hadits, dan fiqih Islam.",
};

export default function AiChatPage() {
  return <AiChatModule />;
}
