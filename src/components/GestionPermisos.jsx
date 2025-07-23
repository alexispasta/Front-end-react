// src/components/GestionPermisos.jsx
import React, { useState } from 'react';

const GestionPermisos = ({ onVolver }) => {
  const [solicitudes, setSolicitudes] = useState([
    { nombre: 'Juan Pérez', fecha: '2025-05-20' },
    { nombre: 'Laura Díaz', fecha: '2025-05-22' },
  ]);

  const [aprobados, setAprobados] = useState([]);
  const [desaprobados, setDesaprobados] = useState([]);

  const aprobar = (index) => {
    const item = solicitudes[index];
    setAprobados([...aprobados, item]);
    setSolicitudes(solicitudes.filter((_, i) => i !== index));
  };

  const rechazar = (index) => {
    const item = solicitudes[index];
    setDesaprobados([...desaprobados, item]);
    setSolicitudes(solicitudes.filter((_, i) => i !== index));
  };

  return (
    <div id="permisos" className="section-content mt-4">
      <h5>Gestión de permisos</h5>

      <h6>Solicitudes</h6>
      <ul className="list-group mb-3" id="listaSolicitudes">
        {solicitudes.length === 0 ? (
          <li className="list-group-item">No hay solicitudes pendientes.</li>
        ) : (
          solicitudes.map((sol, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {sol.nombre} - {sol.fecha}
              <div>
                <button className="btn btn-success btn-sm me-1" onClick={() => aprobar(index)}>
                  Aprobar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => rechazar(index)}>
                  Rechazar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <h6>Aprobados</h6>
      <ul className="list-group mb-3" id="aprobados">
        {aprobados.length === 0 ? (
          <li className="list-group-item">Sin aprobaciones aún.</li>
        ) : (
          aprobados.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.nombre} - {item.fecha}
            </li>
          ))
        )}
      </ul>

      <h6>Desaprobados</h6>
      <ul className="list-group mb-3" id="desaprobados">
        {desaprobados.length === 0 ? (
          <li className="list-group-item">Sin rechazos aún.</li>
        ) : (
          desaprobados.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.nombre} - {item.fecha}
            </li>
          ))
        )}
      </ul>

      {/* Botón de volver */}
      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default GestionPermisos;
