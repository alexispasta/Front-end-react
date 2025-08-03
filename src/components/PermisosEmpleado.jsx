import React, { useState } from "react";

const PermisosEmpleado = ({ onVolver }) => {
  const [asunto, setAsunto] = useState("");
  const [razon, setRazon] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch("http://localhost:3000/api/permisosempleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo: asunto,
          descripcion: razon,
          estado: "pendiente",
          empleadoNombre: "Empleado Demo", // 🔹 Se puede reemplazar con el usuario logueado
        }),
      });

      if (!res.ok) throw new Error("Error al enviar la solicitud");

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

      <form onSubmit={handleSubmit}>
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
  );
};

export default PermisosEmpleado;
