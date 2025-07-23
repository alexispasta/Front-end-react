import React, { useState } from 'react';

const InformacionCuentaForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    ciudad: ''
  });

  const [mensajeVisible, setMensajeVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const guardarCambiosCuenta = (e) => {
    e.preventDefault();
    console.log('Datos guardados:', formData);
    setMensajeVisible(true);
    setTimeout(() => setMensajeVisible(false), 3000);
  };

  return (
    <div className="section-content mt-4">
      <h5>Información de Cuenta</h5>
      <p>Consulta y modifica los datos de tu cuenta.</p>

      <form onSubmit={guardarCambiosCuenta}>
        <div className="mb-3">
          <label className="form-label">Nombres actuales: <strong>Juan Carlos</strong></label>
          <input type="text" className="form-control" id="nombres" placeholder="Nuevos nombres" value={formData.nombres} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos actuales: <strong>Gómez Rodríguez</strong></label>
          <input type="text" className="form-control" id="apellidos" placeholder="Nuevos apellidos" value={formData.apellidos} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico actual: <strong>juan.gomez@example.com</strong></label>
          <input type="email" className="form-control" id="correo" placeholder="Nuevo correo electrónico" value={formData.correo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono actual: <strong>3216549870</strong></label>
          <input type="text" className="form-control" id="telefono" placeholder="Nuevo teléfono" value={formData.telefono} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección actual: <strong>Calle 45 #12-34</strong></label>
          <input type="text" className="form-control" id="direccion" placeholder="Nueva dirección" value={formData.direccion} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento actual: <strong>1990-06-15</strong></label>
          <input type="date" className="form-control" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Ciudad actual: <strong>Bogotá</strong></label>
          <input type="text" className="form-control" id="ciudad" placeholder="Nueva ciudad" value={formData.ciudad} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Guardar cambios</button>
        
      </form>

      {mensajeVisible && (
        <div className="alert alert-success mt-3">
          ¡Los cambios han sido guardados exitosamente!
        </div>
      )}
    </div>
  );
};

export default InformacionCuentaForm;
