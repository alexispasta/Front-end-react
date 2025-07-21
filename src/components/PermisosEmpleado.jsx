import React, { useState } from 'react';

const PermisosEmpleado = () => {
  const [asunto, setAsunto] = useState('');
  const [razon, setRazon] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Solicitud enviada:\nAsunto: ${asunto}\nRazón: ${razon}`);
    setAsunto('');
    setRazon('');
  };

  return (
    <div className="section-content mt-4">
      <h5>Solicitud de Permiso</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Asunto del permiso</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej. Cita médica"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Razón del permiso</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Explica la razón detalladamente"
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Enviar solicitud</button>
      </form>
    </div>
  );
};

export default PermisosEmpleado;
