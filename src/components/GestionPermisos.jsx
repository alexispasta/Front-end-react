import React, { useState, useEffect } from "react";

function GestionPermisos({ onVolver }) {
  const [permisos, setPermisos] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const empresaId = localStorage.getItem("empresaId");

  // Cargar permisos de la empresa
  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        if (!empresaId) throw new Error("No se encontró empresa en el usuario logueado");

        const res = await fetch(`http://localhost:3000/api/permisos/empresa/${empresaId}`);
        if (!res.ok) throw new Error("Error al cargar permisos");
        const data = await res.json();
        setPermisos(data);
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };

    cargarPermisos();
  }, [empresaId]);

  const manejarAccion = async (id, estado) => {
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch(`http://localhost:3000/api/permisos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el permiso");

      // Recargar permisos actualizados
      const dataActualizada = await fetch(
        `http://localhost:3000/api/permisos/empresa/${empresaId}`
      ).then((r) => r.json());
      setPermisos(dataActualizada);

      setMensaje({ tipo: "exito", texto: `Permiso ${estado} correctamente` });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const eliminarPermiso = async (id) => {
    setMensaje({ tipo: "", texto: "" });
    try {
      const res = await fetch(`http://localhost:3000/api/permisos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el permiso");

      const dataActualizada = await fetch(
        `http://localhost:3000/api/permisos/empresa/${empresaId}`
      ).then((r) => r.json());
      setPermisos(dataActualizada);

      setMensaje({ tipo: "exito", texto: "Permiso eliminado correctamente" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const eliminarTodos = async () => {
    if (!window.confirm("¿Estás seguro de eliminar TODOS los permisos?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/permisos/empresa/${empresaId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("No se pudieron eliminar los permisos");

      setPermisos([]);
      setMensaje({ tipo: "exito", texto: "Todos los permisos eliminados" });
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
                  <td>{p.empleadoNombre || "Desconocido"}</td>
                  <td>{p.motivo}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
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
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => manejarAccion(p._id, "rechazado")}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminarPermiso(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  No hay solicitudes de permisos para esta empresa
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {permisos.length > 0 && (
          <button className="btn btn-danger mt-3 me-3" onClick={eliminarTodos}>
            🗑 Eliminar TODOS los permisos
          </button>
        )}

        <button className="btn btn-secondary mt-3" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
}

export default GestionPermisos;
