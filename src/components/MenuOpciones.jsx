// src/components/MenuOpciones.jsx
import React from 'react';

const MenuOpciones = ({ onSeleccionar }) => {
  const opciones = [
    { id: 'empleados', texto: 'Gestión de empleados' },
    { id: 'asistencia', texto: 'Gestión de asistencia' },
    { id: 'reportes', texto: 'Gestión de reportes' },
    { id: 'nomina', texto: 'Gestión de nómina' },
    { id: 'permisos', texto: 'Gestión de permisos' }
  ];

  return (
    <div className="container mt-4">
      <div id="opciones">
        <h5 className="mt-4">Opciones</h5>
        {opciones.map(opcion => (
          <button
            key={opcion.id}
            className="btn btn-primary btn-sm d-block w-auto mb-2"
            onClick={() => onSeleccionar(opcion.id)}
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuOpciones;
