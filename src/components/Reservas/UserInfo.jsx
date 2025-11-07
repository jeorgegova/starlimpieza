export default function UserInfo({ user, handleLogout }) {
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const firstLetter = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <div
      style={{
        background: isAdmin
          ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
          : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        padding: "1rem 1.5rem",
        borderRadius: 14,
        marginBottom: "1.5rem",
        border: isAdmin ? "1px solid #fb923c" : "1px solid #3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Izquierda: Avatar + Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Avatar circular */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isAdmin ? "#f59e0b" : "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {firstLetter}
        </div>

        {/* Texto del usuario */}
        <div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {isAdmin ? "👑 Administrador:" : "✅ Sesión iniciada:"}{" "}
            <strong>{user.name || user.email}</strong>
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: isAdmin ? "#92400e" : "#2563eb",
              marginTop: "0.15rem",
            }}
          >
            {isAdmin ? "Acceso total al panel de gestión" : user.email}
          </div>
        </div>
      </div>

      {/* Botón salir */}
      <button
        onClick={handleLogout}
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#dc2626",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8,
          padding: "0.45rem 0.9rem",
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.background = "rgba(239,68,68,0.2)")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(239,68,68,0.1)")}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
