import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // 🔹 Cargar datos de la empresa
  useEffect(() => {
    const id = localStorage.getItem("empresaId");
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

  // 🔹 Eliminar empresa y empleados
  const manejarEliminarEmpresa = async () => {
    if (!empresaId) {
      setMensaje({ tipo: "error", texto: "No se encontró la empresa para eliminar" });
      return;
    }

    if (!window.confirm("⚠️ ¿Seguro que deseas eliminar la empresa y todos sus empleados?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/empresas/${empresaId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar la empresa");

      // 🔹 Limpiar datos locales y redirigir
      localStorage.removeItem("empresaId");
      alert("❌ Empresa y empleados eliminados correctamente");
      navigate("/login");
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

        {/* 🔹 Botón de eliminar empresa */}
        <button onClick={manejarEliminarEmpresa} className="btn btn-danger mt-3">
          Eliminar Empresa y Empleados
        </button>

        {mensaje.texto && (
          <div
            className={`alert mt-3 ${
              mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <button className="btn btn-secondary mt-3" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
}

export default ConfiguracionSistema;
