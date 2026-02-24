import React, { useState, useRef } from 'react';
import { supabase, supabaseKey } from '../../supabaseClient';

const JobApplicationForm = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)) {
        setSelectedFile(file);
      } else {
        setMessage('Por favor, selecciona un archivo PDF, DOC o DOCX.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage('Por favor, adjunta tu CV.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);
      const fileName = `${Date.now()}_${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, selectedFile);

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
      setSelectedFile(null);
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Trabaja con Nosotros</h2>
            <button className="close-button" onClick={closeModal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input type="text" name="name" required className="form-input" placeholder="Tu nombre completo" />
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
              <textarea name="skills" required rows={4} className="form-textarea" placeholder="Cuéntanos sobre tu experiencia y habilidades..." />
            </div>

            <div className="form-group file-upload-group">
              <label className="form-label">CV (PDF, DOC, DOCX)</label>
              <div
                className={`file-drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  <div className="file-selected">
                    <div className="file-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                      </svg>
                    </div>
                    <div className="file-info">
                      <span className="file-name">{selectedFile.name}</span>
                      <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                    </div>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="file-drop-content">
                    <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span className="file-drop-text">
                      <strong>Arrastra tu CV aquí</strong>
                      <span className="file-drop-or">o</span>
                      <span className="file-browse-link">busca en tu dispositivo</span>
                    </span>
                    <span className="file-formats">PDF, DOC, DOCX (máx. 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes('Error') || message.includes('Por favor') ? 'error' : 'success'}`}>
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
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
          padding: 1rem;
        }

        .modal-content {
          background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
          border-radius: 20px;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 20px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 540px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.75rem;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          border-radius: 20px 20px 0 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .job-form {
          padding: 1.75rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background: #ffffff;
          color: #1f2937;
        }

        .form-input:hover,
        .form-select:hover,
        .form-textarea:hover {
          border-color: #d1d5db;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: rgba(15, 23, 42, 0.6);
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
          background: #fff;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #9ca3af;
        }

        .form-textarea {
          resize: vertical;
          min-height: 90px;
          font-family: inherit;
          line-height: 1.5;
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
          border-top: 5px solid #6b7280;
          pointer-events: none;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
          padding-right: 2.5rem;
        }

        .checkbox-group {
          margin-bottom: 1.25rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          color: #4b5563;
          user-select: none;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .checkmark {
          position: relative;
          height: 20px;
          width: 20px;
          background-color: #fff;
          border: 2px solid #d1d5db;
          border-radius: 5px;
          margin-right: 10px;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .checkbox-input:checked ~ .checkmark {
          background-color: rgba(15, 23, 42, 0.85);
          border-color: rgba(15, 23, 42, 0.85);
        }

        .checkmark:after {
          content: '';
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
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
          font-size: 0.9rem;
        }

        .file-upload-group {
          margin-bottom: 1.25rem;
        }

        .file-drop-zone {
          position: relative;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .file-drop-zone.dragging {
          transform: scale(1.01);
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
          padding: 1.75rem 1.5rem;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          background: #f9fafb;
          transition: all 0.2s ease;
        }

        .file-drop-zone.dragging .file-drop-content {
          border-color: rgba(15, 23, 42, 0.5);
          background: rgba(15, 23, 42, 0.05);
          border-style: solid;
        }

        .file-input:hover ~ .file-drop-content,
        .file-input:focus ~ .file-drop-content {
          border-color: rgba(15, 23, 42, 0.5);
          background: rgba(15, 23, 42, 0.03);
        }

        .file-upload-icon {
          width: 36px;
          height: 36px;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          transition: color 0.2s ease;
        }

        .file-drop-zone.dragging .file-upload-icon,
        .file-input:hover ~ .file-drop-content .file-upload-icon {
          color: rgba(15, 23, 42, 0.7);
        }

        .file-drop-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.9rem;
          text-align: center;
        }

        .file-drop-text strong {
          color: #374151;
        }

        .file-drop-or {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        .file-browse-link {
          color: rgba(15, 23, 42, 0.8);
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }

        .file-formats {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(15, 23, 42, 0.04);
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-radius: 12px;
        }

        .file-icon {
          width: 40px;
          height: 40px;
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-icon svg {
          width: 22px;
          height: 22px;
          color: rgba(15, 23, 42, 0.7);
        }

        .file-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .file-remove-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .file-remove-btn:hover {
          background: #fecaca;
        }

        .file-remove-btn svg {
          width: 16px;
          height: 16px;
        }

        .message {
          padding: 0.85rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
          font-weight: 500;
          font-size: 0.9rem;
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
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f3f4f6;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.7rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
        }

        .btn-primary {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.9) 100%);
          color: #fff;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: #fff;
          color: #4b5563;
          border: 1.5px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Scrollbar styling */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        @media (max-width: 640px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal-content {
            max-height: 95vh;
            border-radius: 20px 20px 0 0;
            animation: slideUpMobile 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .modal-header {
            border-radius: 20px 20px 0 0;
            padding: 1.25rem 1.5rem;
          }

          .modal-header h2 {
            font-size: 1.2rem;
          }

          .job-form {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
            padding: 0.85rem 1.5rem;
          }
        }

        @keyframes slideUpMobile {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default JobApplicationForm;
