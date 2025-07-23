// src/components/GestionAsistencia.jsx
import React from 'react';

const GestionAsistencia = ({ onVolver }) => {
  const empleados = [
    { nombre: 'Juan Pérez', documento: '12345678' },
    { nombre: 'Ana Gómez', documento: '87654321' },
  ];

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Asistencia</h2>

        <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>

        <form>
          <div className="mb-3">
            <label htmlFor="fechaAsistencia" className="form-label">Fecha:</label>
            <input type="date" className="form-control" id="fechaAsistencia" required />
          </div>
          <table className="table table-bordered table-hover">
            <thead className="table-secondary">
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr key={index}>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.documento}</td>
                  <td>
                    <select className="form-select">
                      <option>Presente</option>
                      <option>Ausente</option>
                      <option>Permiso</option>
                      <option>Retardo</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" className="btn btn-success">Guardar Asistencia</button>
        </form>
      </section>
    </div>
  );
};

export default GestionAsistencia;