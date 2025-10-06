export default function AuthModal({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  loginError,
  regUsername,
  setRegUsername,
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
          minWidth: 400,
          maxWidth: 500,
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
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                👤 Iniciar Sesión
              </h3>
              <p style={{ color: "#64748b" }}>Accede a tu cuenta para gestionar tus reservas</p>
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: 12,
                  marginBottom: "1rem",
                  border: "1px solid #fecaca",
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
                  }}
                >
                  Usuario
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  required
                  placeholder="Ingresa tu usuario"
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
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  required
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 12,
                  fontSize: "1.1rem",
                  padding: "1rem",
                  width: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
                }}
              >
                🚀 Iniciar Sesión
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
              <span style={{ color: "#64748b" }}>¿No tienes cuenta? </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
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
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                ✨ Crear Cuenta
              </h3>
              <p style={{ color: "#64748b" }}>Únete para gestionar tus reservas fácilmente</p>
            </div>

            {regError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: 12,
                  marginBottom: "1rem",
                  border: "1px solid #fecaca",
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
                  marginBottom: "1rem",
                  border: "1px solid #bbf7d0",
                }}
              >
                ✅ {regSuccess}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Usuario *
                  </label>
                  <input
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 12,
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                    }}
                    required
                    placeholder="usuario123"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: "0.5rem",
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
                      padding: "0.75rem",
                      borderRadius: 12,
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                    }}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Nombre completo *
                </label>
                <input
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                  }}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Teléfono
                  </label>
                  <input
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 12,
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                    }}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: 12,
                      border: "2px solid #e5e7eb",
                      fontSize: "1rem",
                    }}
                    placeholder="juan@email.com"
                  />
                </div>
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
                  Dirección
                </label>
                <input
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                  }}
                  placeholder="Calle 123, Ciudad"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 12,
                  fontSize: "1.1rem",
                  padding: "1rem",
                  width: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
                }}
              >
                🎉 Crear Cuenta
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
              <span style={{ color: "#64748b" }}>¿Ya tienes cuenta? </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
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