// src/components/GestionNomina.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const GestionNomina = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datosNomina, setDatosNomina] = useState({});

  const handleEditarClick = (e) => {
    const button = e.currentTarget;

    setDatosNomina({
      nombre: button.dataset.nombre,
      cedula: button.dataset.cedula,
      cuenta: button.dataset.cuenta,
      salario: button.dataset.salario,
      auxilio: button.dataset.auxilio,
      horasExtra: button.dataset.horas_extra,
      bonificacion: button.dataset.bonificacion,
      descuentos: button.dataset.descuentos,
    });

    setMostrarFormulario(true);
  };

  const guardarCambiosNomina = (e) => {
    e.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById('modalGuardado'));
    modal.show();
  };

  const volverAlMenu = () => {
    setMostrarFormulario(false);
  };

  return (
    <div id="nomina" className="section-content mt-4">
      <section className="nomina-section p-4 bg-white rounded shadow-sm mt-5">
        <h2 className="mb-4">Gestión de Nómina</h2>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>12345678</td>
              <td>
                <button
                  className="btn btn-primary btn-sm editar-nomina-btn"
                  data-id="1"
                  data-nombre="Juan Pérez"
                  data-cedula="12345678"
                  data-cuenta="1234567890"
                  data-salario="2500000"
                  data-auxilio="140606"
                  data-horas_extra="4"
                  data-bonificacion="50000"
                  data-descuentos="20000"
                  onClick={handleEditarClick}
                >
                  Editar Nómina
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {mostrarFormulario && (
        <div id="infoNomina" className="mt-4 bg-light p-4 rounded shadow-sm">
          <h6>Información de Nómina</h6>
          <form onSubmit={guardarCambiosNomina}>
            <div className="mb-2">
              <label>Nombre</label>
              <input type="text" className="form-control" value={datosNomina.nombre} disabled />
            </div>
            <div className="mb-2">
              <label>Cédula</label>
              <input type="text" className="form-control" value={datosNomina.cedula} disabled />
            </div>
            <div className="mb-2">
              <label>Cuenta Bancaria</label>
              <input type="text" className="form-control" value={datosNomina.cuenta} disabled />
            </div>
            <div className="mb-2">
              <label>Salario Base</label>
              <input
                type="number"
                className="form-control"
                defaultValue={datosNomina.salario}
              />
            </div>
            <div className="mb-2">
              <label>Auxilio de Transporte</label>
              <input
                type="number"
                className="form-control"
                defaultValue={datosNomina.auxilio}
              />
            </div>
            <div className="mb-2">
              <label>Horas Extra</label>
              <input
                type="number"
                className="form-control"
                defaultValue={datosNomina.horasExtra}
              />
            </div>
            <div className="mb-2">
              <label>Bonificaciones</label>
              <input
                type="number"
                className="form-control"
                defaultValue={datosNomina.bonificacion}
              />
            </div>
            <div className="mb-2">
              <label>Deducciones</label>
              <input
                type="number"
                className="form-control"
                defaultValue={datosNomina.descuentos}
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm mt-2">
              Guardar Cambios
            </button>
          </form>
          <button className="btn btn-secondary btn-sm mt-3" onClick={volverAlMenu}>
            Volver
          </button>
        </div>
      )}

      {/* Modal de éxito */}
      <div id="modalGuardado" className="modal fade" tabIndex="-1" aria-hidden="true">
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
