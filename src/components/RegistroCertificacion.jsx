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

  const handleUpload = async () => {
    if (!nombre) return alert("⚠️ Debes ingresar el nombre del certificado");

    const nuevoCertificado = {
      personaId,
      empresaId,
      nombre,
      archivoUrl: archivo ? archivo.name : "", // solo el nombre, luego se puede hacer upload real
    };

    const res = await fetch("http://localhost:3000/api/certificados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCertificado),
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

  return (
    <div className="section-content mt-4">
      <section className="asistencia-section p-4 bg-light rounded shadow-sm">
        <h2 className="mb-4">Gestión de Certificaciones</h2>

        <ul className="list-group mb-3">
          {certificados.map((certificado) => (
            <li key={certificado._id} className="list-group-item">
              {certificado.nombre} - Subido el {new Date(certificado.fecha).toLocaleDateString()}
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
          <label className="form-label">Cargar archivo</label>
          <input type="file" className="form-control" onChange={(e) => setArchivo(e.target.files[0])} />
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
