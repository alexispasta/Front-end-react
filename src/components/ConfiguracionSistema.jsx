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
  const [empresaId, setEmpresaId] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 🔹 Cargar datos de la empresa al montar el componente
  useEffect(() => {
    const id = localStorage.getItem("empresaId"); // ✅ Ahora tomamos el ID del usuario logueado
    if (!id) {
      setMensaje({ tipo: "error", texto: "No se encontró empresa asociada" });
      return;
    }
    setEmpresaId(id);

    const cargarEmpresa = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/empresas/${id}`);
        if (!res.ok) throw new Error("Error al cargar datos de la empresa");
        const data = await res.json();
        setEmpresa(data);
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
      if (!empresaId) throw new Error("No hay empresa para actualizar");

      const res = await fetch(`http://localhost:3000/api/empresas/${empresaId}`, {
        method: "PUT",
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
          {["nombre","pais","correo","ciudad","telefono","direccion"].map((campo) => (
            <div className="mb-3" key={campo}>
              <label className="form-label">
                {campo.charAt(0).toUpperCase() + campo.slice(1)}:
              </label>
              <input
                type={campo === "correo" ? "email" : "text"}
                name={campo}
                className="form-control"
                placeholder={`Ingrese ${campo}`}
                value={empresa[campo] || ""}
                onChange={manejarCambio}
              />
            </div>
          ))}

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
