import React from 'react';

const EmpleadosTabla = ({ empleados, onVolver }) => {
  const handleEditar = (empleado) => {
    // Aquí puedes manejar la lógica personalizada para editar,
    // por ejemplo llamando un callback si lo necesitas
    console.log('Editar empleado:', empleado);
  };

  return (
    <section className="empleados-section p-4 bg-white rounded shadow-sm mt-5">
      <h2 className="mb-4">Gestión de Empleados</h2>

      <button className="btn btn-secondary mb-3" onClick={onVolver}>
        ← Volver al Menú
      </button>

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

