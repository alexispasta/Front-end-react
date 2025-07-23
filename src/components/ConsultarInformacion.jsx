import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultarInformacion = ({ onVolver }) => {

  const navigate = useNavigate();

  const volver = () => {
    navigate('/empleado');
  };

  return (
    <div className="section-content mt-4">
      <h5>Consultar Información</h5>
      <form>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre completo</label>
            <input type="text" className="form-control" value="Juan Carlos Gómez" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Documento</label>
            <input type="text" className="form-control" value="123456789" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">ID</label>
            <input type="text" className="form-control" value="EMP1023" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de contratación</label>
            <input type="date" className="form-control" value="2021-04-15" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Estado</label>
            <input type="text" className="form-control" value="Activo" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" value="juan.gomez@example.com" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Salario</label>
            <input type="text" className="form-control" value="$3.000.000" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cargo</label>
            <input type="text" className="form-control" value="Analista de Datos" readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">EPS</label>
            <input type="text" className="form-control" value="Sanitas" readOnly />
          </div>
        </div>

        <h6 className="mt-4">Historial de Reportes</h6>
        <ul className="list-group mb-3">
          <li className="list-group-item">Reporte 1: Ausencia justificada - 2023-08-21</li>
          <li className="list-group-item">Reporte 2: Llegada tardía - 2023-10-03</li>
        </ul>
      </form>

      <button className="btn btn-secondary" onClick={onVolver}>Volver</button>

    </div>
  );
};

export default ConsultarInformacion;
