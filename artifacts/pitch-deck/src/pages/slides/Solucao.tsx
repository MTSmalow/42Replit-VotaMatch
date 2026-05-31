export default function Solucao() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(155deg, #0F2740 0%, #1A5276 60%, #0D3B5E 100%)" }}>
      {/* Accent shape */}
      <div className="absolute top-0 right-0 rounded-full" style={{ width: "35vw", height: "35vw", background: "#27AE60", opacity: 0.08, transform: "translate(15%, -15%)" }} />

      {/* Top label */}
      <div className="absolute" style={{ top: "8vh", left: "6vw" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          A Solução
        </p>
      </div>

      {/* Main content: left headline + right visual */}
      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "6vw", paddingRight: "5vw", paddingTop: "14vh" }}>

        {/* Left: headline + description */}
        <div style={{ flex: "0 0 48vw", paddingRight: "4vw" }}>
          <h2 style={{ fontSize: "4.8vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textWrap: "balance", marginBottom: "3vh" }}>
            Um quiz de valores,
            não de nomes.
          </h2>
          <p style={{ fontSize: "2.2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, textWrap: "pretty" }}>
            O VotaMatch BR apresenta <strong style={{ fontWeight: 600, color: "#27AE60" }}>12 afirmações</strong> sobre 5 temas centrais. O eleitor concorda, discorda ou fica neutro. Um algoritmo de proximidade calcula o alinhamento com cada candidato.
          </p>
        </div>

        {/* Right: card mockup */}
        <div style={{ flex: "0 0 38vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "28vw", background: "#FFFFFF", borderRadius: "2vw", padding: "3vw", boxShadow: "0 2vw 4vw rgba(0,0,0,0.35)" }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
              <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "#EAF5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#27AE60" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.9vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", textTransform: "uppercase", letterSpacing: "0.1em" }}>Meio Ambiente</p>
                <p style={{ fontSize: "0.8vw", fontFamily: "Source Sans 3, sans-serif", color: "#5D6D7E" }}>Pergunta 3 de 12</p>
              </div>
            </div>

            <p style={{ fontSize: "1.3vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#0D1B2A", lineHeight: 1.4, marginBottom: "2.5vh", textWrap: "balance" }}>
              "O desmatamento da Amazônia deve ir a zero."
            </p>

            {/* Swipe buttons */}
            <div style={{ display: "flex", gap: "0.8vw" }}>
              <div style={{ flex: 1, padding: "0.8vw", borderRadius: "0.8vw", background: "#FDECEA", border: "0.1vw solid #E74C3C", textAlign: "center" }}>
                <p style={{ fontSize: "0.85vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#E74C3C" }}>Discordo</p>
              </div>
              <div style={{ flex: 1, padding: "0.8vw", borderRadius: "0.8vw", background: "#F2F3F4", border: "0.1vw solid #BDC3C7", textAlign: "center" }}>
                <p style={{ fontSize: "0.85vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#5D6D7E" }}>Neutro</p>
              </div>
              <div style={{ flex: 1, padding: "0.8vw", borderRadius: "0.8vw", background: "#EAFAF1", border: "0.1vw solid #27AE60", textAlign: "center" }}>
                <p style={{ fontSize: "0.85vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60" }}>Concordo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
