import React, { useState } from 'react';
import { supabase, supabaseKey } from '../../supabaseClient';

const JobApplicationForm = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);
      const file = formData.get('cv');

      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      const cv_url = publicUrlData.publicUrl;

      const response = await fetch(
        'https://gvivprtrbphfvedbiice.supabase.co/functions/v1/send-job-application',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            has_license: formData.get('has_license') ? 'Sí' : 'No',
            contract_type: formData.get('contract_type'),
            skills: formData.get('skills'),
            cv_url,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setMessage('¡Aplicación enviada exitosamente!');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al enviar la aplicación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Trabaja con Nosotros</h2>
            <button className="close-button" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input type="text" name="name" required className="form-input" placeholder="Tu nombre" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="phone" required className="form-input" placeholder="+34..." />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" required className="form-input" placeholder="correo@ejemplo.com" />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="has_license" className="checkbox-input" />
                <span className="checkmark"></span>
                <span className="checkbox-text">Tengo permiso de conducir</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de contrato</label>
              <div className="select-wrapper">
                <select name="contract_type" required className="form-select">
                  <option value="">Seleccionar...</option>
                  <option value="autónomo">Autónomo</option>
                  <option value="empresa">Empresa</option>
                  <option value="asalariado">Asalariado</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades y experiencia</label>
              <textarea name="skills" required rows={4} className="form-textarea" placeholder="Cuéntanos sobre ti..." />
            </div>

            <div className="form-group file-upload-group">
              <label className="form-label">CV (PDF, DOC, DOCX)</label>
              <div className="file-drop-zone">
                <input type="file" name="cv" accept=".pdf,.doc,.docx" required className="file-input" />
                <div className="file-drop-content">
                  <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="file-drop-text">Arrastra tu CV aquí o haz clic para buscar</span>
                </div>
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={closeModal} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.4s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .modal-header h2 {
          margin: 0;
          color: #1a1a1a;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .close-button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 12px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: #f5f5f5;
          color: #1a1a1a;
        }

        .job-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.9rem 1rem;
          border: 1.5px solid #e5e5e5;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafafa;
          color: #333;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.08);
          background: #fff;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #999;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper::after {
          content: '';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #666;
          pointer-events: none;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
          padding-right: 2.5rem;
        }

        .checkbox-group {
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          color: #444;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .checkmark {
          position: relative;
          height: 22px;
          width: 22px;
          background-color: #fff;
          border: 2px solid #ddd;
          border-radius: 6px;
          margin-right: 12px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .checkbox-input:checked ~ .checkmark {
          background-color: #1a1a1a;
          border-color: #1a1a1a;
        }

        .checkmark:after {
          content: '';
          position: absolute;
          display: none;
          left: 7px;
          top: 3px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-text {
          font-size: 0.95rem;
        }

        .file-upload-group {
          margin-bottom: 1.5rem;
        }

        .file-drop-zone {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
        }

        .file-drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 2px dashed #ddd;
          border-radius: 16px;
          background: #fafafa;
          transition: all 0.2s;
        }

        .file-input:hover ~ .file-drop-content,
        .file-input:focus ~ .file-drop-content {
          border-color: #1a1a1a;
          background: #f5f5f5;
        }

        .file-upload-icon {
          width: 40px;
          height: 40px;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .file-drop-text {
          color: #666;
          font-size: 0.9rem;
          text-align: center;
        }

        .message {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .message.success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .message.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
        }

        .btn-primary {
          background: #1a1a1a;
          color: #fff;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: #fff;
          color: #333;
          border: 1.5px solid #ddd;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
          border-color: #bbb;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .modal-header,
          .job-form {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default JobApplicationForm;
