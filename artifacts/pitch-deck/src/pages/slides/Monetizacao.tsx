export default function Monetizacao() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#F4F8FC" }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.6vh", background: "linear-gradient(90deg, #27AE60 0%, #1A5276 100%)" }} />

      {/* Header */}
      <div className="absolute text-left" style={{ top: "8vh", left: "6vw", right: "6vw" }}>
        <p style={{ fontSize: "1.4vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.2vh" }}>
          Monetização
        </p>
        <h2 style={{ fontSize: "4vw", fontFamily: "Raleway, sans-serif", fontWeight: 900, color: "#0F2740", lineHeight: 1.1, textWrap: "balance" }}>
          Três fontes de receita,
          sem vender dados.
        </h2>
      </div>

      {/* Three columns */}
      <div className="absolute flex" style={{ top: "32vh", bottom: "8vh", left: "5vw", right: "5vw", gap: "2.5vw", alignItems: "stretch" }}>

        {/* Column 1 — B2B Licenciamento */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.45vw solid #1A5276" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF0F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#1A5276" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#1A5276", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            Licenciamento B2B
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, marginBottom: "2vh", textWrap: "pretty" }}>
            Veículos de mídia e institutos de pesquisa integram o quiz em suas plataformas editoriais.
          </p>
          <p style={{ fontSize: "1.8vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.4, textWrap: "pretty" }}>
            Jornais, portais e apps de notícia como conteúdo interativo para a cobertura eleitoral.
          </p>
        </div>

        {/* Column 2 — Dados Agregados */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.45vw solid #27AE60" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="#27AE60" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="#27AE60" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="#27AE60" strokeWidth="2"/>
              <path d="M17.5 14v6M14.5 17h6" stroke="#27AE60" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#27AE60", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            Dados Agregados
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, marginBottom: "2vh", textWrap: "pretty" }}>
            Relatórios anônimos sobre posicionamento do eleitorado por região, faixa etária e tema.
          </p>
          <p style={{ fontSize: "1.8vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.4, textWrap: "pretty" }}>
            Sem dados pessoais. Clientes: partidos, campanhas e consultorias políticas.
          </p>
        </div>

        {/* Column 3 — White-label */}
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "1.5vw", padding: "3vw", display: "flex", flexDirection: "column", boxShadow: "0 0.4vw 1.5vw rgba(26,82,118,0.08)", borderTop: "0.45vw solid #1A5276" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "#EAF0F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5vh" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#1A5276" strokeWidth="2"/>
              <path d="M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18M3 12h18" stroke="#1A5276" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: "1.5vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 600, color: "#1A5276", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5vh" }}>
            White-label / Expansão
          </p>
          <p style={{ fontSize: "2vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#0D1B2A", lineHeight: 1.5, marginBottom: "2vh", textWrap: "pretty" }}>
            Plataforma licenciada para outros estados e países com adaptação local de candidatos e temas.
          </p>
          <p style={{ fontSize: "1.8vw", fontFamily: "Source Sans 3, sans-serif", fontWeight: 400, color: "#5D6D7E", lineHeight: 1.4, textWrap: "pretty" }}>
            Modelo validado em São Paulo, replicável para qualquer eleição no Brasil ou no exterior.
          </p>
        </div>
      </div>
    </div>
  );
}
