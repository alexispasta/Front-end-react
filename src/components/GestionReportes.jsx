import React, { useState } from 'react';

const GestionReportes = ({ onVolver }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [asunto, setAsunto] = useState('');
  const [documento, setDocumento] = useState('');
  const [texto, setTexto] = useState('');
  const [historial, setHistorial] = useState([
    { fecha: '2025-05-12', descripcion: 'Falta injustificada - Carlos Pérez' },
    { fecha: '2025-05-10', descripcion: 'Queja por retraso - Laura Sánchez' }
  ]);

  const enviarReporte = (e) => {
    e.preventDefault();
    const nuevoReporte = {
      fecha: new Date().toISOString().split('T')[0],
      descripcion: `${asunto} - ${documento || 'Anónimo'}`
    };
    setHistorial([nuevoReporte, ...historial]);
    setAsunto('');
    setDocumento('');
    setTexto('');
    setMostrarFormulario(false);
  };

  return (
    <div className="mt-4">
      {/* Botón de volver */}
      <button className="btn btn-link mb-3" onClick={onVolver}>
        ← Volver al menú
      </button>

      <h5>Gestión de reportes</h5>
      <h6>Historial de reportes</h6>
      <ul className="list-group mb-3">
        {historial.map((r, index) => (
          <li key={index} className="list-group-item">
            [{r.fecha}] {r.descripcion}
          </li>
        ))}
      </ul>

      <button className="btn btn-primary btn-sm" onClick={() => setMostrarFormulario(true)}>
        Generar nuevo reporte
      </button>

      {mostrarFormulario && (
        <div className="mt-4">
          <h6>Nuevo reporte</h6>
          <form onSubmit={enviarReporte}>
            <div className="mb-2">
              <label>Asunto</label>
              <input
                type="text"
                className="form-control"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Documento del empleado (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>Texto del reporte</label>
              <textarea
                className="form-control"
                rows="4"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm">
              Enviar reporte
            </button>
          </form>

          <button
            className="btn btn-secondary btn-sm mt-3"
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default GestionReportes;
