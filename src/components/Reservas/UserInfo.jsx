export default function UserInfo({ user, handleLogout }) {
  if (!user) return null

  return (
    <div
      style={{
        background:
          user.role === "admin"
            ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
            : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        padding: "1rem 1.5rem",
        borderRadius: 12,
        marginBottom: "1.5rem",
        border: user.role === "admin" ? "1px solid #f59e0b" : "1px solid #3b82f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span
          style={{
            fontSize: "1rem",
            color: "#1f2937",
            fontWeight: 600,
          }}
        >
          {user.role === "admin" ? "👑 Admin:" : "👋"} <strong>{user.name}</strong>
        </span>
        {user.role === "admin" && (
          <div style={{ fontSize: "0.8rem", color: "#92400e", marginTop: "0.25rem" }}>
            Gestión completa de reservas
          </div>
        )}
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#dc2626",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8,
          padding: "0.4rem 0.8rem",
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        Salir
      </button>
    </div>
  )
}