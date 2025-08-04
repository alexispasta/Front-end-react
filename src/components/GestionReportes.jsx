import React, { useState, useEffect } from "react";

const GestionReportes = ({ onVolver }) => {
  const [empleados, setEmpleados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 🔹 Cargar empleados y reportes
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resEmpleados, resReportes] = await Promise.all([
          fetch("http://localhost:3000/api/personas"),
          fetch("http://localhost:3000/api/reportes"),
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
  }, []);

  // 🔹 Enviar reporte
  const enviarReporte = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    try {
      const nuevoReporte = {
        asunto,
        descripcion: texto,
        empleadoId: empleadoSeleccionado._id,
      };

      const res = await fetch("http://localhost:3000/api/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReporte),
      });

      if (!res.ok) throw new Error("Error al enviar reporte");

      // 🔹 Recargar historial
      const dataActualizada = await fetch("http://localhost:3000/api/reportes").then((r) =>
        r.json()
      );
      setHistorial(dataActualizada);

      // ✅ Limpiar formulario y mostrar mensaje
      setAsunto("");
      setTexto("");
      setEmpleadoSeleccionado(null);
      setMensaje({ tipo: "exito", texto: "Reporte enviado correctamente ✅" });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="mt-4">
      <h5>Gestión de Reportes</h5>

      {mensaje.texto && (
        <div
          className={`alert ${
            mensaje.tipo === "exito" ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="row">
        {/* 🔹 Columna izquierda: listado o formulario */}
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
                      {emp.nombre} {emp.apellido} ({emp.documento})
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
                    No hay empleados
                  </li>
                )}
              </ul>
            </>
          ) : (
            <div className="mt-4 p-3 border rounded bg-light">
              <h6>Nuevo reporte para {empleadoSeleccionado.nombre}</h6>
              <form onSubmit={enviarReporte}>
                <div className="mb-2">
                  <label>Asunto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Descripción</label>
                  <textarea
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

        {/* 🔹 Columna derecha: historial */}
        <div className="col-md-6">
          <h6>Historial de Reportes</h6>
          <ul className="list-group mb-3">
            {historial.length > 0 ? (
              historial.map((r) => (
                <li key={r._id} className="list-group-item">
                  <strong>{r.asunto}</strong> -{" "}
                  {r.empleadoId?.nombre || "Empleado desconocido"} <br />
                  <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">
                No hay reportes registrados
              </li>
            )}
          </ul>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
};

export default GestionReportes;
