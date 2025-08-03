import React, { useState, useEffect } from "react";
import * as bootstrap from "bootstrap"; // ✅ Importa Bootstrap como objeto
import "bootstrap/dist/css/bootstrap.min.css";

const GestionNomina = ({ onVolver }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datosNomina, setDatosNomina] = useState({});
  const [nominas, setNominas] = useState([]);

  // Cargar nómina desde la API
  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/nomina");
        const data = await res.json();
        setNominas(data);
      } catch (err) {
        console.error("Error cargando nómina:", err);
      }
    };
    fetchNominas();
  }, []);

  const handleEditarClick = (nomina) => {
    setDatosNomina(nomina);
    setMostrarFormulario(true);
  };

  const handleChange = (e) => {
    setDatosNomina({ ...datosNomina, [e.target.name]: e.target.value });
  };

  const guardarCambiosNomina = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/nomina/${datosNomina._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosNomina),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar la nómina");

      // Actualizamos la tabla
      const dataActualizada = await fetch(
        "http://localhost:3000/api/nomina"
      ).then((r) => r.json());
      setNominas(dataActualizada);

      // ✅ Mostrar modal de éxito
      const modal = new bootstrap.Modal(
        document.getElementById("modalGuardado")
      );
      modal.show();

      setMostrarFormulario(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div id="nomina" className="section-content mt-4">
      <section className="nomina-section p-4 bg-white rounded shadow-sm mt-5">
        <h2 className="mb-4">Gestión de Nómina</h2>

        <button className="btn btn-secondary mb-3" onClick={onVolver}>
          ← Volver al Menú
        </button>

        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {nominas.length > 0 ? (
              nominas.map((n) => (
                <tr key={n._id}>
                  <td>{n.nombre}</td>
                  <td>{n.cedula}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm editar-nomina-btn"
                      onClick={() => handleEditarClick(n)}
                    >
                      Editar Nómina
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  No hay registros de nómina
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {mostrarFormulario && (
        <div id="infoNomina" className="mt-4 bg-light p-4 rounded shadow-sm">
          <h6>Información de Nómina</h6>
          <form onSubmit={guardarCambiosNomina}>
            <div className="mb-2">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={datosNomina.nombre}
                disabled
              />
            </div>
            <div className="mb-2">
              <label>Cédula</label>
              <input
                type="text"
                className="form-control"
                value={datosNomina.cedula}
                disabled
              />
            </div>
            <div className="mb-2">
              <label>Cuenta Bancaria</label>
              <input
                type="text"
                name="cuenta"
                className="form-control"
                value={datosNomina.cuenta || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Salario Base</label>
              <input
                type="number"
                name="salario"
                className="form-control"
                value={datosNomina.salario || 0}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Auxilio de Transporte</label>
              <input
                type="number"
                name="auxilio"
                className="form-control"
                value={datosNomina.auxilio || 0}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Horas Extra</label>
              <input
                type="number"
                name="horasExtra"
                className="form-control"
                value={datosNomina.horasExtra || 0}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Bonificaciones</label>
              <input
                type="number"
                name="bonificacion"
                className="form-control"
                value={datosNomina.bonificacion || 0}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Deducciones</label>
              <input
                type="number"
                name="descuentos"
                className="form-control"
                value={datosNomina.descuentos || 0}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm mt-2">
              Guardar Cambios
            </button>
          </form>
          <button className="btn btn-secondary btn-sm mt-3" onClick={onVolver}>
            Volver
          </button>
        </div>
      )}

      {/* Modal de éxito */}
      <div
        id="modalGuardado"
        className="modal fade"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <p className="mb-0">✅ Cambios guardados exitosamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionNomina;
