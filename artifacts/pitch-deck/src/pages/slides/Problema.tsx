export default function Problema() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F4F8FC" }}>
      {/* Left color block */}
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "42vw", background: "linear-gradient(160deg, #0F2740 0%, #1A5276 100%)" }} />

      {/* Green accent line */}
      <div className="absolute" style={{ left: "42vw", top: "10vh", bottom: "10vh", width: "0.5vw", background: "#27AE60", borderRadius: "99px" }} />

      {/* Left content */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-center" style={{ left: "5vw", right: "60vw" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2vh" }}>
          O Problema
        </p>
        <h2 style={{ fontSize: "4.5vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textWrap: "balance" }}>
          Muitos candidatos,
          pouco tempo para
          decidir.
        </h2>
      </div>

      {/* Right content */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-center" style={{ left: "47vw", right: "5vw" }}>

        <div style={{ marginBottom: "4.5vh" }}>
          <div style={{ width: "3vw", height: "0.3vw", background: "#1A5276", marginBottom: "1.5vh", borderRadius: "99px" }} />
          <p style={{ fontSize: "2.1vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, textWrap: "pretty" }}>
            Em 2026 o Brasil elege Presidente, Governadores, Senadores e centenas de <strong style={{ fontWeight: 600, color: "#1A5276" }}>Deputados Federais e Estaduais</strong> — simultaneamente.
          </p>
        </div>

        <div style={{ marginBottom: "4.5vh" }}>
          <div style={{ width: "3vw", height: "0.3vw", background: "#1A5276", marginBottom: "1.5vh", borderRadius: "99px" }} />
          <p style={{ fontSize: "2.1vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, textWrap: "pretty" }}>
            Eleitores indecisos precisam comparar plataformas complexas em <strong style={{ fontWeight: 600, color: "#1A5276" }}>poucos dias</strong> — sem ferramentas adequadas.
          </p>
        </div>

        <div>
          <div style={{ width: "3vw", height: "0.3vw", background: "#27AE60", marginBottom: "1.5vh", borderRadius: "99px" }} />
          <p style={{ fontSize: "2.1vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, textWrap: "pretty" }}>
            O resultado: voto por intuição, não por <strong style={{ fontWeight: 600, color: "#27AE60" }}>identificação de valores</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
