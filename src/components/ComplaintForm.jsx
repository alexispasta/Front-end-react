import React, { useState } from "react";

export default function QuejasSugerenciasForm({ onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ asunto: "", mensaje: "" });
  const [mensajeServidor, setMensajeServidor] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/quejas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al enviar la queja o sugerencia");

      const data = await res.json();
      setMensajeServidor(data.message || "¡Mensaje enviado correctamente!");
      setSubmitted(true);
      setForm({ asunto: "", mensaje: "" });

      setTimeout(() => {
        setSubmitted(false);
        setMensajeServidor("");
      }, 4000);
    } catch (error) {
      setMensajeServidor(error.message);
      setSubmitted(true);
    }
  };

  return (
    <div className="section-content mt-4">
      <h5>Quejas y Sugerencias</h5>
      <p>Envíanos tus comentarios para mejorar el sistema.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="asunto" className="form-label">Asunto:</label>
          <input
            id="asunto"
            type="text"
            name="asunto"
            className="form-control"
            value={form.asunto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            className="form-control"
            rows="4"
            value={form.mensaje}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Enviar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onBack}>Volver</button>
      </form>

      {submitted && <div className="alert alert-info mt-3">{mensajeServidor}</div>}
    </div>
  );
}
