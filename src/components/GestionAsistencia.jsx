import React, { useState, useEffect } from 'react';

const GestionAsistencia = ({ onVolver }) => {
  const [fecha, setFecha] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [mensaje, setMensaje] = useState("");

  // 🔹 Empresa dinámica del usuario logueado
  const empresaId = localStorage.getItem("empresaId");

  // 🔹 Cargar empleados filtrados por empresa
  useEffect(() => {
    const cargarEmpleados = async () => {
      if (!empresaId) {
        setMensaje("❌ No se encontró la empresa del usuario logueado.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/personas/empresa/${empresaId}`);
        if (!res.ok) throw new Error("Error al cargar empleados");
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error("❌ Error cargando empleados:", error.message);
        setMensaje("Error al cargar empleados");
        setTimeout(() => setMensaje(""), 4000);
      }
    };
    cargarEmpleados();
  }, [empresaId]);

  // 🔹 Manejar cambio de estado en el select
  const manejarCambioEstado = (idEmpleado, estado) => {
    setAsistencia({ ...asistencia, [idEmpleado]: estado });
  };

  // 🔹 Guardar asistencia en el backend
  const guardarAsistencia = async (e) => {
    e.preventDefault();

    if (!fecha) {
      setMensaje("Debe seleccionar una fecha");
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    const registros = empleados.map(emp => ({
      documento: String(emp.codigo || emp.documento),
      fecha: fecha,
      estado: asistencia[emp._id] || "Presente",
      empresaId: empresaId,
    }));

    try {
      const res = await fetch("http://localhost:3000/api/gerente/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registros)
      });

      const data = await res.json();
      setMensaje(data.message || data.error || "Asistencia guardada ✅");
      setTimeout(() => setMensaje(""), 4000);
    } catch (error) {
      console.error("❌ Error al conectar con el servidor:", error.message);
      setMensaje("Error al conectar con el servidor");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Asistencia</h2>

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
              {empleados.length > 0 ? (
                empleados.map((empleado) => (
                  <tr key={empleado._id}>
                    <td>{empleado.nombre} {empleado.apellido}</td>
                    <td>{empleado.codigo || empleado.documento}</td>
                    <td>
                      <select
                        className="form-select"
                        defaultValue="Presente"
                        onChange={(e) =>
                          manejarCambioEstado(empleado._id, e.target.value)
                        }
                      >
                        <option>Presente</option>
                        <option>Ausente</option>
                        <option>Permiso</option>
                        <option>Retardo</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    {empresaId ? "Cargando empleados..." : "Sin empresa asignada"}
                  </td>
                </tr>
              )}
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
