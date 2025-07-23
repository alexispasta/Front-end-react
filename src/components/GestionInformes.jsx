import React from 'react';

const GestionInformes = ({ onVolver }) => {
  const informes = [
    { nombre: 'Informe mensual', fecha: '2025-05-01' },
    { nombre: 'Informe de rendimiento', fecha: '2025-05-15' },
  ];

  const handleRevisar = (nombre) => {
    alert(`Revisando: ${nombre}`);
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-3">Gestión de informes</h5>

      {/* Botón de volver */}
      

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre del Informe</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {informes.map((informe, index) => (
            <tr key={index}>
              <td>{informe.nombre}</td>
              <td>{informe.fecha}</td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleRevisar(informe.nombre)}
                >
                  Revisar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-secondary mb-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </div>
  );
};

export default GestionInformes;
