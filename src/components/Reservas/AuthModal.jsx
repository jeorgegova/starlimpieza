"use client"

import React from 'react'
import { supabase } from '../../supabaseClient'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  UserPlus,
  LogIn,
  KeyRound
} from 'lucide-react'
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
  const [resetEmail, setResetEmail] = React.useState("")
  const [resetLoading, setResetLoading] = React.useState(false)
  const [resetError, setResetError] = React.useState("")
  const [resetSuccess, setResetSuccess] = React.useState("")

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError("")
    setResetSuccess("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setResetSuccess("Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.")
    } catch (error) {
      setResetError(error.message || "Error al enviar el correo de recuperación.")
    } finally {
      setResetLoading(false)
    }
  }

  if (!showAuthModal) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        padding: "1rem",
        backdropFilter: "blur(6px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      onClick={() => setShowAuthModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "3rem 2.5rem",
          borderRadius: 32,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "#f8fafc",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#f1f5f9"
            e.currentTarget.style.color = "#1e293b"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#f8fafc"
            e.currentTarget.style.color = "#64748b"
          }}
        >
          <X size={20} />
        </button>

        {authMode === "forgotPassword" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                width: 64,
                height: 64,
                background: "#f0f9ff",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#0ea5e9"
              }}>
                <KeyRound size={32} />
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.025em"
                }}
              >
                Recuperar Contraseña
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
                Te enviaremos un enlace de recuperación a tu correo electrónico.
              </p>
            </div>

            {resetError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem 1.25rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #fee2e2",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 500
                }}
              >
                <AlertCircle size={18} />
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "1rem 1.25rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #dcfce7",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 500
                }}
              >
                <CheckCircle size={18} />
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Correo Electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0ea5e9"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    placeholder="ejemplo@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading || resetSuccess}
                style={{
                  background: (resetLoading || resetSuccess)
                    ? "#e2e8f0"
                    : "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  color: (resetLoading || resetSuccess) ? "#94a3b8" : "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 18,
                  fontSize: "1.1rem",
                  padding: "1.1rem",
                  width: "100%",
                  cursor: (resetLoading || resetSuccess) ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: (resetLoading || resetSuccess) ? "none" : "0 10px 15px -3px rgba(14, 165, 233, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (!resetLoading && !resetSuccess) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(14, 165, 233, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!resetLoading && !resetSuccess) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(14, 165, 233, 0.3)"
                  }
                }}
              >
                {resetLoading ? (
                  <>
                    <Loader2 size={24} className="spin" />
                    Enviando enlace...
                  </>
                ) : resetSuccess ? (
                  "Enlace Enviado"
                ) : (
                  "Enviar Enlace de Recuperación"
                )}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  margin: "0 auto",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#1e293b"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                onClick={() => {
                  setAuthMode("login")
                  setResetError("")
                  setResetSuccess("")
                }}
              >
                <ArrowLeft size={18} /> Volver al inicio de sesión
              </button>
            </div>
          </>
        ) : authMode === "login" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                width: 64,
                height: 64,
                background: "#f0fdf4",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#22c55e"
              }}>
                <LogIn size={32} />
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.025em"
                }}
              >
                Bienvenido
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
                Inicia sesión para gestionar tus servicios y reservas.
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem 1.25rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #fee2e2",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 500
                }}
              >
                <AlertCircle size={18} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Correo Electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div style={{ textAlign: "right", marginBottom: "2rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgotPassword")
                    clearAuthFields()
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textDecoration: "none"
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3b82f6"}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  background: loginLoading ? "#e2e8f0" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: loginLoading ? "#94a3b8" : "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 18,
                  fontSize: "1.1rem",
                  padding: "1.1rem",
                  width: "100%",
                  cursor: loginLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: loginLoading ? "none" : "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (!loginLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(34, 197, 94, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loginLoading) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(34, 197, 94, 0.3)"
                  }
                }}
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={24} className="spin" />
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
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "0.5rem" }}>
                ¿Aún no tienes una cuenta?
              </p>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.color = "#3b82f6"}
                onClick={() => {
                  setAuthMode("register")
                  clearAuthFields()
                }}
              >
                Crear una cuenta ahora
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                width: 64,
                height: 64,
                background: "#eff6ff",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#3b82f6"
              }}>
                <UserPlus size={32} />
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.025em"
                }}
              >
                Crear Cuenta
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
                Únete para gestionar tus reservas fácilmente.
              </p>
            </div>

            {regError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem 1.25rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #fee2e2",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 500
                }}
              >
                <AlertCircle size={18} />
                {regError}
              </div>
            )}

            {regSuccess && (
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "1rem 1.25rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #dcfce7",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 500
                }}
              >
                <CheckCircle size={18} />
                {regSuccess}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Correo Electrónico *
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Contraseña *
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Nombre Completo *
                </label>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Teléfono
                </label>
                <PhoneInput
                  country={'es'}
                  value={regPhone}
                  onChange={phone => setRegPhone('+' + phone)}
                  inputStyle={{
                    width: "100%",
                    padding: "1rem 1rem 1rem 3.5rem",
                    height: "auto",
                    borderRadius: 16,
                    border: "2px solid #f1f5f9",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    background: "#f8fafc"
                  }}
                  buttonStyle={{
                    borderRadius: "16px 0 0 16px",
                    border: "2px solid #f1f5f9",
                    borderRight: "none",
                    background: "#f8fafc",
                    paddingLeft: "0.5rem"
                  }}
                  containerStyle={{
                    width: "100%"
                  }}
                  placeholder="+1234567890"
                />
              </div>

              <div style={{ marginBottom: "2.5rem" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#475569",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Dirección
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      borderRadius: 16,
                      border: "2px solid #f1f5f9",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.background = "#fff"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f1f5f9"
                      e.target.style.background = "#f8fafc"
                    }}
                    placeholder="Calle 123, Ciudad"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                style={{
                  background: regLoading ? "#e2e8f0" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: regLoading ? "#94a3b8" : "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 18,
                  fontSize: "1.1rem",
                  padding: "1.1rem",
                  width: "100%",
                  cursor: regLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: regLoading ? "none" : "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (!regLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(59, 130, 246, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!regLoading) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
                  }
                }}
              >
                {regLoading ? (
                  <>
                    <Loader2 size={24} className="spin" />
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
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "0.5rem" }}>
                ¿Ya tienes una cuenta?
              </p>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.color = "#3b82f6"}
                onClick={() => {
                  setAuthMode("login")
                  clearAuthFields()
                }}
              >
                Inicia sesión aquí
              </button>
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </div>
  )
}
