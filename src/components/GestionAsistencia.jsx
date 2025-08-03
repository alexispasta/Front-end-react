import React, { useState } from 'react';

const GestionAsistencia = ({ onVolver }) => {
  const [fecha, setFecha] = useState("");
  const [empleados] = useState([
    { nombre: 'Juan Pérez', documento: '12345678' },
    { nombre: 'Ana Gómez', documento: '87654321' },
  ]);
  const [asistencia, setAsistencia] = useState({});
  const [mensaje, setMensaje] = useState(""); // <- Nuevo estado para mensajes

  const manejarCambioEstado = (doc, estado) => {
    setAsistencia({ ...asistencia, [doc]: estado });
  };

  const guardarAsistencia = async (e) => {
    e.preventDefault();
    const registros = empleados.map(emp => ({
      documento: emp.documento,
      fecha,
      estado: asistencia[emp.documento] || "Presente"
    }));

    try {
      const res = await fetch("http://localhost:3000/api/gerente/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registros)
      });

      const data = await res.json();

      // Mostrar mensaje visual en la página
      setMensaje(data.message || data.error);

      // Limpiar mensaje después de 4 segundos
      setTimeout(() => setMensaje(""), 4000);
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Asistencia</h2>

        {/* Mostrar mensaje de confirmación si existe */}
        {mensaje && (
          <div className="alert alert-info text-center" role="alert">
            {mensaje}
          </div>
        )}

        <form onSubmit={guardarAsistencia}>
          <div className="mb-3">
            <label htmlFor="fechaAsistencia" className="form-label">Fecha:</label>
            <input
              type="date"
              className="form-control"
              id="fechaAsistencia"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
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
                    <select
                      className="form-select"
                      onChange={(e) =>
                        manejarCambioEstado(empleado.documento, e.target.value)
                      }
                    >
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

        <button className="btn btn-secondary mt-3" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
};

export default GestionAsistencia;
