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

      // 👉 Subir CV a Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      const cv_url = publicUrlData.publicUrl;

      // 👉 Enviar datos a la función de Supabase
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

      setMessage('✅ ¡Aplicación enviada exitosamente!');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error al enviar la aplicación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Trabaja con Nosotros</h2>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input type="text" name="name" required className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Número de teléfono</label>
              <input type="tel" name="phone" required className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input type="email" name="email" required className="form-input" />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="has_license" className="checkbox-input" />
                <span className="checkmark"></span>
                Tengo permiso de conducir
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de contrato preferido</label>
              <select name="contract_type" required className="form-select">
                <option value="">Seleccionar tipo de contrato</option>
                <option value="autónomo">Autónomo</option>
                <option value="empresa">Empresa</option>
                <option value="asalariado">Asalariado</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">¿Qué habilidades puedes aportar?</label>
              <textarea name="skills" required rows={4} className="form-textarea" />
            </div>

            <div className="form-group file-upload">
              <label className="form-label">Adjuntar CV (PDF, DOC, DOCX)</label>
              <input type="file" name="cv" accept=".pdf,.doc,.docx" required className="file-input" />
              <label className="file-label">
                <span className="file-icon">📎</span>
                <span className="file-text">Seleccionar archivo...</span>
              </label>
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
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .job-application-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
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
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 1.875rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .job-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafafa;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-upload {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-label {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          background: #fafafa;
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-label:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .file-icon {
          margin-right: 0.75rem;
          font-size: 1.25rem;
        }

        .file-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .checkbox-group {
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkmark {
          position: relative;
          height: 20px;
          width: 20px;
          background-color: #fff;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          margin-right: 0.75rem;
          transition: all 0.2s;
        }

        .checkbox-input:checked ~ .checkmark {
          background-color: #667eea;
          border-color: #667eea;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-input:checked ~ .checkmark:after {
          display: block;
        }

        .checkmark:after {
          left: 6px;
          top: 2px;
          width: 6px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .message {
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .message.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 2px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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