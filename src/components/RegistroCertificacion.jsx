import React, { useEffect, useState } from "react";

const RegistroCertificacion = ({ personaId, empresaId, onVolver }) => {
  const [certificados, setCertificados] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [nombre, setNombre] = useState("");

  // 🔹 Cargar certificados al inicio
  useEffect(() => {
    fetch(`http://localhost:3000/api/certificados/persona/${personaId}`)
      .then((res) => res.json())
      .then((data) => setCertificados(data));
  }, [personaId]);

  // 🔹 Subir nuevo certificado
  const handleUpload = async () => {
    if (!nombre || !archivo) return alert("⚠️ Debes ingresar nombre y seleccionar archivo");

    const formData = new FormData();
    formData.append("personaId", personaId);
    formData.append("empresaId", empresaId);
    formData.append("nombre", nombre);
    formData.append("archivo", archivo);

    const res = await fetch("http://localhost:3000/api/certificados", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setCertificados([...certificados, data.certificado]);
      setNombre("");
      setArchivo(null);
      alert("✅ Certificado guardado correctamente");
    } else {
      alert("❌ Error al guardar el certificado");
    }
  };

  // 🔹 Eliminar certificado
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este certificado?")) return;

    const res = await fetch(`http://localhost:3000/api/certificados/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCertificados(certificados.filter((c) => c._id !== id));
      alert("❌ Certificado eliminado");
    } else {
      alert("❌ Error al eliminar");
    }
  };

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Certificaciones</h2>

        <ul className="list-group mb-3">
          {certificados.map((certificado) => (
            <li key={certificado._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{certificado.nombre}</strong> - Subido el{" "}
                {new Date(certificado.fecha).toLocaleDateString()}
              </div>
              <div>
                <a
                  href={`http://localhost:3000${certificado.archivoUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-success me-2"
                >
                  Ver/Descargar
                </a>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(certificado._id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mb-3">
          <label className="form-label">Nombre del certificado</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
  <label htmlFor="fileInput" className="form-label">
    Cargar archivo
  </label>
  <input
    id="fileInput"
    className="form-control"
    type="file"
    onChange={(e) => setArchivo(e.target.files[0])}
  />
</div>


        <button className="btn btn-primary me-2" onClick={handleUpload}>
          Guardar certificado
        </button>
      </section>

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        ← Volver al Menú
      </button>
    </div>
  );
};

export default RegistroCertificacion;
