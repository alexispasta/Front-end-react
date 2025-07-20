import { useState } from "react";
import "../styles/style.css";

export default function ComplaintForm({ onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    setSubmitted(true);
    setForm({ asunto: "", mensaje: "" }); // limpiar
  };

  return (
    <div className="section-content mt-4">
      <h5>Quejas y sugerencias</h5>
      <p>Envíanos tus comentarios para mejorar el sistema.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Asunto:</label>
          <input
            type="text"
            name="asunto"
            className="form-control"
            value={form.asunto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje:</label>
          <textarea
            name="mensaje"
            className="form-control"
            rows="4"
            value={form.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onBack}>
          Volver
        </button>
      </form>

      {submitted && (
        <div className="alert alert-success mt-3">
          ¡Gracias por tu mensaje! Ha sido enviado correctamente.
        </div>
      )}
    </div>
  );
}
