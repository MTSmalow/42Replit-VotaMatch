export default function Capa() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(155deg, #0F2740 0%, #1A5276 60%, #0D3B5E 100%)" }}>
      {/* Background accent shapes */}
      <div className="absolute top-0 right-0 rounded-full opacity-10" style={{ width: "45vw", height: "45vw", background: "#27AE60", transform: "translate(20%, -20%)" }} />
      <div className="absolute bottom-0 left-0 rounded-full opacity-8" style={{ width: "28vw", height: "28vw", background: "#27AE60", transform: "translate(-20%, 20%)" }} />

      {/* Green accent bar left */}
      <div className="absolute left-0" style={{ top: "8vh", bottom: "8vh", width: "0.6vw", background: "#27AE60" }} />

      {/* Split layout: left text / right QR */}
      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "5vw", paddingRight: "5vw" }}>

        {/* Left: brand + tagline */}
        <div style={{ flex: "0 0 56vw", paddingLeft: "4vw", paddingRight: "6vw", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* Logo mark */}
          <div style={{ width: "7vw", height: "7vw", borderRadius: "1.4vw", background: "rgba(39,174,96,0.18)", border: "0.15vw solid rgba(39,174,96,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3.5vh" }}>
            <svg width="3.5vw" height="3.5vw" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="20" width="12" height="24" rx="2" fill="#27AE60" />
              <rect x="18" y="12" width="12" height="32" rx="2" fill="#5DADE2" />
              <rect x="32" y="4" width="12" height="40" rx="2" fill="#27AE60" opacity="0.7" />
            </svg>
          </div>

          {/* App name */}
          <div style={{ fontFamily: "Raleway, sans-serif", marginBottom: "2.5vh" }}>
            <span style={{ fontSize: "7.5vw", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1 }}>
              VotaMatch
            </span>
            <span style={{ fontSize: "7.5vw", fontWeight: 900, color: "#27AE60", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {" "}BR
            </span>
          </div>

          {/* Tagline */}
          <p style={{ fontSize: "2.3vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.4, textWrap: "balance", marginBottom: "4vh" }}>
            Encontre candidatos que pensam como você
          </p>

          {/* Divider */}
          <div style={{ width: "5vw", height: "0.25vw", background: "#27AE60", marginBottom: "3vh", borderRadius: "99px" }} />

          {/* Sub-label */}
          <p style={{ fontSize: "1.6vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Brasil · Eleições 2026
          </p>
        </div>

        {/* Right: QR code */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5vh" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "1.8vw", padding: "2.5vw", display: "flex", flexDirection: "column", alignItems: "center", gap: "2vh", boxShadow: "0 1.5vw 3vw rgba(0,0,0,0.35)" }}>
            <svg width="13vw" height="13vw" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Top-left finder */}
              <rect x="0" y="0" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="4" y="4" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="8" y="8" width="14" height="14" rx="1" fill="#0F2740" />
              {/* Top-right finder */}
              <rect x="80" y="0" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="84" y="4" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="88" y="8" width="14" height="14" rx="1" fill="#0F2740" />
              {/* Bottom-left finder */}
              <rect x="0" y="80" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="4" y="84" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="8" y="88" width="14" height="14" rx="1" fill="#0F2740" />
              {/* Center logo mark */}
              <rect x="44" y="44" width="6" height="14" rx="1" fill="#27AE60" />
              <rect x="52" y="40" width="6" height="18" rx="1" fill="#5DADE2" />
              <rect x="60" y="36" width="6" height="22" rx="1" fill="#27AE60" opacity="0.8" />
              {/* Data dots */}
              <rect x="38" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="48" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="68" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="14" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="14" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="68" y="14" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="14" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="14" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="14" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="78" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="48" y="78" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="68" y="78" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="80" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="100" y="80" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="90" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="90" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="68" y="90" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="100" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="100" width="6" height="6" rx="1" fill="#27AE60" />
            </svg>
            <p style={{ fontSize: "1.1vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#5D6D7E", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
              Escaneie para baixar
            </p>
          </div>

          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textAlign: "center" }}>
            App Store · Google Play
          </p>
        </div>
      </div>
    </div>
  );
}
