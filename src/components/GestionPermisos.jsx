import React, { useState, useEffect } from "react";

function GestionPermisos({ onVolver }) {
  const [permisos, setPermisos] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Cargar permisos desde la API
  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/permisosempleado");
        if (!res.ok) throw new Error("Error al cargar permisos");
        const data = await res.json();
        setPermisos(data);
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };

    cargarPermisos();
  }, []);

  const manejarAccion = async (id, estado) => {
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch(`http://localhost:3000/api/permisosempleado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el permiso");

      // Recargar la lista actualizada
      const dataActualizada = await fetch("http://localhost:3000/api/permisosempleado").then((r) =>
        r.json()
      );
      setPermisos(dataActualizada);

      setMensaje({ tipo: "exito", texto: `Permiso ${estado} correctamente` });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="p-4 bg-white rounded shadow-sm">
        <h2 className="mb-4">Gestión de Permisos</h2>

        {mensaje.texto && (
          <div
            className={`alert ${
              mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Empleado</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {permisos.length > 0 ? (
              permisos.map((p) => (
                <tr key={p._id}>
                  <td>{p.empleadoNombre}</td>
                  <td>{p.motivo}</td>
                  <td>{new Date(p.fechaSolicitud || p.createdAt).toLocaleDateString()}</td>
                  <td>
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
                  </td>
                  <td>
                    {p.estado === "pendiente" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => manejarAccion(p._id, "aprobado")}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => manejarAccion(p._id, "rechazado")}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  No hay solicitudes de permisos
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button className="btn btn-secondary mt-3" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
}

export default GestionPermisos;
