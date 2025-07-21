import React, { useState } from 'react';

const RegistroCertificacion = () => {
  const [archivo, setArchivo] = useState(null);

  const handleUpload = (e) => {
    setArchivo(e.target.files[0]);
    alert(`Certificado "${e.target.files[0].name}" cargado correctamente.`);
  };

  return (
    <div className="section-content mt-4">
      <h5>Certificaciones</h5>
      <ul className="list-group mb-3">
        <li className="list-group-item">Certificado de habilidades blandas - Subido el 2023-05-20</li>
        <li className="list-group-item">Certificado de seguridad laboral - Subido el 2024-01-10</li>
      </ul>
      <div className="mb-3">
        <label className="form-label">Cargar nuevo certificado</label>
        <input type="file" className="form-control" onChange={handleUpload} />
      </div>
    </div>
  );
};

export default RegistroCertificacion;
