export default function Alert({ alertMessage, alertType, setAlertMessage }) {
  if (!alertMessage) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 13000,
        maxWidth: 500,
        width: "90%",
        padding: "1rem 1.5rem",
        borderRadius: 12,
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        border: alertType === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
        backgroundColor: alertType === "success" ? "#f0fdf4" : "#fef2f2",
        color: alertType === "success" ? "#166534" : "#dc2626",
        fontWeight: 600,
        textAlign: "center",
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.2rem" }}>
          {alertType === "success" ? "✅" : "❌"}
        </span>
        <span>{alertMessage}</span>
        <button
          onClick={() => setAlertMessage("")}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "inherit",
            opacity: 0.7,
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}