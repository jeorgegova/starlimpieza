import { LogOut, User, Shield, ExternalLink } from 'lucide-react'

export default function UserInfo({ user, handleLogout }) {
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const firstLetter = user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "U");

  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: 24,
        marginBottom: "2rem",
        border: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        flexWrap: "wrap",
        gap: "1rem"
      }}
    >
      {/* User Information */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Modern Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: isAdmin ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: "1.25rem",
            boxShadow: isAdmin ? "0 4px 12px rgba(245,158,11,0.3)" : "0 4px 12px rgba(59,130,246,0.3)",
          }}
        >
          {firstLetter}
        </div>

        <div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {user.name || user.email.split('@')[0]}
            {isAdmin && (
              <span style={{
                background: "#fef3c7",
                color: "#92400e",
                fontSize: "0.65rem",
                padding: "2px 8px",
                borderRadius: "50px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 900,
                border: "1px solid #fde68a"
              }}>
                Admin
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            {isAdmin ? <Shield size={12} /> : <User size={12} />}
            {isAdmin ? "Panel de Gestión Administrativa" : user.email}
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        style={{
          background: "#fff",
          color: "#ef4444",
          border: "1.5px solid #fee2e2",
          borderRadius: 14,
          padding: "0.6rem 1.2rem",
          fontSize: "0.9rem",
          fontWeight: 800,
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fef2f2"
          e.currentTarget.style.borderColor = "#fecaca"
          e.currentTarget.style.transform = "translateX(4px)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff"
          e.currentTarget.style.borderColor = "#fee2e2"
          e.currentTarget.style.transform = "translateX(0)"
        }}
      >
        Cerrar sesión <LogOut size={16} />
      </button>
    </div>
  );
}
