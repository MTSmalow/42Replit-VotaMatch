export default function Funcionalidades() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F4F8FC" }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.6vh", background: "linear-gradient(90deg, #1A5276 0%, #27AE60 100%)" }} />

      {/* Left strip with label */}
      <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-center" style={{ width: "4vw", background: "linear-gradient(180deg, #0F2740 0%, #1A5276 100%)" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "rgba(255,255,255,0.5)", writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center" }}>
          Funcionalidades
        </p>
      </div>

      {/* Content */}
      <div className="absolute" style={{ top: "8vh", bottom: "8vh", left: "7vw", right: "5vw" }}>
        <h2 style={{ fontSize: "4vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#0F2740", lineHeight: 1.1, marginBottom: "4vh", textWrap: "balance" }}>
          Tudo para decidir
          com consciência.
        </h2>

        {/* Feature grid: 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "2.5vh 3vw", height: "54vh" }}>

          {/* Feature 1 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "2vw", borderLeft: "0.35vw solid #27AE60" }}>
            <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1vh" }}>
              Match por candidato
            </p>
            <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.45, textWrap: "pretty" }}>
              Percentual de alinhamento calculado individualmente para cada candidato na disputa.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "2vw", borderLeft: "0.35vw solid #1A5276" }}>
            <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#1A5276", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1vh" }}>
              Comparação por cargo
            </p>
            <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.45, textWrap: "pretty" }}>
              Resultados separados por Presidente, Governador, Senador e Deputados — Federal e Estadual.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "2vw", borderLeft: "0.35vw solid #1A5276" }}>
            <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#1A5276", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1vh" }}>
              Cola de Votação
            </p>
            <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.45, textWrap: "pretty" }}>
              Resumo compacto dos seus candidatos mais alinhados para levar na hora de votar.
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "2vw", borderLeft: "0.35vw solid #27AE60" }}>
            <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1vh" }}>
              Quiz em 5 temas
            </p>
            <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.45, textWrap: "pretty" }}>
              Economia, renda, meio ambiente, segurança e democracia — temas que moldam a eleição.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
