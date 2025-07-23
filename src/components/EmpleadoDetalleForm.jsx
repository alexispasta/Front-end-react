import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmpleadoDetalleForm = ({ onVolver }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const archivoRef = useRef(null);
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {
    // Simulando una búsqueda del empleado
    const empleadosFicticios = [
      { id: 1, nombre: 'Juan Pérez', documento: '123456789', fecha: '2023-01-01', estado: 'activo', correo: 'juan@correo.com', salario: 3000, cargo: 'Developer', eps: 'Sura' },
      { id: 2, nombre: 'María García', documento: '987654321', fecha: '2022-12-01', estado: 'inactivo', correo: 'maria@correo.com', salario: 2800, cargo: 'Diseñadora', eps: 'Nueva EPS' }
    ];

    const encontrado = empleadosFicticios.find(e => e.id.toString() === id);
    setEmpleado(encontrado);
  }, [id]);

  if (!empleado) return <div>Cargando datos del empleado...</div>;

  return (
    <div className="mt-4 bg-light p-4 rounded shadow-sm">
      <h6>Información del empleado</h6>
      <form>
        <div className="mb-2">
          <label>ID del empleado (no editable)</label>
          <input type="text" className="form-control" value={empleado.id} disabled />
        </div>
        <div className="mb-2">
          <label>Nombre</label>
          <input type="text" className="form-control" defaultValue={empleado.nombre} />
        </div>
        <div className="mb-2">
          <label>Documento</label>
          <input type="text" className="form-control" defaultValue={empleado.documento} />
        </div>
        <div className="mb-2">
          <label>Fecha de contratación</label>
          <input type="date" className="form-control" defaultValue={empleado.fecha} />
        </div>
        <div className="mb-2">
          <label>Estado</label>
          <select className="form-control" defaultValue={empleado.estado}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Correo electrónico</label>
          <input type="email" className="form-control" defaultValue={empleado.correo} />
        </div>
        <div className="mb-2">
          <label>Salario</label>
          <input type="number" className="form-control" defaultValue={empleado.salario} />
        </div>
        <div className="mb-2">
          <label>Cargo</label>
          <input type="text" className="form-control" defaultValue={empleado.cargo} />
        </div>
        <div className="mb-2">
          <label>EPS</label>
          <input type="text" className="form-control" defaultValue={empleado.eps} />
        </div>

        <button type="submit" className="btn btn-success btn-sm mt-2">
          Guardar Cambios
        </button>

        <button
          type="button"
          className="btn btn-info btn-sm mt-2 ms-2"
          onClick={() => archivoRef.current?.click()}
        >
          Cargar Documentos
        </button>

        <button type="button" className="btn btn-warning btn-sm mt-2 ms-2">
          Descargar Documentos
        </button>

        <input
          type="file"
          ref={archivoRef}
          style={{ display: 'none' }}
          onChange={() => alert('Archivo cargado')}
        />
      </form>

      <button className="btn btn-secondary" onClick={onVolver}>Volver</button>
    </div>
  );
};

export default EmpleadoDetalleForm;
