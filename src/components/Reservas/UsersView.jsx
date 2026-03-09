import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import Alert from './Alert'
import {
    Users,
    Search,
    Edit,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Save,
    X,
    CheckCircle,
    XCircle
} from 'lucide-react'

export default function UsersView({ allUsers, fetchAllUsers, showAlert }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingUserData, setEditingUserData] = useState(null)
    const [editedData, setEditedData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'user',
        state: 'active'
    })
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('success')

    // Filter users based on search
    const filteredUsers = allUsers.filter(user => {
        const searchLower = searchTerm.toLowerCase()
        return (
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower)
        )
    })

    const handleEditClick = (user) => {
        setEditingUserData(user)
        setEditedData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            role: user.role || 'user',
            state: user.state || 'active'
        })
        setShowEditModal(true)
    }

    const handleCancelEdit = () => {
        setShowEditModal(false)
        setEditingUserData(null)
        setEditedData({
            name: '',
            email: '',
            phone: '',
            address: '',
            role: 'user',
            state: 'active'
        })
    }

    const handleSaveEdit = async () => {
        if (!editingUserData) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    name: editedData.name,
                    email: editedData.email,
                    phone: editedData.phone,
                    address: editedData.address,
                    role: editedData.role,
                    state: editedData.state
                })
                .eq('id', editingUserData.id)

            if (error) throw error

            // Refresh users list
            if (fetchAllUsers) {
                fetchAllUsers()
            }

            handleCancelEdit()
            setAlertMessage('Usuario actualizado exitosamente')
            setAlertType('success')
        } catch (error) {
            console.error('Error updating user:', error)
            setAlertMessage('Error al actualizar usuario: ' + error.message)
            setAlertType('error')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId)

            if (error) throw error

            // Refresh users list
            if (fetchAllUsers) {
                fetchAllUsers()
            }

            setAlertMessage('Usuario eliminado exitosamente')
            setAlertType('success')
        } catch (error) {
            console.error('Error deleting user:', error)
            setAlertMessage('Error al eliminar usuario: ' + error.message)
            setAlertType('error')
        } finally {
            setLoading(false)
        }
    }

    const getRoleLabel = (role) => {
        return role === 'admin' ? 'Administrador' : 'Usuario'
    }

    const getRoleColor = (role) => {
        return role === 'admin'
            ? { bg: '#fef3c7', text: '#b45309', icon: '#f59e0b' }
            : { bg: '#dbeafe', text: '#1d4ed8', icon: '#3b82f6' }
    }

    const getStateColor = (state) => {
        return state === 'active'
            ? { bg: '#dcfce7', text: '#166534', icon: '#22c55e' }
            : { bg: '#fee2e2', text: '#991b1b', icon: '#ef4444' }
    }

    const getStateLabel = (state) => {
        return state === 'active' ? 'Activo' : 'Inactivo'
    }

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "4rem" }}>
            {/* Header */}
            <div
                style={{
                    background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                    padding: "2.5rem",
                    borderRadius: 24,
                    marginBottom: "2rem",
                    color: "#1e293b",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.1)",
                    border: "1px solid #7dd3fc"
                }}
            >
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{
                            background: "rgba(14, 165, 233, 0.1)",
                            padding: "0.75rem",
                            borderRadius: 12,
                            color: "#0284c7",
                            border: "1px solid rgba(14, 165, 233, 0.2)"
                        }}>
                            <Users size={28} />
                        </div>
                        <h2
                            style={{
                                fontSize: "2rem",
                                fontWeight: 900,
                                margin: 0,
                                letterSpacing: "-0.025em",
                                color: "#0c4a6e"
                            }}
                        >
                            Gestión de Usuarios
                        </h2>
                    </div>
                    <p style={{ fontSize: "1rem", color: "#475569", maxWidth: 500, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        Administra todos los usuarios del sistema. Edita información personal, permisos y estado.
                    </p>
                </div>
                {/* Decorative background */}
                <div style={{ position: "absolute", right: "-3%", top: "-15%", width: 250, height: 250, background: "rgba(14, 165, 233, 0.05)", borderRadius: "50%", zIndex: 0 }} />
            </div>

            {/* Search Bar */}
            <div
                style={{
                    background: "#fff",
                    padding: "1.5rem",
                    borderRadius: 20,
                    marginBottom: "1.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #f1f5f9",
                }}
            >
                <div style={{ position: "relative" }}>
                    <Search
                        size={20}
                        style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8"
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre, email, usuario o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.875rem 1rem 0.875rem 3rem",
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            fontSize: "0.95rem",
                            outline: "none",
                            transition: "border-color 0.2s",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {filteredUsers.map((user) => {
                    const roleStyle = getRoleColor(user.role)
                    const stateStyle = getStateColor(user.state || 'active')

                    return (
                        <div
                            key={user.id}
                            style={{
                                background: "#fff",
                                padding: "1.5rem",
                                borderRadius: 20,
                                border: "1px solid #f1f5f9",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                                position: "relative"
                            }}
                        >
                            {/* State indicator */}
                            {(user.state === 'inactive') && (
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: "#ef4444",
                                    borderRadius: "20px 20px 0 0"
                                }} />
                            )}

                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: user.role === "admin" ? "#fef3c7" : "#f1f5f9",
                                        color: user.role === "admin" ? "#b45309" : "#64748b",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.25rem",
                                        fontWeight: 800
                                    }}>
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                                            {user.name}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>
                                            @{user.username}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                {/* Role Badge */}
                                <div style={{
                                    background: roleStyle.bg,
                                    color: roleStyle.text,
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: 6,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.2rem"
                                }}>
                                    {user.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                                    {getRoleLabel(user.role)}
                                </div>
                                {/* State Badge */}
                                <div style={{
                                    background: stateStyle.bg,
                                    color: stateStyle.text,
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: 6,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.2rem"
                                }}>
                                    {user.state === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                    {getStateLabel(user.state || 'active')}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div style={{ marginBottom: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Mail size={14} color="#94a3b8" />
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {user.email || 'No registrado'}
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Phone size={14} color="#94a3b8" />
                                    {user.phone || 'No registrado'}
                                </div>
                                {user.address && (
                                    <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <MapPin size={14} color="#94a3b8" />
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {user.address}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
                                <button
                                    onClick={() => handleEditClick(user)}
                                    style={{
                                        flex: 1,
                                        padding: "0.5rem",
                                        borderRadius: 10,
                                        background: "#f0f9ff",
                                        color: "#0284c7",
                                        border: "1px solid #bae6fd",
                                        cursor: "pointer",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.25rem",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#e0f2fe"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#f0f9ff"
                                    }}
                                >
                                    <Edit size={14} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    style={{
                                        flex: 1,
                                        padding: "0.5rem",
                                        borderRadius: 10,
                                        background: "#fef2f2",
                                        color: "#dc2626",
                                        border: "1px solid #fecaca",
                                        cursor: "pointer",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.25rem",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#fee2e2"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#fef2f2"
                                    }}
                                >
                                    <Trash2 size={14} /> Eliminar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "#64748b"
                }}>
                    <Users size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                    <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No se encontraron usuarios</p>
                    <p style={{ fontSize: "0.9rem" }}>Intenta con otros términos de búsqueda</p>
                </div>
            )}

            {/* Stats Footer */}
            <div style={{
                marginTop: "2rem",
                padding: "1rem 1.5rem",
                background: "#f8fafc",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.9rem",
                color: "#64748b",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                <span>Total: <strong style={{ color: "#1e293b" }}>{filteredUsers.length}</strong></span>
                <span>Administradores: <strong style={{ color: "#b45309" }}>{filteredUsers.filter(u => u.role === 'admin').length}</strong></span>
                <span>Usuarios: <strong style={{ color: "#1d4ed8" }}>{filteredUsers.filter(u => u.role === 'user').length}</strong></span>
                <span>Activos: <strong style={{ color: "#166534" }}>{filteredUsers.filter(u => u.state === 'active').length}</strong></span>
                <span>Inactivos: <strong style={{ color: "#991b1b" }}>{filteredUsers.filter(u => u.state === 'inactive').length}</strong></span>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: 24,
                        padding: "2rem",
                        width: "100%",
                        maxWidth: "500px",
                        maxHeight: "90vh",
                        overflow: "auto",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}>
                        {/* Modal Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#1e293b" }}>
                                Editar Usuario
                            </h3>
                            <button
                                onClick={handleCancelEdit}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "0.5rem",
                                    color: "#64748b"
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Name */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={editedData.name}
                                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: 10,
                                        border: "1px solid #e2e8f0",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editedData.email}
                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: 10,
                                        border: "1px solid #e2e8f0",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={editedData.phone}
                                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: 10,
                                        border: "1px solid #e2e8f0",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={editedData.address}
                                    onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: 10,
                                        border: "1px solid #e2e8f0",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                    Rol
                                </label>
                                <select
                                    value={editedData.role}
                                    onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: 10,
                                        border: "1px solid #e2e8f0",
                                        fontSize: "0.95rem",
                                        boxSizing: "border-box",
                                        background: "white"
                                    }}
                                >
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {/* State */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>
                                    Estado de la cuenta
                                </label>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0.75rem 1rem",
                                    borderRadius: 10,
                                    border: "1px solid #e2e8f0",
                                    background: editedData.state === 'active' ? "#f0fdf4" : "#fef2f2"
                                }}>
                                    <span style={{
                                        fontWeight: 600,
                                        color: editedData.state === 'active' ? "#166534" : "#991b1b"
                                    }}>
                                        {editedData.state === 'active' ? '✅ Cuenta Activa' : '❌ Cuenta Inactiva'}
                                    </span>
                                    {/* Toggle Switch (macOS style) */}
                                    <label style={{ position: "relative", width: "50px", height: "28px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={editedData.state === 'active'}
                                            onChange={(e) => setEditedData({ ...editedData, state: e.target.checked ? 'active' : 'inactive' })}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: editedData.state === 'active' ? "#22c55e" : "#cbd5e1",
                                            borderRadius: "28px",
                                            transition: "0.3s",
                                            boxShadow: editedData.state === 'active'
                                                ? "0 2px 4px rgba(34, 197, 94, 0.3)"
                                                : "0 2px 4px rgba(0, 0, 0, 0.1)"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                top: "3px",
                                                left: editedData.state === 'active' ? "25px" : "3px",
                                                width: "22px",
                                                height: "22px",
                                                backgroundColor: "white",
                                                borderRadius: "50%",
                                                transition: "0.3s",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                                            }} />
                                        </div>
                                    </label>
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
                                    {editedData.state === 'active'
                                        ? 'El usuario puede iniciar sesión normalmente'
                                        : '⚠️ El usuario no podrá iniciar sesión'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                            <button
                                onClick={handleCancelEdit}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "0.875rem",
                                    borderRadius: 12,
                                    background: "#f1f5f9",
                                    color: "#64748b",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontSize: "0.95rem",
                                    fontWeight: 600
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "0.875rem",
                                    borderRadius: 12,
                                    background: "#0ea5e9",
                                    color: "white",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Component */}
            <Alert alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
        </div>
    )
}
