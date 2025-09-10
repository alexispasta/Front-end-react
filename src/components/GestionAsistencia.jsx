import React, { useState, useEffect } from "react";

const GestionAsistencia = ({ onVolver }) => {
  const [fecha, setFecha] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const [fechaHistorialSeleccionada, setFechaHistorialSeleccionada] = useState("");
  const [asistenciasHistorial, setAsistenciasHistorial] = useState([]);

  const empresaId = localStorage.getItem("empresaId");

  // ✅ Cargar empleados
  useEffect(() => {
    if (empresaId) {
      fetch(`http://localhost:3000/api/personas/empresa/${empresaId}`)
        .then((res) => res.json())
        .then(setEmpleados)
        .catch((err) => console.error("Error cargando empleados:", err));
    }
  }, [empresaId]);

  // ✅ Cargar historial de fechas
  useEffect(() => {
    if (empresaId) {
      fetch(`http://localhost:3000/api/asistencia/historial/${empresaId}`)
        .then((res) => res.json())
        .then(setHistorial)
        .catch((err) => console.error("Error cargando historial:", err));
    }
  }, [empresaId]);

  // ✅ Manejo de estados en formulario
  const manejarCambioEstado = (idEmpleado, estado) => {
    setAsistencia({ ...asistencia, [idEmpleado]: estado });
  };

  // ✅ Guardar asistencia
  const guardarAsistencia = async (e) => {
    e.preventDefault();
    if (!fecha) return setMensaje("Debe seleccionar una fecha");

    const fechaISO = new Date(fecha).toISOString();

    const registros = empleados.map((emp) => ({
      documento: String(emp.codigo || emp.documento),
      fecha: fechaISO,
      estado: asistencia[emp._id] || "Presente",
      empresaId,
    }));

    const res = await fetch("http://localhost:3000/api/asistencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registros),
    });

    const data = await res.json();
    setMensaje(data.message || "Asistencia guardada ✅");

    // Refrescar historial
    fetch(`http://localhost:3000/api/asistencia/historial/${empresaId}`)
      .then((res) => res.json())
      .then(setHistorial);
  };

  // ✅ Consultar asistencia de una fecha del historial
  const consultarHistorial = () => {
    if (!fechaHistorialSeleccionada) {
      setMensaje("Seleccione una fecha del historial");
      return;
    }

    const fechaNormalizada = fechaHistorialSeleccionada;

    fetch(`http://localhost:3000/api/asistencia/${empresaId}/${fechaNormalizada}`)
      .then((res) => res.json())
      .then((data) => {
        setAsistenciasHistorial(data);
      })
      .catch((err) => console.error("Error consultando historial:", err));
  };

  return (
    <div className="row mt-4">
      {/* Tabla principal */}
      <div className="col-md-8">
        <section className="p-4 bg-light rounded shadow-sm">
          <h2 className="mb-4">Gestión de Asistencia</h2>

          {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

          <form onSubmit={guardarAsistencia}>
            <div className="mb-3">
              <label className="form-label">Fecha:</label>
              <input
                type="date"
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
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
                          value={asistencia[empleado._id] || "Presente"}
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
                    <td colSpan="3" className="text-center">
                      Cargando empleados...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <button type="submit" className="btn btn-success">
              Guardar Asistencia
            </button>
          </form>

          <button className="btn btn-secondary mt-3" onClick={onVolver}>
            ← Volver al Menú
          </button>
        </section>
      </div>

      {/* Historial */}
      <div className="col-md-4">
        <section className="p-4 bg-white rounded shadow-sm">
          <h4>Historial de Fechas</h4>

          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {historial.length > 0 ? (
                historial.map((f, i) => (
                  <tr key={i}>
                    <td>{f}</td>
                    <td>
                      <input
                        type="radio"
                        name="fechaHistorial"
                        value={f}
                        onChange={(e) =>
                          setFechaHistorialSeleccionada(e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    Sin registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            className="btn btn-primary w-100 mt-2"
            onClick={consultarHistorial}
          >
            Consultar
          </button>

          {asistenciasHistorial.length > 0 && (
            <div className="mt-3">
              <h5>Asistencia del {fechaHistorialSeleccionada}</h5>
              <table className="table table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Documento</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciasHistorial.map((a, i) => (
                    <tr key={i}>
                      <td>{a.documento}</td>
                      <td>{a.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GestionAsistencia;
