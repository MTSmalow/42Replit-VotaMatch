export default function ComoFunciona() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F4F8FC" }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.6vh", background: "linear-gradient(90deg, #27AE60 0%, #1A5276 100%)" }} />

      {/* Header */}
      <div className="absolute text-left" style={{ top: "8vh", left: "6vw", right: "6vw" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.2vh" }}>
          Como Funciona
        </p>
        <h2 style={{ fontSize: "4vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#0F2740", lineHeight: 1.1, textWrap: "balance" }}>
          Três passos. Dois minutos.
        </h2>
      </div>

      {/* Three columns */}
      <div className="absolute flex" style={{ top: "30vh", bottom: "8vh", left: "5vw", right: "5vw", gap: "2vw", alignItems: "stretch" }}>

        {/* Step 1 */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.4vw solid #27AE60" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <span style={{ fontSize: "2.2vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#27AE60" }}>1</span>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            Responda
          </p>
          <h3 style={{ fontSize: "2.4vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#0F2740", marginBottom: "2vh", lineHeight: 1.2 }}>
            O Quiz
          </h3>
          <p style={{ fontSize: "1.9vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.5, textWrap: "pretty" }}>
            12 afirmações sobre economia, saúde, meio ambiente, segurança e democracia. Concorde, discorde ou fique neutro.
          </p>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "3vw" }}>
          <span style={{ fontSize: "2.5vw", color: "#BDC3C7", fontWeight: 400 }}>→</span>
        </div>

        {/* Step 2 */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.4vw solid #1A5276" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF0F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <span style={{ fontSize: "2.2vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#1A5276" }}>2</span>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#1A5276", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            Calcule
          </p>
          <h3 style={{ fontSize: "2.4vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#0F2740", marginBottom: "2vh", lineHeight: 1.2 }}>
            O Algoritmo
          </h3>
          <p style={{ fontSize: "1.9vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.5, textWrap: "pretty" }}>
            Um algoritmo de proximidade compara suas respostas com as posições estimadas de cada candidato por partido.
          </p>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "3vw" }}>
          <span style={{ fontSize: "2.5vw", color: "#BDC3C7", fontWeight: 400 }}>→</span>
        </div>

        {/* Step 3 */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.4vw solid #27AE60" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <span style={{ fontSize: "2.2vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#27AE60" }}>3</span>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            Descubra
          </p>
          <h3 style={{ fontSize: "2.4vw", fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#0F2740", marginBottom: "2vh", lineHeight: 1.2 }}>
            Seus Candidatos
          </h3>
          <p style={{ fontSize: "1.9vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.5, textWrap: "pretty" }}>
            Ranking de candidatos por cargo, ordenados do maior ao menor percentual de alinhamento com você.
          </p>
        </div>
      </div>
    </div>
  );
}
