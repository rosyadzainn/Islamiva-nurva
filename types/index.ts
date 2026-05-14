export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  nameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  surahNumber: number;
  text: string;
  transliteration?: string;
  translation: string;
  tafsir?: string;
  audioUrl?: string;
}

export interface Doa {
  id: string;
  title: string;
  slug: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
  category: string;
  audioUrl?: string;
}

export interface DoaCategory {
  id: string;
  name: string;
  nameId: string;
  icon: string;
  count: number;
}

export interface Hadith {
  id: string;
  arab: string;
  id_text: string;
  number: number;
  kitab: string;
}

export interface HadithKitab {
  id: string;
  name: string;
  nameAr: string;
  available: number;
}

export interface ProphetStory {
  id: string;
  prophetName: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface IslamicHistory {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  period?: string;
  year?: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface BookmarkItem {
  id: string;
  type: "QURAN" | "DOA" | "HADITH" | "STORY" | "HISTORY";
  referenceId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface SearchResult {
  type: "quran" | "doa" | "hadith" | "story" | "history";
  id: string;
  title: string;
  excerpt: string;
  url: string;
}
