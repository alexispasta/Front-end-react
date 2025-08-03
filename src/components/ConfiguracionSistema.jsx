import React, { useState, useEffect } from "react";

function ConfiguracionSistema({ onVolver }) {
  const [empresa, setEmpresa] = useState({
    nombre: "",
    pais: "",
    correo: "",
    ciudad: "",
    telefono: "",
    direccion: "",
  });
  const [empresaId, setEmpresaId] = useState(null); // Para saber qué registro actualizar
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 🔹 Cargar datos de la empresa al montar el componente
  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/empresas");
        if (!res.ok) throw new Error("Error al cargar datos de la empresa");
        const data = await res.json();

        if (data.length > 0) {
          setEmpresa(data[0]); // Tomamos la primera empresa
          setEmpresaId(data[0]._id);
        }
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };

    cargarEmpresa();
  }, []);

  const manejarCambio = (e) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const manejarGuardarCambios = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const url = empresaId
        ? `http://localhost:3000/api/empresas/${empresaId}`
        : `http://localhost:3000/api/empresas`; // Si no existe, podrías usar POST

      const method = empresaId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresa),
      });

      if (!res.ok) throw new Error("No se pudo guardar la información");

      setMensaje({ tipo: "exito", texto: "Cambios guardados correctamente" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Configuración del Sistema</h2>

        

        <form onSubmit={manejarGuardarCambios}>
          <div className="mb-3">
            <label className="form-label">Nombre de la empresa:</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej: SGRH Ltda."
              value={empresa.nombre || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">País:</label>
            <input
              type="text"
              name="pais"
              className="form-control"
              placeholder="Ej: Colombia"
              value={empresa.pais || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              placeholder="correo@empresa.com"
              value={empresa.correo || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ciudad:</label>
            <input
              type="text"
              name="ciudad"
              className="form-control"
              placeholder="Ej: Bogotá"
              value={empresa.ciudad || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="Ej: 1234567890"
              value={empresa.telefono || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección:</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              placeholder="Ej: Calle 123 #45-67"
              value={empresa.direccion || ""}
              onChange={manejarCambio}
            />
          </div>

          <button type="submit" className="btn btn-primary me-2">
            Guardar cambios
          </button>
        </form>

        {mensaje.texto && (
          <div
            className={`alert mt-3 ${
              mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
            }`}
          >
            {mensaje.texto}
          </div>
        )}
        <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
}

export default ConfiguracionSistema;
