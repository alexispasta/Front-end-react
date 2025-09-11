import React, { useEffect, useState } from "react";

const GestionInformes = ({ onVolver }) => {
  const [informes, setInformes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const empresaId = localStorage.getItem("empresaId");

  // 🔹 Cargar informes de la empresa
  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      if (!empresaId) throw new Error("No se encontró empresa en el usuario logueado");

      const res = await fetch(`http://localhost:3000/api/informes/empresa/${empresaId}`);
      if (!res.ok) throw new Error("Error al cargar informes");

      const data = await res.json();
      setInformes(data);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Crear informe
  const handleCrearInforme = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch("http://localhost:3000/api/informes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, empresaId }),
      });

      if (!res.ok) throw new Error("Error al crear el informe");

      setNombre("");
      setDescripcion("");
      setMensaje({ tipo: "exito", texto: "✅ Informe creado correctamente" });
      cargarInformes();
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Consultar informe
  const handleConsultar = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/informes/${id}`);
      if (!res.ok) throw new Error("Error al consultar informe");

      const data = await res.json();
      alert(`📄 Informe: ${data.nombre}\n\n${data.descripcion || "Sin descripción"}`);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Eliminar informe puntual
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este informe?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/informes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar informe");
      setMensaje({ tipo: "exito", texto: "✅ Informe eliminado" });
      cargarInformes();
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Eliminar todos los informes
  const handleEliminarTodos = async () => {
    if (!window.confirm("⚠️ ¿Seguro que deseas eliminar TODOS los informes?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/informes/empresa/${empresaId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar informes");
      setMensaje({ tipo: "exito", texto: "✅ Todos los informes eliminados" });
      cargarInformes();
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-3">Gestión de Informes</h5>

      {mensaje.texto && (
        <div
          className={`alert ${
            mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Formulario para crear nuevo informe */}
      <form onSubmit={handleCrearInforme} className="mb-4">
        <div className="mb-2">
          <label className="form-label">Nombre del informe</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success btn-sm">
          Crear Informe
        </button>
      </form>

      {/* Tabla de informes */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre del Informe</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {informes.length > 0 ? (
            informes.map((informe) => (
              <tr key={informe._id}>
                <td>{informe.nombre}</td>
                <td>{new Date(informe.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleConsultar(informe._id)}
                  >
                    Consultar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(informe._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted py-3">
                No hay informes registrados para esta empresa
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón para eliminar todos */}
      {informes.length > 0 && (
        <button className="btn btn-danger btn-sm mb-3" onClick={handleEliminarTodos}>
          Eliminar Todos
        </button>
      )}

      <br />
      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </div>
  );
};

export default GestionInformes;
