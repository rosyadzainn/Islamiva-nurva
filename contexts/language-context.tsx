"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "id",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const stored = localStorage.getItem("islametra-lang") as Lang | null;
    if (stored === "id" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("islametra-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
