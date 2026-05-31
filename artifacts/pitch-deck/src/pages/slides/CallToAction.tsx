export default function CallToAction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(155deg, #0F2740 0%, #1A5276 60%, #0D3B5E 100%)" }}>
      {/* Background accent shapes */}
      <div className="absolute top-0 right-0 rounded-full opacity-10" style={{ width: "40vw", height: "40vw", background: "#27AE60", transform: "translate(20%, -20%)" }} />
      <div className="absolute bottom-0 left-0 rounded-full opacity-10" style={{ width: "30vw", height: "30vw", background: "#27AE60", transform: "translate(-20%, 20%)" }} />

      {/* Green accent bar left */}
      <div className="absolute left-0" style={{ top: "8vh", bottom: "8vh", width: "0.6vw", background: "#27AE60" }} />

      {/* Split layout */}
      <div className="absolute inset-0 flex" style={{ paddingLeft: "4vw" }}>

        {/* Left: message */}
        <div style={{ flex: "0 0 52vw", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "5vw", paddingRight: "4vw" }}>
          <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2.5vh" }}>
            Junte-se a nós
          </p>
          <h2 style={{ fontSize: "5.5vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.05, textWrap: "balance", marginBottom: "3.5vh" }}>
            Baixe agora e vote
            com consciência.
          </h2>
          <p style={{ fontSize: "2.1vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, textWrap: "pretty", maxWidth: "38vw" }}>
            Disponível para Android e iOS. Gratuito, sem cadastro, sem rastreamento de dados pessoais.
          </p>

          <div style={{ display: "flex", gap: "2vw", marginTop: "4vh" }}>
            <div style={{ paddingLeft: "2vw", paddingRight: "2vw", paddingTop: "1.2vh", paddingBottom: "1.2vh", background: "#27AE60", borderRadius: "0.8vw" }}>
              <p style={{ fontSize: "1.8vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>App Store</p>
            </div>
            <div style={{ paddingLeft: "2vw", paddingRight: "2vw", paddingTop: "1.2vh", paddingBottom: "1.2vh", background: "rgba(255,255,255,0.12)", borderRadius: "0.8vw", border: "0.1vw solid rgba(255,255,255,0.3)" }}>
              <p style={{ fontSize: "1.8vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>Google Play</p>
            </div>
          </div>
        </div>

        {/* Right: QR + tagline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2.5vh" }}>
          <div style={{ width: "18vw", height: "18vw", background: "#FFFFFF", borderRadius: "1.5vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5vh" }}>
            <svg width="11vw" height="11vw" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="4" y="4" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="8" y="8" width="14" height="14" rx="1" fill="#0F2740" />
              <rect x="80" y="0" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="84" y="4" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="88" y="8" width="14" height="14" rx="1" fill="#0F2740" />
              <rect x="0" y="80" width="30" height="30" rx="2" fill="#0F2740" />
              <rect x="4" y="84" width="22" height="22" rx="1" fill="#FFFFFF" />
              <rect x="8" y="88" width="14" height="14" rx="1" fill="#0F2740" />
              <rect x="38" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="48" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="68" y="4" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="14" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="14" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="14" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="14" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="4" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="38" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="48" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="38" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="68" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="38" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="100" y="38" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="48" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="88" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="48" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="58" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="48" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="68" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="58" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="100" y="58" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="68" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="100" y="68" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="78" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="48" y="78" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="78" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="78" y="80" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="80" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="100" y="80" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="38" y="90" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="58" y="90" width="6" height="6" rx="1" fill="#27AE60" />
              <rect x="68" y="90" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="88" y="100" width="6" height="6" rx="1" fill="#0F2740" />
              <rect x="100" y="100" width="6" height="6" rx="1" fill="#27AE60" />
            </svg>
            <p style={{ fontSize: "0.9vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#5D6D7E", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Escaneie para baixar
            </p>
          </div>

          <p style={{ fontSize: "1.6vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.5)", textAlign: "center", letterSpacing: "0.02em" }}>
            VotaMatch BR
          </p>
        </div>
      </div>
    </div>
  );
}
