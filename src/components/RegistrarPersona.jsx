import React, { useState } from 'react';

const RegistrarPersona = ({ onVolver }) => {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const formData = new FormData(e.target);
    const persona = Object.fromEntries(formData.entries());

    // 🔹 Obtener empresaId del localStorage
    const empresaId = localStorage.getItem("empresaId");
    if (!empresaId) {
      setMensaje("❌ No se encontró la empresa del usuario logueado.");
      return;
    }

    // 🔹 Agregar empresaId al objeto que enviaremos
    persona.empresaId = empresaId;

    try {
      const res = await fetch("http://localhost:3000/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona),
      });

      if (!res.ok) throw new Error("Error al registrar persona");

      setMensaje("✅ Persona registrada correctamente");
      e.target.reset(); // limpia el formulario
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Registrar Persona</h2>

        {mensaje && (
          <div className="alert alert-info text-center" role="alert">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="nombre" className="form-label">Nombres</label>
              <input type="text" className="form-control" id="nombre" name="nombre" required />
            </div>
            <div className="col">
              <label htmlFor="apellido" className="form-label">Apellidos</label>
              <input type="text" className="form-control" id="apellido" name="apellido" required />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" id="email" name="email" required />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" name="password" required />
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="tel" className="form-control" id="telefono" name="telefono" required />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control" id="direccion" name="direccion" required />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="codigo" className="form-label">Código de empresa</label>
              <input type="text" className="form-control" id="codigo" name="codigo" required />
            </div>
            <div className="col">
              <label htmlFor="rol" className="form-label">Rol de Empresa</label>
              <select className="form-select" id="rol" name="rol" required>
                <option value="">Seleccione un rol</option>
                <option value="empleado">Empleado</option>
                <option value="rrhh">RRHH</option>
                <option value="gerente">Gerente</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="fecha" className="form-label">Fecha de Nacimiento</label>
              <input type="date" className="form-control" id="fecha" name="fecha" required />
            </div>
            <div className="col">
              <label htmlFor="ciudad" className="form-label">Ciudad</label>
              <input type="text" className="form-control" id="ciudad" name="ciudad" required />
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 mb-3">Registrar Persona</button>
        </form>

        <button className="btn btn-secondary w-100" onClick={onVolver}>
          ← Volver al Menú
        </button>
      </section>
    </div>
  );
};

export default RegistrarPersona;
