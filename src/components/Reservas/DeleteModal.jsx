export default function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  reservationToDelete,
  handleDeleteReservation,
}) {
  if (!showDeleteModal || !reservationToDelete) return null

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
      onClick={() => setShowDeleteModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 20,
          maxWidth: 400,
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
            Confirmar Eliminación
          </h3>
          <p style={{ color: "#64748b", lineHeight: 1.5 }}>
            ¿Estás seguro de que quieres eliminar la reserva de <strong>{reservationToDelete.users?.name}</strong>{" "}
            para el <strong>{new Date(reservationToDelete.assigned_date).toLocaleDateString("es-ES")}</strong>?
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setShowDeleteModal(false)}
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
          <button
            onClick={() => handleDeleteReservation(reservationToDelete.id)}
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}