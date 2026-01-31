export default function ClientSelectionModal({
  showClientSelectionModal,
  setShowClientSelectionModal,
  users,
  onClientSelect,
}) {
  if (!showClientSelectionModal) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        backdropFilter: "blur(4px)",
      }}
      onClick={() => setShowClientSelectionModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 20,
          maxWidth: 500,
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            👤 Seleccionar Cliente
          </h3>
          <p style={{ color: "#64748b" }}>Elige el cliente para la nueva reserva</p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          {users.filter(user => user.role === "user").length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              No hay clientes registrados
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {users.filter(user => user.role === "user").map((client) => (
                <div
                  key={client.id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: "#f8fafc",
                  }}
                  onClick={() => {
                    onClientSelect(client)
                    setShowClientSelectionModal(false)
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#e2e8f0"
                    e.target.style.borderColor = "#3b82f6"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#f8fafc"
                    e.target.style.borderColor = "#e2e8f0"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#1f2937" }}>
                    {client.name}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    @{client.username} • {client.email} • {client.phone}
                  </div>
                  {client.address && (
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem" }}>
                      📍 {client.address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowClientSelectionModal(false)}
            style={{
              background: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}