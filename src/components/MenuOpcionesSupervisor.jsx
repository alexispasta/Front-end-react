import React from 'react';

const MenuOpcionesSupervisor = ({ onSeleccionar }) => {
  const opciones = [
  
  { id: 'asistencia', texto: 'Gestión de asistencia' },
  { id: 'informes', texto: 'Gestión de informes' },
  { id: 'reportes', texto: 'Gestión de reportes' },
  
  { id: 'permisos', texto: 'Gestión de permisos' },
];


  return (
    <div className="container mt-4">
      <h5 className="mt-4">Opciones</h5>
      {opciones.map((opcion) => (
        <button
          key={opcion.id}
          className="btn btn-primary btn-sm d-block w-auto mb-2"
          onClick={() => onSeleccionar(opcion.id)}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  );
};

export default MenuOpcionesSupervisor;
