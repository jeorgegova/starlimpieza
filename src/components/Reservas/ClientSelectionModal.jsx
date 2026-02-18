import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Users,
  AtSign
} from 'lucide-react'

export default function ClientSelectionModal({
  showClientSelectionModal,
  setShowClientSelectionModal,
  users,
  onClientSelect,
}) {
  if (!showClientSelectionModal) return null

  const registeredClients = users.filter(user => user.role === "user")

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setShowClientSelectionModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: 0,
          borderRadius: 32,
          maxWidth: 520,
          width: "100%",
          maxHeight: "85vh",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
          padding: "2.5rem 2rem",
          position: "relative",
          color: "white"
        }}>
          <button
            onClick={() => setShowClientSelectionModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <X size={20} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: 0.9, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            <Users size={16} /> Admin Panel
          </div>
          <h3
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.025em"
            }}
          >
            Seleccionar Cliente
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", marginTop: "0.5rem", fontWeight: 500 }}>
            Elige el perfil para la nueva reserva
          </p>
        </div>

        {/* List Section */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {registeredClients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#f8fafc", borderRadius: 24, border: "2px dashed #e2e8f0" }}>
              <Users size={48} color="#94a3b8" style={{ margin: "0 auto 1.5rem" }} />
              <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 600 }}>No hay clientes registrados en el sistema</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {registeredClients.map((client) => (
                <div
                  key={client.id}
                  style={{
                    padding: "1.25rem",
                    background: "#fff",
                    border: "1.5px solid #f1f5f9",
                    borderRadius: 20,
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#eff6ff"
                    e.currentTarget.style.borderColor = "#bfdbfe"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff"
                    e.currentTarget.style.borderColor = "#f1f5f9"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                  onClick={() => {
                    onClientSelect(client)
                    setShowClientSelectionModal(false)
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#8b5cf6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800 }}>
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "1.05rem" }}>{client.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6366f1", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <AtSign size={12} /> {client.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                      <Mail size={14} /> {client.email}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                      <Phone size={14} /> {client.phone}
                    </div>
                  </div>

                  {client.address && (
                    <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500, paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
                      <MapPin size={14} /> {client.address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={() => setShowClientSelectionModal(false)}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: 14,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  )
}