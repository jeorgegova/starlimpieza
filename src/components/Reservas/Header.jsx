import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Sparkles
} from 'lucide-react'

export default function Header() {
  return (
    <>
      {/* Header premium - Light Theme */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          padding: "3rem 2rem",
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
          borderRadius: 32,
          color: "#1e293b",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(59, 130, 246, 0.05)",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#3b82f6",
            border: "1px solid rgba(59, 130, 246, 0.1)"
          }}>
            <Sparkles size={14} color="#f59e0b" /> Profesionalismo en cada servicio
          </div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "#0f172a",
              letterSpacing: "-0.04em",
              lineHeight: 1
            }}
          >
            Sistema de Reservas
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#64748b",
              maxWidth: 550,
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            Gestiona tus citas con facilidad y disfruta de una experiencia de limpieza de primer nivel.
          </p>
        </div>
        {/* Decorative elements - subtle for light theme */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 300, height: 300, background: "rgba(59, 130, 246, 0.03)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 200, height: 200, background: "rgba(59, 130, 246, 0.03)", borderRadius: "50%" }} />
      </div>

      {/* Info cards modernizadas */}
      <div
        className="info-cards-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <InfoCard
          icon={<Calendar size={28} />}
          title="Ver Disponibilidad"
          desc="Consulta fechas y horarios"
          color="#3b82f6"
          bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
        />
        <InfoCard
          icon={<CheckCircle size={28} />}
          title="Hacer Reserva"
          desc="Reserva en pocos segundos"
          color="#22c55e"
          bg="linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
        />
        <InfoCard
          icon={<ClipboardList size={28} />}
          title="Mis Reservas"
          desc="Gestiona tus citas activas"
          color="#f59e0b"
          bg="linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
        />
      </div>
    </>
  )
}

function InfoCard({ icon, title, desc, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        padding: "1.75rem",
        borderRadius: 24,
        border: `1px solid ${color}22`,
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = `0 10px 15px -3px ${color}11`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        background: "white",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ color: "#1e293b", margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: 800 }}>
          {title}
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
          {desc}
        </p>
      </div>
    </div>
  )
}