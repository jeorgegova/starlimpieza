export default function TabNavigation({ user, activeTab, setActiveTab, userReservations }) {
  if (!user) return null

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        className="tab-cards-grid"
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
        }}
      >
        <button
          style={{
            flex: "1",
            minWidth: "180px",
            textAlign: "center",
            padding: "0.75rem",
            borderRadius: 10,
            background: activeTab === "calendar" ? "#22c55e" : "#f8fafc",
            border: activeTab === "calendar" ? "2px solid #16a34a" : "1px solid #e5e7eb",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
          }}
          onClick={() => setActiveTab("calendar")}
        >
          <div style={{ fontSize: "1.2rem" }}>📅</div>
          <div
            style={{
              color: activeTab === "calendar" ? "#fff" : "#1f2937",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Hacer Reserva
          </div>
        </button>

        <button
          style={{
            flex: "1",
            minWidth: "180px",
            textAlign: "center",
            padding: "0.75rem",
            borderRadius: 10,
            background: activeTab === "myReservations" ? "#22c55e" : "#f8fafc",
            border: activeTab === "myReservations" ? "2px solid #16a34a" : "1px solid #e5e7eb",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
          }}
          onClick={() => setActiveTab("myReservations")}
        >
          <div style={{ fontSize: "1.2rem" }}>📋</div>
          <div
            style={{
              color: activeTab === "myReservations" ? "#fff" : "#1f2937",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Mis Reservas
          </div>
          {userReservations.length > 0 && (
            <div
              style={{
                background: activeTab === "myReservations" ? "#16a34a" : "#22c55e",
                color: "#fff",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {userReservations.length}
            </div>
          )}
        </button>

        <button
          style={{
            flex: "1",
            minWidth: "180px",
            textAlign: "center",
            padding: "0.75rem",
            borderRadius: 10,
            background: activeTab === "loyalty" ? "#f59e0b" : "#f8fafc",
            border: activeTab === "loyalty" ? "2px solid #d97706" : "1px solid #e5e7eb",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
          }}
          onClick={() => setActiveTab("loyalty")}
        >
          <div style={{ fontSize: "1.2rem" }}>🎁</div>
          <div
            style={{
              color: activeTab === "loyalty" ? "#fff" : "#1f2937",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Bonificaciones
          </div>
        </button>

        {user.role === "admin" && (
          <>
            <button
              style={{
                flex: "1",
                minWidth: "180px",
                textAlign: "center",
                padding: "0.75rem",
                borderRadius: 10,
                background: activeTab === "admin" ? "#f59e0b" : "#f8fafc",
                border: activeTab === "admin" ? "2px solid #d97706" : "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onClick={() => setActiveTab("admin")}
            >
              <div style={{ fontSize: "1.2rem" }}>⚙️</div>
              <div
                style={{
                  color: activeTab === "admin" ? "#fff" : "#1f2937",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Administrar
              </div>
            </button>

            <button
              style={{
                flex: "1",
                minWidth: "180px",
                textAlign: "center",
                padding: "0.75rem",
                borderRadius: 10,
                background: activeTab === "crm" ? "#667eea" : "#f8fafc",
                border: activeTab === "crm" ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onClick={() => setActiveTab("crm")}
            >
              <div style={{ fontSize: "1.2rem" }}>🎯</div>
              <div
                style={{
                  color: activeTab === "crm" ? "#fff" : "#1f2937",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                CRM Clientes
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  )
}