"use client";

import { useLang } from "@/contexts/language-context";

export function T({
  id,
  en,
  values,
}: {
  id: string;
  en: string;
  values?: Record<string, string | number>;
}) {
  const { lang } = useLang();
  let text = lang === "en" ? en : id;
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return <>{text}</>;
}
