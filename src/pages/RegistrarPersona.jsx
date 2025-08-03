import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarPersona = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const persona = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("http://localhost:3000/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona),
      });

      if (!res.ok) throw new Error("Error al registrar persona");

      alert("Persona registrada correctamente");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar persona");
    }
  };

  return (
    <div className="container mt-5">
      <div className="container-form">
        <h2 className="text-center">Registro Persona</h2>
        <div className="profile-pic mb-3">👤</div>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="nombre" className="form-label">Nombres</label>
              <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Ingrese su nombre" required />
            </div>
            <div className="col">
              <label htmlFor="apellido" className="form-label">Apellidos</label>
              <input type="text" className="form-control" id="apellido" name="apellido" placeholder="Ingrese su apellido" required />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" id="email" name="email" placeholder="correo@ejemplo.com" required />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Ingrese su contraseña" required />
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="tel" className="form-control" id="telefono" name="telefono" placeholder="Ingrese su teléfono" required />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control" id="direccion" name="direccion" placeholder="Ingrese su dirección" required />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="codigo" className="form-label">Código de empresa</label>
              <input type="text" className="form-control" id="codigo" name="codigo" placeholder="Ingrese código" />
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
              <input type="text" className="form-control" id="ciudad" name="ciudad" placeholder="Ingrese su ciudad" required />
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarPersona;
