import {
  Calendar,
  ClipboardList,
  Gift,
  Settings,
  Users
} from 'lucide-react'

export default function TabNavigation({ user, activeTab, setActiveTab, userReservations }) {
  if (!user) return null

  const tabs = [
    {
      id: "calendar",
      label: "Hacer Reserva",
      icon: <Calendar size={20} />,
      color: "#22c55e",
      bg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
    },
    {
      id: "myReservations",
      label: "Mis Reservas",
      icon: <ClipboardList size={20} />,
      color: "#3b82f6",
      bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      count: userReservations.length
    },
    {
      id: "loyalty",
      label: "Bonificaciones",
      icon: <Gift size={20} />,
      color: "#f59e0b",
      bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    },
  ]

  if (user.role === "admin") {
    tabs.push(
      {
        id: "admin",
        label: "Administrar",
        icon: <Settings size={20} />,
        color: "#6366f1",
        bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
      },
      {
        id: "crm",
        label: "CRM Clientes",
        icon: <Users size={20} />,
        color: "#8b5cf6",
        bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      }
    )
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        className="tab-cards-grid"
        style={{
          display: "flex",
          gap: "0.75rem",
          padding: "0.25rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: "1",
              minWidth: "160px",
              padding: "1rem 0.75rem",
              borderRadius: 20,
              background: activeTab === tab.id ? tab.bg : "#fff",
              border: activeTab === tab.id ? "none" : "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: activeTab === tab.id ? `0 10px 15px -3px ${tab.color}44` : "0 2px 4px rgba(0,0,0,0.02)",
              position: "relative",
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = tab.color
                e.currentTarget.style.transform = "translateY(-2px)"
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = "#e2e8f0"
                e.currentTarget.style.transform = "translateY(0)"
              }
            }}
          >
            <div style={{
              color: activeTab === tab.id ? "white" : tab.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s"
            }}>
              {tab.icon}
            </div>

            <div
              style={{
                color: activeTab === tab.id ? "#fff" : "#475569",
                fontSize: "0.85rem",
                fontWeight: 700,
                transition: "all 0.3s"
              }}
            >
              {tab.label}
            </div>

            {tab.count > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: activeTab === tab.id ? "#fff" : tab.color,
                  color: activeTab === tab.id ? tab.color : "#fff",
                  borderRadius: "50%",
                  minWidth: "22px",
                  height: "22px",
                  padding: "0 4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  border: `2px solid ${activeTab === tab.id ? tab.color : "#fff"}`
                }}
              >
                {tab.count}
              </div>
            )}

            {activeTab === tab.id && (
              <div style={{
                position: "absolute",
                bottom: 8,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.5)"
              }} />
            )}
          </button>
        ))}
      </div>
      <style>{`
        .tab-cards-grid::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}