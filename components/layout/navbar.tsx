"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Moon, Sun, X, Sparkles, BookOpen, Heart, BookMarked, Clock, Star, Bookmark, ChevronDown, Calculator } from "lucide-react";
import { useTheme } from "next-themes";
import { SearchDialog } from "@/components/home/search-dialog";
import dynamic from "next/dynamic";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const useClerk = clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");

const AuthButton = useClerk
  ? dynamic(() => import("@/components/layout/auth-button").then((m) => m.AuthButton), { ssr: false })
  : ({ mobile }: { mobile?: boolean }) =>
      mobile ? (
        <Link
          href="/sign-in"
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Geist', sans-serif",
            background: "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
            color: "#08110b",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px -8px oklch(0.62 0.13 155 / 0.5)",
          }}
        >
          Mulai Gratis
        </Link>
      ) : null;

const NAV_HREFS = ["/quran", "/doa", "/hadith", "/jadwal-sholat", "/ai-chat"] as const;
const NAV_ICONS = [BookOpen, Heart, BookMarked, Clock, Sparkles] as const;
const BELAJAR_HREFS = ["/kisah-nabi", "/sejarah", "/artikel", "/zakat"] as const;
const BELAJAR_ICONS = [Star, Clock, BookOpen, Calculator] as const;

function BelajarDropdown({ isLight, currentPath, belajarLinks, label }: { isLight: boolean; currentPath: string; belajarLinks: { href: string; label: string; icon: React.ElementType }[]; label: string }) {
  const [open, setOpen] = useState(false);
  const isActive = belajarLinks.some((l) => currentPath.startsWith(l.href));

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          borderRadius: 7,
          fontSize: 12.5,
          fontFamily: "'Geist', sans-serif",
          fontWeight: isActive ? 500 : 400,
          letterSpacing: "-0.015em",
          whiteSpace: "nowrap",
          border: "none",
          cursor: "pointer",
          transition: "color 0.15s ease, background 0.15s ease",
          color: isActive
            ? "var(--islametra-fg)"
            : open
            ? "var(--islametra-fg-soft)"
            : "var(--islametra-fg-mute)",
          background: isActive
            ? isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"
            : open
            ? isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"
            : "transparent",
        }}
      >
        {label}
        <ChevronDown
          size={11}
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.6,
          }}
        />
        {isActive && (
          <span
            style={{
              position: "absolute",
              bottom: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 16,
              height: 2,
              borderRadius: 999,
              background: "oklch(0.62 0.13 155)",
              opacity: 0.7,
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.13 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              minWidth: 168,
              borderRadius: 12,
              background: isLight ? "rgba(250,249,246,0.99)" : "rgba(13,17,14,0.98)",
              border: "1px solid var(--islametra-line)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: isLight
                ? "0 8px 32px -8px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.7)"
                : "0 8px 32px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
              padding: "6px",
              zIndex: 100,
            }}
          >
            {belajarLinks.map((link) => {
              const Icon = link.icon;
              const isItemActive = currentPath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 10px",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: isItemActive ? "var(--islametra-fg)" : "var(--islametra-fg-mute)",
                    background: isItemActive
                      ? isLight ? "rgba(0,0,0,0.06)" : "oklch(0.62 0.13 155 / 0.10)"
                      : "transparent",
                    fontSize: 13,
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: isItemActive ? 500 : 400,
                    letterSpacing: "-0.01em",
                    transition: "background 0.13s, color 0.13s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isItemActive) {
                      (e.currentTarget as HTMLElement).style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-soft)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isItemActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-mute)";
                    }
                  }}
                >
                  <Icon
                    size={13}
                    style={{
                      color: isItemActive ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)",
                      flexShrink: 0,
                    }}
                  />
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ href, label, isActive, isLight }: { href: string; label: string; isActive: boolean; isLight: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isAI = href === "/ai-chat";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: isAI ? 5 : 0,
        padding: "5px 10px",
        borderRadius: 7,
        fontSize: 12.5,
        fontFamily: "'Geist', sans-serif",
        fontWeight: isActive ? 500 : 400,
        letterSpacing: "-0.015em",
        whiteSpace: "nowrap",
        textDecoration: "none",
        transition: "color 0.15s ease, background 0.15s ease",
        color: isActive
          ? "var(--islametra-fg)"
          : hovered
          ? "var(--islametra-fg-soft)"
          : "var(--islametra-fg-mute)",
        background: isActive
          ? isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"
          : hovered
          ? isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"
          : "transparent",
      }}
    >
      {isAI && (
        <Sparkles
          size={12}
          style={{
            color: isActive ? "oklch(0.78 0.13 155)" : hovered ? "oklch(0.78 0.13 155 / 0.7)" : "var(--islametra-fg-dim)",
            transition: "color 0.15s ease",
            flexShrink: 0,
          }}
        />
      )}
      {label}
      {isActive && (
        <span
          style={{
            position: "absolute",
            bottom: -1,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 2,
            borderRadius: 999,
            background: "oklch(0.62 0.13 155)",
            opacity: 0.7,
          }}
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();
  const tn = translations[lang].nav;
  const isLight = mounted && theme === "light";

  const navLinks = [
    { href: "/quran", label: tn.quran, icon: NAV_ICONS[0] },
    { href: "/doa", label: tn.doa, icon: NAV_ICONS[1] },
    { href: "/hadith", label: tn.hadith, icon: NAV_ICONS[2] },
    { href: "/jadwal-sholat", label: tn.prayerTimes, icon: NAV_ICONS[3] },
    { href: "/ai-chat", label: tn.aiChat, icon: NAV_ICONS[4] },
  ];
  const belajarLinks = [
    { href: "/kisah-nabi", label: tn.prophets, icon: BELAJAR_ICONS[0] },
    { href: "/sejarah", label: tn.history, icon: BELAJAR_ICONS[1] },
    { href: "/artikel", label: lang === "en" ? "Articles" : "Artikel", icon: BELAJAR_ICONS[2] },
    { href: "/zakat", label: lang === "en" ? "Zakat Calc" : "Kalkulator Zakat", icon: BELAJAR_ICONS[3] },
  ];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? "8px 0" : "12px 0",
          transition: "padding 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Navbar pill */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              height: 48,
              padding: "0 6px 0 18px",
              borderRadius: 16,
              background: isLight
                ? scrolled ? "rgba(250,249,246,0.97)" : "rgba(250,249,246,0.88)"
                : scrolled ? "rgba(8,10,9,0.92)" : "rgba(10,12,11,0.80)",
              border: isLight
                ? `1px solid ${scrolled ? "rgba(0,0,0,0.11)" : "rgba(0,0,0,0.07)"}`
                : `1px solid ${scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              boxShadow: isLight
                ? scrolled ? "0 8px 32px -12px rgba(0,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.05)" : "0 2px 12px -4px rgba(0,0,0,0.07)"
                : scrolled ? "0 8px 32px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 2px 16px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
              transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            {/* LEFT — Brand */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 3px 12px -4px oklch(0.62 0.13 155 / 0.6)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.svg" alt="Islametra" width={28} height={28} style={{ display: "block" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  fontSize: 14.5,
                  color: "var(--islametra-fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                Islametra
              </span>
              <span
                className="hidden sm:inline-flex"
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: isLight ? "oklch(0.48 0.14 155 / 0.08)" : "oklch(0.62 0.13 155 / 0.10)",
                  border: isLight ? "1px solid oklch(0.48 0.14 155 / 0.18)" : "1px solid oklch(0.62 0.13 155 / 0.22)",
                  color: isLight ? "oklch(0.42 0.14 155)" : "oklch(0.75 0.12 155)",
                  letterSpacing: "0.05em",
                  textTransform: "lowercase",
                  fontFamily: "'Geist Mono', monospace",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                beta
              </span>
            </Link>

            {/* CENTER — Desktop nav */}
            <nav
              className="hidden lg:flex"
              style={{
                alignItems: "center",
                gap: 0,
                padding: "0 16px",
              }}
            >
              {navLinks.slice(0, 4).map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={pathname.startsWith(link.href)}
                  isLight={isLight}
                />
              ))}
              <BelajarDropdown isLight={isLight} currentPath={pathname} belajarLinks={belajarLinks} label={tn.learn} />
              {navLinks.slice(4).map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={pathname.startsWith(link.href)}
                  isLight={isLight}
                />
              ))}
            </nav>

            {/* RIGHT — Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                justifyContent: "flex-end",
              }}
            >
              {/* Desktop search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex"
                style={{
                  alignItems: "center",
                  gap: 8,
                  height: 32,
                  padding: "0 12px",
                  borderRadius: 8,
                  background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                  border: "1px solid var(--islametra-line)",
                  color: "var(--islametra-fg-dim)",
                  fontSize: 12,
                  fontFamily: "'Geist', sans-serif",
                  cursor: "pointer",
                  minWidth: 180,
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--islametra-line)";
                  e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
                }}
                aria-label="Search"
              >
                <Search size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span style={{ flex: 1, textAlign: "left" }}>{tn.search}</span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10,
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                    border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
                    color: "var(--islametra-fg-dim)",
                    whiteSpace: "nowrap",
                  }}
                >
                  ⌘K
                </span>
              </button>

              {/* Mobile search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--islametra-fg-mute)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              {/* Bookmark */}
              <Link
                href="/bookmark"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: "grid", placeItems: "center",
                  color: "var(--islametra-fg-mute)",
                  transition: "color 0.15s ease",
                }}
                aria-label="Bookmark"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-soft)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-mute)"; }}
              >
                <Bookmark size={15} />
              </Link>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--islametra-fg-mute)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--islametra-fg-soft)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--islametra-fg-mute)";
                    e.currentTarget.style.background = "transparent";
                  }}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              )}

              {/* Language toggle */}
              {mounted && (
                <button
                  onClick={() => setLang(lang === "id" ? "en" : "id")}
                  style={{
                    height: 28,
                    padding: "0 8px",
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    fontFamily: "'Geist Mono', monospace",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "var(--islametra-fg-mute)",
                    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                    border: "1px solid var(--islametra-line)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--islametra-fg-soft)";
                    e.currentTarget.style.borderColor = isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--islametra-fg-mute)";
                    e.currentTarget.style.borderColor = "var(--islametra-line)";
                  }}
                  aria-label="Toggle language"
                >
                  <span style={{ opacity: lang === "id" ? 1 : 0.4 }}>ID</span>
                  <span style={{ opacity: 0.3 }}>/</span>
                  <span style={{ opacity: lang === "en" ? 1 : 0.4 }}>EN</span>
                </button>
              )}

              {/* Divider */}
              <div
                className="hidden md:block"
                style={{
                  width: 1,
                  height: 18,
                  background: "var(--islametra-line)",
                  margin: "0 2px",
                }}
              />

              {/* Auth indicator */}
              <div className="hidden md:flex items-center">
                <AuthButton />
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--islametra-fg-mute)",
                  background: mobileOpen ? (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)") : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: mobileOpen ? -45 : 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X size={17} /> : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <rect x="2" y="4.5" width="13" height="1.5" rx="0.75" fill="currentColor" />
                        <rect x="2" y="8" width="9" height="1.5" rx="0.75" fill="currentColor" />
                        <rect x="2" y="11.5" width="11" height="1.5" rx="0.75" fill="currentColor" />
                      </svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                width: "min(320px, 88vw)",
                background: isLight ? "rgba(250,249,246,0.98)" : "rgba(10,12,11,0.97)",
                borderLeft: "1px solid var(--islametra-line)",
                backdropFilter: "blur(24px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Drawer header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 20px 16px",
                  borderBottom: "1px solid var(--islametra-line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      background:
                        "radial-gradient(circle at 30% 30%, oklch(0.78 0.12 155) 0%, oklch(0.45 0.11 155) 70%)",
                      color: "#08110b",
                      fontSize: 14,
                      fontFamily: "'Amiri', serif",
                      fontWeight: 700,
                    }}
                  >
                    ن
                  </div>
                  <span
                    style={{
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--islametra-fg)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Islametra
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--islametra-fg-mute)",
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Close menu"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
                {[...navLinks.slice(0, 4), ...belajarLinks, ...navLinks.slice(4)].map((link, i) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = link.icon;
                  const isBelajarDivider = i === 4;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      {isBelajarDivider && (
                        <div
                          style={{
                            padding: "14px 14px 6px",
                            fontSize: 10,
                            fontFamily: "'Geist Mono', monospace",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--islametra-fg-dim)",
                            fontWeight: 500,
                          }}
                        >
                          {tn.learn}
                        </div>
                      )}
                      <Link
                        href={link.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderRadius: 12,
                          marginBottom: 3,
                          textDecoration: "none",
                          background: isActive
                            ? "oklch(0.62 0.13 155 / 0.1)"
                            : "transparent",
                          border: `1px solid ${isActive ? "oklch(0.62 0.13 155 / 0.2)" : "transparent"}`,
                          color: isActive ? "var(--islametra-fg)" : "var(--islametra-fg-mute)",
                          transition: "background 0.15s ease, border-color 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            display: "grid",
                            placeItems: "center",
                            background: isActive
                              ? "oklch(0.62 0.13 155 / 0.15)"
                              : isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            size={15}
                            style={{
                              color: isActive ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 14,
                            fontFamily: "'Geist', sans-serif",
                            fontWeight: isActive ? 500 : 400,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {link.label}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              marginLeft: "auto",
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "oklch(0.78 0.13 155)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div
                style={{
                  padding: "16px 16px 32px",
                  borderTop: "1px solid var(--islametra-line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <AuthButton mobile />
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMobileOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--islametra-line)",
                    background: "rgba(255,255,255,0.03)",
                    color: "var(--islametra-fg-mute)",
                    fontSize: 14,
                    fontFamily: "'Geist', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <Search size={14} />
                  <span>{tn.search}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--islametra-fg-dim)",
                    }}
                  >
                    ⌘K
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
