import React, { useState } from "react";

function ConfiguracionSistema({ onVolver }) {
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);

  const manejarGuardarCambios = (e) => {
    e.preventDefault();
    alert("Cambios guardados");
  };

  const manejarEnviarQueja = (e) => {
    e.preventDefault();
    setConfirmacionVisible(true);
    setTimeout(() => setConfirmacionVisible(false), 4000);
  };

  return (
    <div className="section-content mt-4">
      <section className="p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Configuración del Sistema</h2>

        {/* Botón volver al menú, estilo igual al de Asistencia */}
        <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>

        <form onSubmit={manejarGuardarCambios}>
          <div className="mb-3">
            <label className="form-label">Nombre de la empresa:</label>
            <input type="text" className="form-control" placeholder="Ej: SGRH Ltda." />
          </div>
          <div className="mb-3">
            <label className="form-label">País:</label>
            <input type="text" className="form-control" placeholder="Ej: Colombia" />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico:</label>
            <input type="email" className="form-control" placeholder="correo@empresa.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Ciudad:</label>
            <input type="text" className="form-control" placeholder="Ej: Bogotá" />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono:</label>
            <input type="text" className="form-control" placeholder="Ej: 1234567890" />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección:</label>
            <input type="text" className="form-control" placeholder="Ej: Calle 123 #45-67" />
          </div>
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </form>
      </section>
    </div>
  );
}

export default ConfiguracionSistema;
