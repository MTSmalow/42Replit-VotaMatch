export default function Impacto() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F4F8FC" }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.6vh", background: "linear-gradient(90deg, #27AE60 0%, #1A5276 100%)" }} />

      {/* Right dark block */}
      <div className="absolute top-0 right-0 bottom-0" style={{ width: "38vw", background: "linear-gradient(160deg, #0F2740 0%, #1A5276 100%)" }} />

      {/* Left content */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-center" style={{ left: "6vw", right: "44vw" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2vh" }}>
          Impacto
        </p>
        <h2 style={{ fontSize: "4.2vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#0F2740", lineHeight: 1.1, textWrap: "balance", marginBottom: "3vh" }}>
          Para todo eleitor
          brasileiro em 2026
        </h2>
        <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.5, textWrap: "pretty" }}>
          Validado nas eleições de São Paulo 2022, expandindo para todo o Brasil com cobertura nacional de candidatos.
        </p>
      </div>

      {/* Right content: audience segments */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-center" style={{ left: "64vw", right: "4vw" }}>

        <div style={{ marginBottom: "4vh", paddingBottom: "4vh", borderBottom: "0.1vw solid rgba(255,255,255,0.15)" }}>
          <div style={{ width: "3.5vw", height: "0.3vw", background: "#27AE60", borderRadius: "99px", marginBottom: "1.5vh" }} />
          <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>
            Eleitores indecisos
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, textWrap: "pretty" }}>
            Que não sabem em quem votar e buscam orientação baseada em valores.
          </p>
        </div>

        <div style={{ marginBottom: "4vh", paddingBottom: "4vh", borderBottom: "0.1vw solid rgba(255,255,255,0.15)" }}>
          <div style={{ width: "3.5vw", height: "0.3vw", background: "#5DADE2", borderRadius: "99px", marginBottom: "1.5vh" }} />
          <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#5DADE2", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>
            Cidadãos por pauta
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, textWrap: "pretty" }}>
            Que priorizam temas específicos e querem candidatos alinhados com eles.
          </p>
        </div>

        <div>
          <div style={{ width: "3.5vw", height: "0.3vw", background: "#27AE60", borderRadius: "99px", marginBottom: "1.5vh" }} />
          <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>
            Primeira vez
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, textWrap: "pretty" }}>
            Jovens votando pela primeira vez, sem referências consolidadas de partido ou candidato.
          </p>
        </div>
      </div>
    </div>
  );
}
