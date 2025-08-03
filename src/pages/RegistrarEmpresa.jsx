import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarEmpresa = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1️⃣ Registrar la empresa
      const empresaData = {
        nombre: data.nombreEmpresa,
        correo: data.correoEmpresa,
        password: data.passwordEmpresa,
        pais: data.pais,
        telefono: data.telefonoEmpresa,
        direccion: data.direccionEmpresa
      };

      const resEmpresa = await fetch("http://localhost:3000/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresaData),
      });

      if (!resEmpresa.ok) throw new Error("Error al registrar empresa");

      const empresa = await resEmpresa.json();

      // 2️⃣ Registrar la persona gerente
      const personaData = {
        nombre: data.nombrePersona,
        apellido: data.apellido,
        email: data.email,
        password: data.passwordPersona,
        telefono: data.telefonoPersona,
        direccion: data.direccionPersona,
        codigo: empresa.codigo || data.codigo, // si tu API retorna código de empresa
        rol: "gerente",
        fecha: data.fecha,
        ciudad: data.ciudad
      };

      const resPersona = await fetch("http://localhost:3000/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personaData),
      });

      if (!resPersona.ok) throw new Error("Error al registrar persona gerente");

      alert("✅ Empresa y gerente registrados correctamente");
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="container-form">
        <h2 className="text-center">Registro Empresa y Gerente</h2>
        <form onSubmit={handleSubmit}>
          <h4 className="mt-3 mb-2">Datos de la Empresa</h4>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Nombre de Empresa</label>
              <input type="text" className="form-control" name="nombreEmpresa" required />
            </div>
            <div className="col">
              <label className="form-label">Correo Empresa</label>
              <input type="email" className="form-control" name="correoEmpresa" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña Empresa</label>
            <input type="password" className="form-control" name="passwordEmpresa" required />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">País</label>
              <input type="text" className="form-control" name="pais" required />
            </div>
            <div className="col">
              <label className="form-label">Teléfono Empresa</label>
              <input type="tel" className="form-control" name="telefonoEmpresa" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección Empresa</label>
            <input type="text" className="form-control" name="direccionEmpresa" required />
          </div>

          <hr />
          <h4 className="mt-3 mb-2">Datos del Gerente</h4>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Nombres</label>
              <input type="text" className="form-control" name="nombrePersona" required />
            </div>
            <div className="col">
              <label className="form-label">Apellidos</label>
              <input type="text" className="form-control" name="apellido" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="passwordPersona" required />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Teléfono</label>
              <input type="tel" className="form-control" name="telefonoPersona" required />
            </div>
            <div className="col">
              <label className="form-label">Dirección</label>
              <input type="text" className="form-control" name="direccionPersona" required />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Fecha de Nacimiento</label>
              <input type="date" className="form-control" name="fecha" required />
            </div>
            <div className="col">
              <label className="form-label">Ciudad</label>
              <input type="text" className="form-control" name="ciudad" required />
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">Registrar Empresa y Gerente</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEmpresa;
