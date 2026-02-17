import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verificando tu cuenta...');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const token_hash = searchParams.get('token_hash');
            const type = searchParams.get('type') || 'signup';

            if (!token_hash) {
                setStatus('Enlace inválido: falta token.');
                setIsError(true);
                return;
            }

            try {
                const { error } = await supabase.auth.verifyOtp({
                    token_hash,
                    type,
                });

                if (error) {
                    console.error('Error verifyOtp:', error); // <--- Añade esto

                    let mensaje = 'Error desconocido.';

                    if (error.message.includes('invalid') || error.status === 403) {
                        mensaje = 'El enlace ya fue usado o ha expirado. Intenta iniciar sesión directamente.';
                    } else if (error.message.includes('Token has expired')) {
                        mensaje = 'El enlace ha expirado. Solicita uno nuevo.';
                    } else {
                        mensaje = `Error: ${error.message}`;
                    }

                    setStatus(mensaje);
                    setIsError(true);
                } else {
                    if (type === 'recovery') {
                        setStatus('¡Enlace válido! Serás redirigido para cambiar tu contraseña en 3 segundos...');
                        setIsSuccess(true);
                        setTimeout(() => {
                            navigate('/reset-password');
                        }, 3000);
                    } else {
                        setStatus('¡Cuenta verificada con éxito! Serás redirigido en 3 segundos...');
                        setIsSuccess(true);
                        setTimeout(() => {
                            navigate('/'); // O la ruta deseada
                        }, 3000);
                    }
                }
            } catch (err) {
                setStatus('Error inesperado durante la verificación.');
                setIsError(true);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

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
                <h2>Verificando tu cuenta...</h2>
                {!isSuccess && !isError && (
                    <div style={{
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #3b82f6',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        animation: 'spin 1s linear infinite',
                        margin: '20px auto'
                    }}></div>
                )}
                <p style={{
                    color: isSuccess ? '#10b981' : isError ? '#ef4444' : '#2d3748'
                }}>
                    {status}
                </p>
                {isError && (
                    <p>
                        <a href="mailto:soporte@starlimpiezas.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            Contactar soporte
                        </a>
                    </p>
                )}
            </div>
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default EmailVerification;