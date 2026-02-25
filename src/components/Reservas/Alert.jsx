export default function Alert({ alertMessage, alertType, setAlertMessage }) {
  if (!alertMessage) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 13000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={() => setAlertMessage("")}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes successPulse {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "2.5rem 2rem 2rem",
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          animation: "scaleIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            margin: "0 auto 1.5rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: alertType === "success"
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            animation: alertType === "success" ? "successPulse 0.5s ease-out" : "errorShake 0.4s ease-out",
          }}
        >
          {alertType === "success" ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            margin: "0 0 0.75rem",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#1e293b",
          }}
        >
          {alertType === "success" ? "¡Éxito!" : "¡Error!"}
        </h3>

        {/* Message */}
        <p
          style={{
            margin: "0 0 1.5rem",
            fontSize: "1rem",
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          {alertMessage}
        </p>

        {/* Button */}
        <button
          onClick={() => setAlertMessage("")}
          style={{
            background: alertType === "success"
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "0.875rem 2.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)"
            e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)"
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
