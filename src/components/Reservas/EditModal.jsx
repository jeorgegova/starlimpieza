import { servicesOptions } from './constants'

export default function EditModal({
  showEditModal,
  setShowEditModal,
  reservationToEdit,
  editDate,
  setEditDate,
  editService,
  setEditService,
  handleEditReservation,
}) {
  if (!showEditModal || !reservationToEdit) return null

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
      onClick={() => setShowEditModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 20,
          maxWidth: 500,
          width: "90%",
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
            Editar Reserva
          </h3>
          <p style={{ color: "#64748b", lineHeight: 1.5 }}>
            Editando reserva de <strong>{reservationToEdit.users?.name}</strong>
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Fecha
          </label>
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Servicio
          </label>
          <select
            value={editService}
            onChange={(e) => setEditService(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              fontSize: "1rem",
            }}
          >
            {servicesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="reservation-modal-buttons"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setShowEditModal(false)}
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
            onClick={handleEditReservation}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
            }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}