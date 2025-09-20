import React, { useState, useEffect } from "react";

const GestionReportes = ({ onVolver }) => {
  const [empleados, setEmpleados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const empresaId = localStorage.getItem("empresaId");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!empresaId) throw new Error("No se encontró empresa en el usuario logueado");

        const [resEmpleados, resReportes] = await Promise.all([
          fetch(`http://localhost:3000/api/personas/empresa/${empresaId}`),
          fetch(`http://localhost:3000/api/reportes/empresa/${empresaId}`)
        ]);

        if (!resEmpleados.ok || !resReportes.ok)
          throw new Error("Error al cargar datos");

        setEmpleados(await resEmpleados.json());
        setHistorial(await resReportes.json());
      } catch (err) {
        setMensaje({ tipo: "error", texto: err.message });
      }
    };
    cargarDatos();
  }, [empresaId]);

  const enviarReporte = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const nuevoReporte = {
        asunto,
        descripcion: texto,
        personaId: empleadoSeleccionado._id,
        empresaId
      };

      const res = await fetch("http://localhost:3000/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReporte),
      });

      if (!res.ok) throw new Error("Error al enviar reporte");

      const dataActualizada = await fetch(
        `http://localhost:3000/api/reportes/empresa/${empresaId}`
      ).then((r) => r.json());
      setHistorial(dataActualizada);

      setAsunto("");
      setTexto("");
      setEmpleadoSeleccionado(null);
      setMensaje({ tipo: "exito", texto: "Reporte enviado correctamente ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const consultarReporte = async () => {
    if (!reporteSeleccionado) return setMensaje({ tipo: "error", texto: "Seleccione un reporte" });

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/${reporteSeleccionado}`);
      if (!res.ok) throw new Error("Error al consultar reporte");
      const data = await res.json();
      alert(`📌 Asunto: ${data.asunto}\n\n📝 Descripción:\n${data.descripcion}`);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const eliminarReporte = async () => {
    if (!reporteSeleccionado) return setMensaje({ tipo: "error", texto: "Seleccione un reporte" });
    if (!window.confirm("¿Seguro que desea eliminar este reporte?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/${reporteSeleccionado}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar reporte");

      const dataActualizada = await fetch(
        `http://localhost:3000/api/reportes/empresa/${empresaId}`
      ).then((r) => r.json());
      setHistorial(dataActualizada);

      setReporteSeleccionado(null);
      setMensaje({ tipo: "exito", texto: "Reporte eliminado ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  const eliminarTodos = async () => {
    if (!window.confirm("⚠️ Esto eliminará TODOS los reportes. ¿Seguro?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/empresa/${empresaId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar todos los reportes");

      setHistorial([]);
      setReporteSeleccionado(null);
      setMensaje({ tipo: "exito", texto: "Todos los reportes eliminados ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="mt-4">
      <h5>Gestión de Reportes</h5>

      {mensaje.texto && (
        <div className={`alert ${mensaje.tipo === "exito" ? "alert-success" : "alert-danger"}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          {!empleadoSeleccionado ? (
            <>
              <h6>Empleados</h6>
              <ul className="list-group mb-3">
                {empleados.length > 0 ? (
                  empleados.map((emp) => (
                    <li
                      key={emp._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {emp.nombre} {emp.apellido} ({emp.codigo})
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setEmpleadoSeleccionado(emp)}
                      >
                        Crear Informe
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">
                    {empresaId ? "No hay empleados" : "Sin empresa asignada"}
                  </li>
                )}
              </ul>
            </>
          ) : (
            <div className="mt-4 p-3 border rounded bg-light">
              <h6>Nuevo reporte para {empleadoSeleccionado.nombre}</h6>
              <form onSubmit={enviarReporte}>
                <div className="mb-2">
                  <label htmlFor="asunto">Asunto</label>
                  <input
                    id="asunto"
                    type="text"
                    className="form-control"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    className="form-control"
                    rows="4"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success btn-sm me-2">
                  Guardar Informe
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEmpleadoSeleccionado(null)}
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h6>Historial de Reportes</h6>
          <ul className="list-group mb-3">
            {historial.length > 0 ? (
              historial.map((r) => (
                <li key={r._id} className="list-group-item">
                  <input
                    type="radio"
                    name="reporteSeleccionado"
                    value={r._id}
                    data-testid={`checkbox-${r._id}`}  // ✅ atributo agregado para tests
                    checked={reporteSeleccionado === r._id}
                    onChange={() => setReporteSeleccionado(r._id)}
                  />{" "}
                  <strong>{r.asunto}</strong> -{" "}
                  {r.personaId?.nombre
                    ? `${r.personaId.nombre} ${r.personaId.apellido}`
                    : "Empleado desconocido"}{" "}
                  <br />
                  <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">
                No hay reportes registrados
              </li>
            )}
          </ul>

          <button className="btn btn-primary w-100 mb-2" onClick={consultarReporte}>
            Consultar
          </button>
          <button className="btn btn-danger w-100 mb-2" onClick={eliminarReporte}>
            Eliminar Seleccionado
          </button>
          <button className="btn btn-warning w-100" onClick={eliminarTodos}>
            Eliminar Todos
          </button>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default GestionReportes;
