import React, { useState, useEffect } from "react";

const PermisosEmpleado = ({ onVolver }) => {
  const [asunto, setAsunto] = useState("");
  const [razon, setRazon] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [historial, setHistorial] = useState([]);

  // 🔹 Cargar historial de permisos del empleado
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/permisosempleado");
        if (!res.ok) throw new Error("Error al cargar historial");
        const data = await res.json();

        const empleadoActual = "Empleado Demo"; // 🔹 Simulación de usuario logueado
        setHistorial(data.filter((p) => p.empleadoNombre === empleadoActual));
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };

    cargarHistorial();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const nuevoPermiso = {
        motivo: asunto,
        descripcion: razon,
        estado: "pendiente",
        empleadoNombre: "Empleado Demo",
      };

      const res = await fetch("http://localhost:3000/api/permisosempleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPermiso),
      });

      if (!res.ok) throw new Error("Error al enviar la solicitud");

      // 🔹 Recargar historial actualizado
      const dataActualizada = await fetch("http://localhost:3000/api/permisosempleado").then((r) =>
        r.json()
      );
      const empleadoActual = "Empleado Demo";
      setHistorial(dataActualizada.filter((p) => p.empleadoNombre === empleadoActual));

      // 🔹 Limpiar formulario
      setAsunto("");
      setRazon("");
      setMensaje({ tipo: "exito", texto: "✅ Solicitud enviada correctamente" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="section-content mt-4">
      <h5>Solicitud de Permiso</h5>

      {mensaje.texto && (
        <div
          className={`alert ${
            mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="row">
        {/* Columna izquierda - Formulario */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Asunto del permiso</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Cita médica"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Razón del permiso</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Explica la razón detalladamente"
                value={razon}
                onChange={(e) => setRazon(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              Enviar solicitud
            </button>
            <button type="button" className="btn btn-secondary" onClick={onVolver}>
              Volver
            </button>
          </form>
        </div>

        {/* Columna derecha - Historial */}
        <div className="col-md-6">
          <h6>Historial de Solicitudes</h6>
          <ul className="list-group">
            {historial.length > 0 ? (
              historial.map((p) => (
                <li
                  key={p._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{p.motivo}</strong> - {p.descripcion} <br />
                    <small>
                      Fecha: {new Date(p.fechaSolicitud || p.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span
                    className={`badge ${
                      p.estado === "pendiente"
                        ? "bg-warning text-dark"
                        : p.estado === "aprobado"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {p.estado}
                  </span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">
                No tienes solicitudes registradas
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PermisosEmpleado;
