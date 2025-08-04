import React, { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const GestionNomina = ({ onVolver }) => {
  const [empleados, setEmpleados] = useState([]);
  const [nominas, setNominas] = useState([]);
  const [datosNomina, setDatosNomina] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
  const cargarDatos = async () => {
    if (!empresaId) {
      setMensaje("❌ No se encontró empresa del usuario logueado.");
      return;
    }

    try {
      const urlEmpleados = `http://localhost:3000/api/personas/empresa/${empresaId}`;
      const urlNomina = `http://localhost:3000/api/nomina/empresa/${empresaId}`;

      console.log("📡 URL empleados:", urlEmpleados);
      console.log("📡 URL nómina:", urlNomina);

      const [resEmpleados, resNomina] = await Promise.all([
        fetch(urlEmpleados),
        fetch(urlNomina),
      ]);

      console.log("🔹 Status empleados:", resEmpleados.status);
      console.log("🔹 Status nómina:", resNomina.status);

      if (!resEmpleados.ok || !resNomina.ok) {
        const errorText1 = await resEmpleados.text();
        const errorText2 = await resNomina.text();
        console.error("❌ Respuesta empleados:", errorText1);
        console.error("❌ Respuesta nomina:", errorText2);
        throw new Error("Error al cargar empleados o nómina");
      }

      const empleadosData = await resEmpleados.json();
      const nominasData = await resNomina.json();

      console.log("👀 Empleados recibidos:", empleadosData);
      console.log("👀 Nóminas recibidas:", nominasData);

      setEmpleados(empleadosData);
      setNominas(nominasData);
      setMensaje("");
    } catch (err) {
      console.error("❌ Error cargando datos:", err.message);
      setMensaje("Error al cargar datos");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  cargarDatos();
}, [empresaId]);


  const obtenerNominaEmpleado = (codigo) =>
    nominas.find((n) => String(n.cedula) === String(codigo)) || null;

  const handleEditarClick = (empleado) => {
    const registroExistente = obtenerNominaEmpleado(empleado.codigo);
    if (registroExistente) {
      setDatosNomina(registroExistente);
    } else {
      setDatosNomina({
        nombre: `${empleado.nombre} ${empleado.apellido}`,
        cedula: empleado.codigo,
        cuenta: "",
        salario: 0,
        auxilio: 0,
        horasExtra: 0,
        bonificacion: 0,
        descuentos: 0,
        empresaId,
      });
    }
    setMostrarFormulario(true);
  };

  const handleChange = (e) => {
    setDatosNomina({ ...datosNomina, [e.target.name]: e.target.value });
  };

  const guardarCambiosNomina = async (e) => {
    e.preventDefault();
    const tieneId = Boolean(datosNomina._id);
    const payload = { ...datosNomina, empresaId };

    try {
      const res = await fetch(
        `http://localhost:3000/api/nomina${tieneId ? "/" + datosNomina._id : ""}`,
        {
          method: tieneId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar la nómina");

      const nominasActualizadas = await fetch(
        `http://localhost:3000/api/nomina/empresa/${empresaId}`
      ).then((r) => r.json());
      setNominas(nominasActualizadas);

      const modal = new bootstrap.Modal(document.getElementById("modalGuardado"));
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

        {mensaje && (
          <div className="alert alert-info text-center" role="alert">
            {mensaje}
          </div>
        )}

        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.nombre} {emp.apellido}</td>
                  <td>{emp.codigo}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditarClick(emp)}
                    >
                      {obtenerNominaEmpleado(emp.codigo) ? "Editar Nómina" : "Crear Nómina"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  {empresaId ? "Cargando empleados..." : "Sin empresa asignada"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Formulario y modal permanecen igual */}
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
              <input type="text" name="cuenta" className="form-control" value={datosNomina.cuenta} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Salario Base</label>
              <input type="number" name="salario" className="form-control" value={datosNomina.salario} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Auxilio de Transporte</label>
              <input type="number" name="auxilio" className="form-control" value={datosNomina.auxilio} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Horas Extra</label>
              <input type="number" name="horasExtra" className="form-control" value={datosNomina.horasExtra} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Bonificaciones</label>
              <input type="number" name="bonificacion" className="form-control" value={datosNomina.bonificacion} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Deducciones</label>
              <input type="number" name="descuentos" className="form-control" value={datosNomina.descuentos} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success btn-sm mt-2">
              Guardar Cambios
            </button>
          </form>
          <button className="btn btn-secondary btn-sm mt-3" onClick={() => setMostrarFormulario(false)}>
            Cancelar
          </button>
        </div>
      )}

      <div id="modalGuardado" className="modal fade" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <p className="mb-0">✅ Cambios guardados exitosamente</p>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary mb-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </div>
  );
};

export default GestionNomina;
