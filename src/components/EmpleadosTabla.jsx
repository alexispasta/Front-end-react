import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmpleadosTabla = ({ empleados }) => {
  const navigate = useNavigate();

  const handleEditar = (empleado) => {
    navigate(`/empleado/${empleado.id}`);
  };

  return (
    <section className="empleados-section p-4 bg-white rounded shadow-sm mt-5">
      <h2 className="mb-4">Gestión de Empleados</h2>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.documento}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEditar(empleado)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EmpleadosTabla;
