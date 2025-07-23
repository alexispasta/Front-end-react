// src/components/EmpleadosGestion.jsx
import React, { useState } from 'react';
import EmpleadosTabla from './EmpleadosTabla';
import EmpleadoDetalleForm from './EmpleadoDetalleForm';

const EmpleadosGestion = ({ onVolver }) => {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const empleados = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      documento: '12345678',
      fecha: '2021-03-15',
      estado: 'activo',
      correo: 'juan.perez@email.com',
      salario: 2500000,
      cargo: 'Analista',
      eps: 'SURA',
    },
    {
      id: 2,
      nombre: 'Ana Gómez',
      documento: '87654321',
      fecha: '2022-01-10',
      estado: 'inactivo',
      correo: 'ana.gomez@email.com',
      salario: 3200000,
      cargo: 'Coordinadora',
      eps: 'Nueva EPS',
    },
  ];

  return (
    <div className="section-content mt-4">
      <section className="p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Empleados</h2>

       
        {!empleadoSeleccionado ? (
          <EmpleadosTabla empleados={empleados} onEditar={setEmpleadoSeleccionado} />
        ) : (
          <EmpleadoDetalleForm
            empleado={empleadoSeleccionado}
            onCerrar={() => setEmpleadoSeleccionado(null)}
          />
        )}
         <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>

      </section>
    </div>
  );
};

export default EmpleadosGestion;
