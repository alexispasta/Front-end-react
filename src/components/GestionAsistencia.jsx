import React, { useState, useEffect } from 'react';

const GestionAsistencia = ({ onVolver }) => {
  const [fecha, setFecha] = useState("");
  const [empleados, setEmpleados] = useState([]); // <- ahora dinámico
  const [asistencia, setAsistencia] = useState({});
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar empleados desde la API al montar el componente
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/personas");
        if (!res.ok) throw new Error("Error al cargar empleados");
        const data = await res.json();
        console.log("👀 Empleados cargados:", data);
        setEmpleados(data);
      } catch (error) {
        setMensaje("Error al cargar empleados");
        setTimeout(() => setMensaje(""), 4000);
      }
    };
    cargarEmpleados();
  }, []);

  const manejarCambioEstado = (doc, estado) => {
    setAsistencia({ ...asistencia, [doc]: estado });
  };

  const guardarAsistencia = async (e) => {
  e.preventDefault();

  const registros = empleados.map(emp => ({
    documento: emp.documento,
    fecha: new Date(fecha).toISOString(), // ✅ convertir a formato ISO
    estado: asistencia[emp.documento] || "Presente"
  }));

  try {
    const res = await fetch("http://localhost:3000/api/gerente/asistencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registros)
    });

    const data = await res.json();
    setMensaje(data.message || data.error);
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    Cargando empleados...
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
