import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setStatus('');

    if (password !== confirmPassword) {
      setStatus('Las contraseñas no coinciden.');
      setIsError(true);
      return;
    }

    if (password.length < 6) {
      setStatus('La contraseña debe tener al menos 6 caracteres.');
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus(`Error: ${error.message}`);
        setIsError(true);
      } else {
        setStatus('¡Contraseña cambiada con éxito!');
        // No auto redirect, let user click button
      }
    } catch (err) {
      setStatus('Error inesperado al cambiar la contraseña.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      backgroundColor: '#f8fbfd',
      color: '#2d3748',
      margin: 0,
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div style={{
        maxWidth: '500px',
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,123,255,0.1)',
        textAlign: 'center',
        border: '1px solid #e6f2ff'
      }}>
        <img src="https://i.imgur.com/aZQE4yv.png" alt="Star Limpiezas" style={{ height: '50px', marginBottom: '20px' }} />
        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
        {status && (
          <div style={{ marginTop: '20px' }}>
            <p style={{
              color: isError ? '#ef4444' : '#10b981',
              marginBottom: '10px'
            }}>
              {status}
            </p>

            {!isError && (
              <button
                onClick={() => navigate('/reservas?authMode=login')}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Iniciar Sesión
              </button>
            )}

            {isError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Si el enlace ha expirado o es inválido, solicita uno nuevo.
                </p>
                <button
                  onClick={() => navigate('/reservas?authMode=forgotPassword')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Solicitar nuevo enlace
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;