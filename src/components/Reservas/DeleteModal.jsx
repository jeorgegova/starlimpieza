import {
  X,
  Trash2,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react'

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
        background: "rgba(15, 23, 42, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setShowDeleteModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: 0,
          borderRadius: 32,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Header */}
        <div style={{
          background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
          padding: "2.5rem 2rem",
          position: "relative",
          color: "#e11d48",
          textAlign: "center",
          borderBottom: "1px solid #fecdd3"
        }}>
          <button
            onClick={() => setShowDeleteModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(225, 29, 72, 0.05)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#e11d48",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225, 29, 72, 0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(225, 29, 72, 0.05)"}
          >
            <X size={18} />
          </button>

          <div style={{
            width: 64, height: 64, background: "white",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 1.25rem",
            boxShadow: "0 8px 16px rgba(225, 29, 72, 0.1)",
            color: "#e11d48",
            border: "1px solid #fecdd3"
          }}>
            <AlertTriangle size={32} />
          </div>

          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.025em",
              color: "#9f1239"
            }}
          >
            Confirmar Eliminación
          </h3>
        </div>

        <div style={{ padding: "2rem" }}>
          <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.6, margin: "0 0 2rem 0", textAlign: "center" }}>
            ¿Estás seguro de que quieres eliminar permanentemente esta reserva? Esta acción no se puede deshacer.
          </p>

          <div style={{
            background: "#fef2f2",
            padding: "1.25rem",
            borderRadius: 20,
            marginBottom: "2.5rem",
            border: "1px solid #fee2e2"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <User size={18} color="#ef4444" />
              <div style={{ fontWeight: 800, color: "#991b1b" }}>{reservationToDelete.users?.name || "Cliente"}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Calendar size={18} color="#ef4444" />
              <div style={{ fontWeight: 700, color: "#991b1b" }}>
                {new Date(reservationToDelete.assigned_date + 'T12:00:00').toLocaleDateString("es-ES", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setShowDeleteModal(false)}
              style={{
                flex: 1,
                padding: "1rem",
                borderRadius: 16,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteReservation(reservationToDelete.id)}
              style={{
                flex: 1.5,
                padding: "1rem",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Trash2 size={18} /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}