import React, { useState, useEffect } from "react";

const GestionReportes = ({ onVolver }) => {
  const [empleados, setEmpleados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadoConfig, setEmpleadoConfig] = useState(null); // 🔹 Para editar info
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 🔹 Cargar empleados y reportes
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resEmpleados, resReportes] = await Promise.all([
          fetch("http://localhost:3000/api/personas"),
          fetch("http://localhost:3000/api/reportes"),
        ]);

        if (!resEmpleados.ok || !resReportes.ok)
          throw new Error("Error al cargar datos");

        setEmpleados(await resEmpleados.json());
        setHistorial(await resReportes.json());
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };
    cargarDatos();
  }, []);

  // 🔹 Enviar reporte
  const enviarReporte = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const nuevoReporte = {
        asunto,
        descripcion: texto,
        empleadoId: empleadoSeleccionado._id,
      };

      const res = await fetch("http://localhost:3000/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReporte),
      });

      if (!res.ok) throw new Error("Error al enviar reporte");

      const dataActualizada = await fetch("http://localhost:3000/api/reportes").then((r) =>
        r.json()
      );
      setHistorial(dataActualizada);

      setAsunto("");
      setTexto("");
      setEmpleadoSeleccionado(null);
      setMensaje({ tipo: "exito", texto: "Reporte enviado correctamente ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Guardar cambios de empleado
  const guardarEmpleado = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/personas/${empleadoConfig._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleadoConfig),
      });

      if (!res.ok) throw new Error("Error al actualizar empleado");

      const dataActualizada = await fetch("http://localhost:3000/api/personas").then((r) =>
        r.json()
      );
      setEmpleados(dataActualizada);
      setEmpleadoConfig(null);
      setMensaje({ tipo: "exito", texto: "Empleado actualizado ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="mt-4">
      <h5>Gestión de reportes</h5>

      {mensaje.texto && (
        <div
          className={`alert ${
            mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* 🔹 Lista de empleados */}
      <h6>Empleados</h6>
      <ul className="list-group mb-3">
        {empleados.length > 0 ? (
          empleados.map((emp) => (
            <li
              key={emp._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {emp.nombre} {emp.apellido} ({emp.documento})
              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => setEmpleadoSeleccionado(emp)}
                >
                  Crear Informe
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEmpleadoConfig({ ...emp })}
                >
                  Configurar
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No hay empleados</li>
        )}
      </ul>

      {/* 🔹 Formulario de reporte */}
      {empleadoSeleccionado && (
        <div className="mt-4 p-3 border rounded">
          <h6>Nuevo reporte para {empleadoSeleccionado.nombre}</h6>
          <form onSubmit={enviarReporte}>
            <div className="mb-2">
              <label>Asunto</label>
              <input
                type="text"
                className="form-control"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Descripción</label>
              <textarea
                className="form-control"
                rows="4"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm me-2">
              Enviar reporte
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEmpleadoSeleccionado(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* 🔹 Formulario de configuración de empleado */}
      {empleadoConfig && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h6>Configurar empleado: {empleadoConfig.nombre}</h6>
          <form onSubmit={guardarEmpleado}>
            <div className="mb-2">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={empleadoConfig.nombre}
                onChange={(e) =>
                  setEmpleadoConfig({ ...empleadoConfig, nombre: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label>Apellido</label>
              <input
                type="text"
                className="form-control"
                value={empleadoConfig.apellido}
                onChange={(e) =>
                  setEmpleadoConfig({ ...empleadoConfig, apellido: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label>Documento</label>
              <input
                type="text"
                className="form-control"
                value={empleadoConfig.documento}
                onChange={(e) =>
                  setEmpleadoConfig({ ...empleadoConfig, documento: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm me-2">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEmpleadoConfig(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* 🔹 Historial */}
      <h6 className="mt-4">Historial de reportes</h6>
      <ul className="list-group mb-3">
        {historial.length > 0 ? (
          historial.map((r) => (
            <li key={r._id} className="list-group-item">
              [{new Date(r.createdAt).toLocaleDateString()}] {r.asunto} -{" "}
              {r.empleadoId?.nombre || "Empleado desconocido"}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            No hay reportes registrados
          </li>
        )}
      </ul>

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default GestionReportes;
