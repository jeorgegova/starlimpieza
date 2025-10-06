export default function Header() {
  return (
    <>
      {/* Header compacto */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          borderRadius: 16,
          border: "1px solid #e0f2fe",
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: "2rem",
            marginBottom: "0.5rem",
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Sistema de Reservas
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#64748b",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Reserva fácilmente nuestros servicios profesionales
        </p>
      </div>

      {/* Info cards más compactas */}
      <div
        className="info-cards-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            padding: "1rem",
            borderRadius: 12,
            border: "1px solid #3b82f6",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>📅</div>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ color: "#1f2937", margin: "0 0 0.25rem 0", fontSize: "1rem" }}>
              Ver Disponibilidad
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
              Consulta fechas disponibles
            </p>
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
            padding: "1rem",
            borderRadius: 12,
            border: "1px solid #22c55e",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>✅</div>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ color: "#1f2937", margin: "0 0 0.25rem 0", fontSize: "1rem" }}>
              Hacer Reserva
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
              Completa tu reserva fácilmente
            </p>
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "1rem",
            borderRadius: 12,
            border: "1px solid #f59e0b",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>📋</div>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ color: "#1f2937", margin: "0 0 0.25rem 0", fontSize: "1rem" }}>
              Mis Reservas
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
              Gestiona tus reservas
            </p>
          </div>
        </div>
      </div>
    </>
  )
}