import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Localizador para el calendario
const localizer = momentLocalizer(moment);

// Opciones de servicios
const servicesOptions = [
    "Limpieza residencial",
    "Turismo & Airbnb",
    "Servicios Forestales",
    "Cristales Premium",
    "Gestión de Terrenos"
];

// Estilos CSS para personalizar el calendario
const calendarStyles = `
  .rbc-calendar {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 1rem;
  }
  .rbc-day-bg:hover {
    background-color: rgba(99,102,241,0.1) !important;
    border: 2px solid #6366f1 !important;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .rbc-event.reserved {
    background-color: #ef4444 !important;
    border: none !important;
    color: white !important;
    border-radius: 8px;
    padding: 4px;
    font-size: 0.9rem;
    cursor: not-allowed;
  }
  .rbc-selected {
    background-color: #4f46e5 !important;
    border: 2px solid #312e81 !important;
  }
  .rbc-today {
    background-color: rgba(99,102,241,0.05) !important;
  }
  .rbc-toolbar {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  .rbc-btn-group button {
    border-radius: 8px !important;
    padding: 0.5rem 1rem !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
    border: 1px solid #e5e7eb !important;
    margin: 0 0.25rem !important;
  }
  .rbc-btn-group button:hover {
    background-color: #6366f1 !important;
    color: white !important;
    border-color: #6366f1 !important;
  }
  .rbc-toolbar-label {
    font-weight: 600;
    color: #111827;
  }
`;

export default function Reserva() {
    const [service, setService] = useState(servicesOptions[0]);
    const [reservedEvents, setReservedEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allReservations, setAllReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regAddress, setRegAddress] = useState('');
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');
    const [calDate, setCalDate] = useState(new Date());
    const [calView, setCalView] = useState('month');

    useEffect(() => {
        fetchAllReservations();
        setSelectedDate(null);
    }, [service]);

    useEffect(() => {
        setEvents([...reservedEvents]);
    }, [reservedEvents]);

    async function fetchAllReservations() {
        setLoading(true);
        const { data, error } = await supabase
            .from('user_services')
            .select('*, users(name)')
            .eq('service_name', service);

        if (error) {
            console.error(error);
            setAllReservations([]);
            setReservedEvents([]);
        } else {
            setAllReservations(data);
            const mappedReserved = data.map(r => ({
                title: 'Reservado',
                start: new Date(r.assigned_date),
                end: new Date(r.assigned_date),
                allDay: true,
                resource: 'reserved'
            }));
            setReservedEvents(mappedReserved);
        }
        setLoading(false);
    }

    function handleSelectSlot({ start }) {
        // Convertir la fecha seleccionada a un objeto Date sin la hora
        const selected = new Date(start.setHours(0, 0, 0, 0));

        // Verificar si la fecha ya está reservada
        const isReserved = reservedEvents.some(ev => {
            const evStart = new Date(ev.start.setHours(0, 0, 0, 0));
            return evStart.getTime() === selected.getTime();
        });

        if (isReserved) {
            alert('Esta fecha ya está reservada.');
            return;
        }

        if (!user) {
            setShowAuthModal(true);
        }
        setSelectedDate(start);
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoginError('');
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .limit(1);

        if (error) {
            setLoginError('Error en la conexión');
            return;
        }
        if (data.length === 1) {
            setUser(data[0]);
            clearAuthFields();
            setShowAuthModal(false);
        } else {
            setLoginError('Usuario o contraseña incorrectos');
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');

        if (!regUsername || !regPassword || !regName) {
            setRegError('Por favor llena todos los campos requeridos');
            return;
        }

        let { data: existingUser, error } = await supabase
            .from('users')
            .select('id')
            .eq('username', regUsername)
            .limit(1);

        if (error) {
            setRegError('Error en la conexión');
            return;
        }
        if (existingUser.length > 0) {
            setRegError('El nombre de usuario ya está en uso');
            return;
        }

        const { data, error: insertError } = await supabase
            .from('users')
            .insert([{
                username: regUsername,
                password: regPassword,
                name: regName,
                phone: regPhone,
                email: regEmail,
                address: regAddress
            }]);
        if (insertError) {
            setRegError('Error al crear usuario: ' + insertError.message);
            return;
        }
        setRegSuccess('Usuario creado correctamente, ahora inicia sesión');
        clearAuthFields();
        setAuthMode('login');
    }

    function clearAuthFields() {
        setUsername('');
        setPassword('');
        setRegUsername('');
        setRegPassword('');
        setRegName('');
        setRegPhone('');
        setRegEmail('');
        setRegAddress('');
        setLoginError('');
        setRegError('');
        setRegSuccess('');
    }

    function handleLogout() {
        setUser(null);
        setSelectedDate(null);
    }

    async function handleReserve() {
        if (!selectedDate) {
            alert('Por favor selecciona una fecha para reservar.');
            return;
        }
        if (!user) {
            alert('Debes iniciar sesión o crear una cuenta para reservar.');
            return;
        }

        const { error } = await supabase
            .from('user_services')
            .insert([{
                user_id: user.id,
                service_name: service,
                assigned_date: selectedDate.toISOString().slice(0, 10)
            }]);

        if (error) {
            alert('Error al crear la reserva: ' + error.message);
        } else {
            alert('Reserva creada con éxito');
            fetchAllReservations();
            setSelectedDate(null);
        }
    }

    // Estilos mejorados
    const containerStyle = {
        maxWidth: '900px',
        margin: '2rem auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
    };
    const headerStyle = {
        fontWeight: 700,
        fontSize: '2rem',
        marginBottom: '2rem',
        color: '#111827',
    };
    const selectStyle = {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '1rem',
        marginBottom: '2rem',
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
    };
    const buttonStyle = {
        backgroundColor: '#6366f1',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    };
    const buttonDisabledStyle = {
        ...buttonStyle,
        backgroundColor: '#a5b4fc',
        cursor: 'not-allowed',
        boxShadow: 'none',
        transform: 'none',
    };
    const reservationsListStyle = {
        marginTop: '2rem',
    };
    const reservationItemStyle = {
        backgroundColor: '#f9fafb',
        padding: '1rem 1.5rem',
        marginBottom: '1rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        color: '#374151',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };
    const modalOverlay = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease',
    };
    const modalContent = {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        width: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        transform: 'scale(0.95)',
        animation: 'scaleIn 0.3s ease forwards',
    };
    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem',
    };
    const inputStyle = {
        width: '100%',
        padding: '1rem',
        marginBottom: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    };
    const errorTextStyle = {
        color: '#ef4444',
        marginBottom: '1rem',
        fontSize: '0.875rem',
    };
    const successTextStyle = {
        color: '#22c55e',
        marginBottom: '1rem',
        fontSize: '0.875rem',
    };
    const toggleLinkStyle = {
        color: '#6366f1',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: '1.5rem',
        textAlign: 'center',
        display: 'block',
        transition: 'color 0.3s ease',
    };

    return (
        <>
            <style>{calendarStyles}</style>
            <div style={containerStyle}>
                <h2 style={headerStyle}>Reservar Servicio</h2>

                {user ? (
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontSize: '1rem', color: '#374151' }}>
                            Sesión iniciada como <strong>{user.name}</strong>{' '}
                        </p>
                        <button onClick={handleLogout} style={{ color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none', marginLeft: '0.5rem', fontWeight: '500' }}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <p style={{ marginBottom: '2rem', fontStyle: 'italic', color: '#6b7280' }}>
                        Para reservar, selecciona una fecha disponible en el calendario.
                    </p>
                )}

                <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    style={selectStyle}
                >
                    {servicesOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

                {loading ? (
                    <p style={{ color: '#6b7280' }}>Cargando fechas...</p>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500, marginBottom: '2rem' }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        views={['month']}
                        view={calView}
                        date={calDate}
                        onNavigate={(newDate /* Date */, _view, _action) => {
                            setCalDate(newDate);
                        }}
                        onView={(newView) => setCalView(newView)}
                        toolbar={true}
                        eventPropGetter={(event) => (event.resource === 'reserved' ? { className: 'reserved' } : {})}
                        dayPropGetter={(date) => {
                            const isReserved = reservedEvents.some(ev => {
                                const evDate = new Date(ev.start); evDate.setHours(0, 0, 0, 0);
                                const d = new Date(date); d.setHours(0, 0, 0, 0);
                                return evDate.getTime() === d.getTime();
                            });
                            return { style: { backgroundColor: isReserved ? 'rgba(239,68,68,0.1)' : '', cursor: isReserved ? 'not-allowed' : 'pointer' } };
                        }}
                    />
                )}

                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontWeight: '500', color: '#374151' }}>
                        <strong>Fecha seleccionada:</strong> {selectedDate ? selectedDate.toLocaleDateString() : 'Ninguna'}
                    </p>
                    <button
                        style={selectedDate && user ? buttonStyle : buttonDisabledStyle}
                        onClick={handleReserve}
                        disabled={!selectedDate || !user}
                        onMouseEnter={e => {
                            if (selectedDate && user) {
                                e.target.style.backgroundColor = '#4f46e5';
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 6px 16px rgba(99,102,241,0.4)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (selectedDate && user) {
                                e.target.style.backgroundColor = '#6366f1';
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
                            }
                        }}
                    >
                        Confirmar Reserva
                    </button>
                </div>

                <div style={reservationsListStyle}>
                    <h3 style={{ fontWeight: 600, fontSize: '1.5rem', color: '#111827', marginBottom: '1.5rem' }}>
                        Reservas del Servicio: {service}
                    </h3>
                    {allReservations.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No hay reservas para este servicio.</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            {allReservations.map((r) => (
                                <li
                                    key={r.id}
                                    style={reservationItemStyle}
                                    onMouseEnter={e => {
                                        e.target.style.transform = 'translateY(-4px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    {r.users?.name || 'Usuario desconocido'} - {r.service_name} - {new Date(r.assigned_date).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {showAuthModal && (
                    <div style={modalOverlay} onClick={() => setShowAuthModal(false)}>
                        <div style={modalContent} onClick={e => e.stopPropagation()}>
                            {authMode === 'login' ? (
                                <>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Iniciar Sesión</h3>
                                    {loginError && <p style={errorTextStyle}>{loginError}</p>}
                                    <form onSubmit={handleLogin}>
                                        <label style={labelStyle}>Usuario</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            style={inputStyle}
                                            required
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Contraseña</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            style={inputStyle}
                                            required
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={buttonStyle}
                                            onMouseEnter={e => {
                                                e.target.style.backgroundColor = '#4f46e5';
                                                e.target.style.transform = 'scale(1.02)';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.backgroundColor = '#6366f1';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        >
                                            Entrar
                                        </button>
                                    </form>
                                    <p
                                        style={toggleLinkStyle}
                                        onClick={() => { setAuthMode('register'); clearAuthFields(); }}
                                        onMouseEnter={e => e.target.style.color = '#4f46e5'}
                                        onMouseLeave={e => e.target.style.color = '#6366f1'}
                                    >
                                        ¿No tienes cuenta? Crear una
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Crear Cuenta</h3>
                                    {regError && <p style={errorTextStyle}>{regError}</p>}
                                    {regSuccess && <p style={successTextStyle}>{regSuccess}</p>}
                                    <form onSubmit={handleRegister}>
                                        <label style={labelStyle}>Usuario *</label>
                                        <input
                                            type="text"
                                            value={regUsername}
                                            onChange={e => setRegUsername(e.target.value)}
                                            style={inputStyle}
                                            required
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Contraseña *</label>
                                        <input
                                            type="password"
                                            value={regPassword}
                                            onChange={e => setRegPassword(e.target.value)}
                                            style={inputStyle}
                                            required
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Nombre completo *</label>
                                        <input
                                            type="text"
                                            value={regName}
                                            onChange={e => setRegName(e.target.value)}
                                            style={inputStyle}
                                            required
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Teléfono</label>
                                        <input
                                            type="tel"
                                            value={regPhone}
                                            onChange={e => setRegPhone(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Correo electrónico</label>
                                        <input
                                            type="email"
                                            value={regEmail}
                                            onChange={e => setRegEmail(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <label style={labelStyle}>Dirección</label>
                                        <input
                                            type="text"
                                            value={regAddress}
                                            onChange={e => setRegAddress(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => {
                                                e.target.style.borderColor = '#6366f1';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={buttonStyle}
                                            onMouseEnter={e => {
                                                e.target.style.backgroundColor = '#4f46e5';
                                                e.target.style.transform = 'scale(1.02)';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.backgroundColor = '#6366f1';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        >
                                            Crear Cuenta
                                        </button>
                                    </form>
                                    <p
                                        style={toggleLinkStyle}
                                        onClick={() => { setAuthMode('login'); clearAuthFields(); }}
                                        onMouseEnter={e => e.target.style.color = '#4f46e5'}
                                        onMouseLeave={e => e.target.style.color = '#6366f1'}
                                    >
                                        ¿Ya tienes cuenta? Iniciar sesión
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}