export default function Loading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--islametra-bg)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid var(--islametra-line-strong)",
            borderTopColor: "var(--islametra-emerald)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Memuat...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
