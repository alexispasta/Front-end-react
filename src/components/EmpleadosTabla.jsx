import React, { useState, useEffect } from "react";
import RegistroCertificacion from "./RegistroCertificacion"; // Importar componente de certificados

const EmpleadosTabla = ({ onVolver }) => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [empleadoCertificados, setEmpleadoCertificados] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const empresaId = localStorage.getItem("empresaId");

  // 🔹 Cargar empleados de la empresa
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        if (!empresaId) throw new Error("No se encontró empresa del usuario logueado");

        const res = await fetch(`http://localhost:3000/api/personas/empresa/${empresaId}`);
        if (!res.ok) throw new Error("Error al cargar empleados");

        const data = await res.json();
        setEmpleados(data);
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };
    cargarEmpleados();
  }, [empresaId]);

  // 🔹 Guardar cambios
  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/personas/${empleadoEditando._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empleadoEditando),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar empleado");

      const dataActualizada = await fetch(
        `http://localhost:3000/api/personas/empresa/${empresaId}`
      ).then((r) => r.json());

      setEmpleados(dataActualizada);
      setEmpleadoEditando(null);
      setMensaje({ tipo: "exito", texto: "Empleado actualizado correctamente ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Eliminar empleado
  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/personas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar empleado");

      setEmpleados(empleados.filter((e) => e._id !== id));
      setMensaje({ tipo: "exito", texto: "Empleado eliminado correctamente ❌" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  // 🔹 Mostrar certificados de un empleado
  const verCertificados = (empleado) => {
    setEmpleadoCertificados(empleado);
    setEmpleadoEditando(null);
  };

  return (
    <section className="empleados-section p-4 bg-white rounded shadow-sm mt-5">
      <h2 className="mb-4">Gestión de Empleados</h2>

      {mensaje.texto && (
        <div
          className={`alert ${
            mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Documento/Código</th>
            <th>Rol</th>
            <th>Ciudad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length > 0 ? (
            empleados.map((empleado) => (
              <tr key={empleado._id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido}</td>
                <td>{empleado.email}</td>
                <td>{empleado.telefono}</td>
                <td>{empleado.codigo}</td>
                <td>{empleado.rol}</td>
                <td>{empleado.ciudad}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => setEmpleadoEditando({ ...empleado })}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => eliminarEmpleado(empleado._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => verCertificados(empleado)}
                  >
                    Certificados
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                {empresaId ? "No hay empleados" : "Sin empresa asignada"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Formulario de edición */}
      {empleadoEditando && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h6>Editando: {empleadoEditando.nombre}</h6>
          <form onSubmit={guardarCambios}>
            {[
  "nombre",
  "apellido",
  "email",
  "telefono",
  "direccion",
  "codigo",
  "rol",
  "fecha",
  "ciudad",
].map((campo) => (
  <div className="mb-2" key={campo}>
    <label htmlFor={campo}>
      {campo.charAt(0).toUpperCase() + campo.slice(1)}
    </label>
    <input
      id={campo}
      type="text"
      className="form-control"
      value={empleadoEditando[campo] || ""}
      onChange={(e) =>
        setEmpleadoEditando({
          ...empleadoEditando,
          [campo]: e.target.value,
        })
      }
    />
  </div>
))}

            <button type="submit" className="btn btn-success btn-sm me-2">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEmpleadoEditando(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* 🔹 Sección de certificados */}
      {empleadoCertificados && (
        <RegistroCertificacion
          personaId={empleadoCertificados._id}
          empresaId={empresaId}
          onVolver={() => setEmpleadoCertificados(null)}
        />
      )}

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </section>
  );
};

export default EmpleadosTabla;
