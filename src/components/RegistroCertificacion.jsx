// src/components/RegistroCertificacion.jsx
import React from 'react';

const RegistroCertificacion = ({ onVolver }) => {
  const certificados = [
    { nombre: 'Certificado de habilidades blandas', fecha: '2023-05-20' },
    { nombre: 'Certificado de seguridad laboral', fecha: '2024-01-10' },
  ];

  const handleUpload = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      alert(`Certificado "${archivo.name}" cargado correctamente.`);
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Certificaciones</h2>

        <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>

        <ul className="list-group mb-3">
          {certificados.map((certificado, index) => (
            <li key={index} className="list-group-item">
              {certificado.nombre} - Subido el {certificado.fecha}
            </li>
          ))}
        </ul>

        <div className="mb-3">
          <label className="form-label">Cargar nuevo certificado</label>
          <input type="file" className="form-control" onChange={handleUpload} />
        </div>
      </section>
    </div>
  );
};

export default RegistroCertificacion;
