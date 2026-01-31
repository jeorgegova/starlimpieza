"use client"

export default function AuthModal({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  loginError,
  loginLoading,
  regPassword,
  setRegPassword,
  regName,
  setRegName,
  regPhone,
  setRegPhone,
  regEmail,
  setRegEmail,
  regAddress,
  setRegAddress,
  handleRegister,
  regError,
  regSuccess,
  regLoading,
  clearAuthFields,
}) {
  if (!showAuthModal) return null

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
      onClick={() => setShowAuthModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "2.5rem",
          borderRadius: 24,
          minWidth: 420,
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
          position: "relative",
          border: "1px solid #e5e7eb",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {authMode === "login" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                👤 Iniciar Sesión
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Accede a tu cuenta para gestionar tus reservas</p>
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: 12,
                  marginBottom: "1.5rem",
                  border: "1px solid #fecaca",
                  fontSize: "0.9rem",
                }}
              >
                ❌ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e"
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e"
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  background: loginLoading ? "#9ca3af" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 12,
                  fontSize: "1.1rem",
                  padding: "1rem",
                  width: "100%",
                  cursor: loginLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: loginLoading ? "none" : "0 8px 24px rgba(34,197,94,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (!loginLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(34,197,94,0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loginLoading) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,197,94,0.3)"
                  }
                }}
              >
                {loginLoading ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "0.95rem" }}>¿No tienes cuenta? </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.95rem",
                }}
                onClick={() => {
                  setAuthMode("register")
                  clearAuthFields()
                }}
              >
                Crear una cuenta
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Crear Cuenta
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Únete para gestionar tus reservas fácilmente</p>
            </div>

            {regError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: 12,
                  marginBottom: "1.5rem",
                  border: "1px solid #fecaca",
                  fontSize: "0.9rem",
                }}
              >
                ❌ {regError}
              </div>
            )}

            {regSuccess && (
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "1rem",
                  borderRadius: 12,
                  marginBottom: "1.5rem",
                  border: "1px solid #bbf7d0",
                  fontSize: "0.9rem",
                }}
              >
                ✅ {regSuccess}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    marginTop: "0.375rem",
                    marginLeft: "0.25rem",
                  }}
                >
                  Mínimo 6 caracteres
                </p>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Nombre Completo *
                </label>
                <input
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Teléfono
                </label>
                <input
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="+1234567890"
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Dirección
                </label>
                <input
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Calle 123, Ciudad"
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                style={{
                  background: regLoading ? "#9ca3af" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 12,
                  fontSize: "1.1rem",
                  padding: "1rem",
                  width: "100%",
                  cursor: regLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: regLoading ? "none" : "0 8px 24px rgba(59,130,246,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (!regLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!regLoading) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.3)"
                  }
                }}
              >
                {regLoading ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "0.95rem" }}>¿Ya tienes cuenta? </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.95rem",
                }}
                onClick={() => {
                  setAuthMode("login")
                  clearAuthFields()
                }}
              >
                Iniciar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
