import React, { useEffect, useState } from "react";

const GestionInformes = ({ onVolver }) => {
  const [informes, setInformes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 🔹 Cargar informes al iniciar
  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/informes");
      if (!res.ok) throw new Error("Error al cargar informes");
      const data = await res.json();
      setInformes(data);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const handleCrearInforme = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch("http://localhost:3000/api/informes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion }),
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

  const handleRevisar = (informe) => {
    alert(`📄 Informe: ${informe.nombre}\n\n${informe.descripcion || "Sin descripción"}`);
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
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {informes.length > 0 ? (
            informes.map((informe) => (
              <tr key={informe._id}>
                <td>{informe.nombre}</td>
                <td>{new Date(informe.fecha || informe.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleRevisar(informe)}
                  >
                    Revisar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted py-3">
                No hay informes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </div>
  );
};

export default GestionInformes;
