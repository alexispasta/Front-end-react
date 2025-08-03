// src/pages/RegistrarEmpresa.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarEmpresa = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    pais: '',
    telefono: '',
    direccion: '',
  });

  // ✅ Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Error al registrar empresa");

      alert("Empresa registrada correctamente");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="container-form">
        <h2 className="text-center">Registro Empresa</h2>
        <div className="profile-pic mb-3">👤</div>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="nombre" className="form-label">Nombre de Empresa</label>
              <input type="text" className="form-control" id="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="col">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" id="correo" value={form.correo} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="pais" className="form-label">País</label>
            <input type="text" className="form-control" id="pais" value={form.pais} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="tel" className="form-control" id="telefono" value={form.telefono} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control" id="direccion" value={form.direccion} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-dark w-100">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEmpresa;
