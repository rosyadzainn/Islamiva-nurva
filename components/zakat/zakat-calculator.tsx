"use client";

import { useState } from "react";
import { Calculator, Coins, Users, Briefcase } from "lucide-react";
import { useLang } from "@/contexts/language-context";

type TabKey = "maal" | "fitrah" | "profesi";

const NISAB_GRAM_GOLD = 85;
const NISAB_GRAM_SILVER = 595;
const ZAKAT_RATE = 0.025;
const FITRAH_KG = 2.5;

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function ZakatCalculator() {
  const { lang } = useLang();
  const isEn = lang === "en";

  const [tab, setTab] = useState<TabKey>("maal");

  // Zakat Maal
  const [goldPrice, setGoldPrice] = useState(1600000);
  const [wealth, setWealth] = useState(0);
  const [debt, setDebt] = useState(0);
  const [maalResult, setMaalResult] = useState<{ zakat: number; nisab: number; eligible: boolean } | null>(null);

  // Zakat Fitrah
  const [persons, setPersons] = useState(1);
  const [ricePrice, setRicePrice] = useState(15000);
  const [fitrahResult, setFitrahResult] = useState<{ total: number; perPerson: number } | null>(null);

  // Zakat Profesi
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [profesiResult, setProfesiResult] = useState<{ zakat: number; nisab: number; eligible: boolean } | null>(null);

  const calcMaal = () => {
    const nisab = NISAB_GRAM_GOLD * goldPrice;
    const netWealth = Math.max(0, wealth - debt);
    const eligible = netWealth >= nisab;
    setMaalResult({ zakat: eligible ? netWealth * ZAKAT_RATE : 0, nisab, eligible });
  };

  const calcFitrah = () => {
    const perPerson = FITRAH_KG * ricePrice;
    setFitrahResult({ total: perPerson * persons, perPerson });
  };

  const calcProfesi = () => {
    const nisab = (NISAB_GRAM_SILVER * goldPrice) / 80;
    const eligible = monthlyIncome >= nisab;
    setProfesiResult({ zakat: eligible ? monthlyIncome * ZAKAT_RATE : 0, nisab, eligible });
  };

  const tabs = [
    { key: "maal" as TabKey, label: isEn ? "Wealth Zakat" : "Zakat Maal", icon: Coins },
    { key: "fitrah" as TabKey, label: isEn ? "Fitrah Zakat" : "Zakat Fitrah", icon: Users },
    { key: "profesi" as TabKey, label: isEn ? "Income Zakat" : "Zakat Profesi", icon: Briefcase },
  ];

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--islametra-line)",
    color: "var(--islametra-fg)",
    fontFamily: "'Geist', sans-serif",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: 12,
    color: "var(--islametra-fg-dim)",
    fontFamily: "'Geist', sans-serif",
    marginBottom: 6,
    display: "block" as const,
  };

  const btnStyle = {
    width: "100%",
    padding: "11px 0",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
    color: "#08110b",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Geist', sans-serif",
    cursor: "pointer",
    marginTop: 8,
  };

  const resultBox = (eligible: boolean, label: string, amount: number, note?: string) => (
    <div
      style={{
        marginTop: 20,
        padding: "18px 20px",
        borderRadius: 14,
        background: eligible ? "oklch(0.62 0.13 155 / 0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${eligible ? "oklch(0.62 0.13 155 / 0.25)" : "var(--islametra-line)"}`,
      }}
    >
      <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Geist', sans-serif", letterSpacing: "-0.03em", color: eligible ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-mute)" }}>
        {formatIDR(amount)}
      </p>
      {note && (
        <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginTop: 6 }}>
          {note}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "oklch(0.62 0.13 155 / 0.12)",
            border: "1px solid oklch(0.62 0.13 155 / 0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Calculator size={24} style={{ color: "oklch(0.78 0.13 155)" }} />
          </div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg)", letterSpacing: "-0.02em", marginBottom: 8 }}>
            {isEn ? "Zakat " : "Kalkulator "}<em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.82 0.08 80)" }}>{isEn ? "Calculator" : "Zakat"}</em>
          </h1>
          <p style={{ fontSize: 14, color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif" }}>
            {isEn ? "Calculate your zakat accurately and easily." : "Hitung zakat Anda dengan mudah dan akurat."}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, background: "var(--islametra-bg-1)", padding: 6, borderRadius: 14, border: "1px solid var(--islametra-line)" }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setMaalResult(null); setFitrahResult(null); setProfesiResult(null); }}
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === key ? "var(--islametra-bg)" : "transparent",
                boxShadow: tab === key ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                color: tab === key ? "var(--islametra-fg-soft)" : "var(--islametra-fg-dim)",
                fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: tab === key ? 500 : 400,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ padding: "28px 28px", borderRadius: 18, background: "var(--islametra-bg-1)", border: "1px solid var(--islametra-line)" }}>

          {/* Zakat Maal */}
          {tab === "maal" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 24, lineHeight: 1.6 }}>
                {isEn
                  ? "Zakat Maal is 2.5% of net wealth (assets minus debts) that has reached the nisab and been held for 1 lunar year (haul)."
                  : "Zakat Maal adalah 2,5% dari harta bersih (aset dikurangi hutang) yang telah mencapai nisab dan dimiliki selama 1 tahun hijriyah (haul)."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{isEn ? "Current gold price (per gram)" : "Harga emas saat ini (per gram)"}</label>
                  <input type="number" value={goldPrice} onChange={e => setGoldPrice(+e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEn ? "Total assets (IDR)" : "Total aset / harta (Rp)"}</label>
                  <input type="number" value={wealth} onChange={e => setWealth(+e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEn ? "Total debts (IDR)" : "Total hutang (Rp)"}</label>
                  <input type="number" value={debt} onChange={e => setDebt(+e.target.value)} style={inputStyle} />
                </div>
                <button onClick={calcMaal} style={btnStyle}>{isEn ? "Calculate" : "Hitung Zakat"}</button>
              </div>
              {maalResult && (
                <div>
                  <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--islametra-line)" }}>
                    <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                      Nisab ({NISAB_GRAM_GOLD}g emas) = {formatIDR(maalResult.nisab)}
                    </p>
                    <p style={{ fontSize: 12, marginTop: 4, color: maalResult.eligible ? "oklch(0.78 0.13 155)" : "oklch(0.65 0.15 30)", fontFamily: "'Geist Mono', monospace" }}>
                      {maalResult.eligible
                        ? (isEn ? "✓ Eligible for zakat" : "✓ Wajib zakat")
                        : (isEn ? "✗ Below nisab, not yet obligatory" : "✗ Di bawah nisab, belum wajib")}
                    </p>
                  </div>
                  {resultBox(maalResult.eligible, isEn ? "Zakat to pay" : "Zakat yang harus dibayar", maalResult.zakat,
                    maalResult.eligible ? `2.5% × ${formatIDR(Math.max(0, wealth - debt))}` : undefined)}
                </div>
              )}
            </div>
          )}

          {/* Zakat Fitrah */}
          {tab === "fitrah" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 24, lineHeight: 1.6 }}>
                {isEn
                  ? "Zakat Fitrah is obligatory for every Muslim before Eid al-Fitr prayer. The amount is 2.5 kg of staple food (rice) or its equivalent in money per person."
                  : "Zakat Fitrah wajib bagi setiap Muslim sebelum shalat Idul Fitri. Besarnya adalah 2,5 kg makanan pokok (beras) atau senilai uangnya per jiwa."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{isEn ? "Number of family members" : "Jumlah jiwa / anggota keluarga"}</label>
                  <input type="number" min={1} value={persons} onChange={e => setPersons(Math.max(1, +e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEn ? "Rice price per kg (IDR)" : "Harga beras per kg (Rp)"}</label>
                  <input type="number" value={ricePrice} onChange={e => setRicePrice(+e.target.value)} style={inputStyle} />
                </div>
                <button onClick={calcFitrah} style={btnStyle}>{isEn ? "Calculate" : "Hitung Zakat"}</button>
              </div>
              {fitrahResult && (
                <div>
                  <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--islametra-line)" }}>
                    <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                      {isEn ? "Per person" : "Per jiwa"}: {FITRAH_KG} kg × {formatIDR(ricePrice)} = {formatIDR(fitrahResult.perPerson)}
                    </p>
                  </div>
                  {resultBox(true, isEn ? `Total zakat for ${persons} person(s)` : `Total zakat untuk ${persons} jiwa`, fitrahResult.total)}
                </div>
              )}
            </div>
          )}

          {/* Zakat Profesi */}
          {tab === "profesi" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 24, lineHeight: 1.6 }}>
                {isEn
                  ? "Zakat on professional income is 2.5% of monthly net income if it reaches the nisab (equivalent to 595g silver per month)."
                  : "Zakat profesi adalah 2,5% dari penghasilan bersih per bulan jika mencapai nisab (setara 595g perak per bulan)."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{isEn ? "Current gold price (per gram, for nisab reference)" : "Harga emas saat ini (per gram, acuan nisab)"}</label>
                  <input type="number" value={goldPrice} onChange={e => setGoldPrice(+e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEn ? "Monthly net income (IDR)" : "Penghasilan bersih per bulan (Rp)"}</label>
                  <input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(+e.target.value)} style={inputStyle} />
                </div>
                <button onClick={calcProfesi} style={btnStyle}>{isEn ? "Calculate" : "Hitung Zakat"}</button>
              </div>
              {profesiResult && (
                <div>
                  <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--islametra-line)" }}>
                    <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                      Nisab ({NISAB_GRAM_SILVER}g perak) ≈ {formatIDR(profesiResult.nisab)}
                    </p>
                    <p style={{ fontSize: 12, marginTop: 4, color: profesiResult.eligible ? "oklch(0.78 0.13 155)" : "oklch(0.65 0.15 30)", fontFamily: "'Geist Mono', monospace" }}>
                      {profesiResult.eligible
                        ? (isEn ? "✓ Eligible for zakat" : "✓ Wajib zakat")
                        : (isEn ? "✗ Below nisab, not yet obligatory" : "✗ Di bawah nisab, belum wajib")}
                    </p>
                  </div>
                  {resultBox(profesiResult.eligible, isEn ? "Monthly zakat to pay" : "Zakat profesi per bulan", profesiResult.zakat,
                    profesiResult.eligible ? `2.5% × ${formatIDR(monthlyIncome)}` : undefined)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
          {isEn
            ? "This calculator is for reference only. Please consult a scholar or your local amil zakat for confirmation."
            : "Kalkulator ini bersifat referensi. Konsultasikan dengan ulama atau lembaga amil zakat setempat untuk kepastian."}
        </p>
      </div>
    </div>
  );
}
