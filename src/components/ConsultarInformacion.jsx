import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultarInformacion = ({ onVolver }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [mensaje, setMensaje] = useState('');

  const usuarioId = localStorage.getItem('usuarioId');
  

  useEffect(() => {
    if (!usuarioId) {
      alert('No se encontró usuario logueado.');
      navigate('/login');
      return;
    }

    const cargarUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/personas/${usuarioId}`);
        if (!res.ok) throw new Error('Error al obtener información del usuario');

        const data = await res.json();
        const userData = {
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          ciudad: data.ciudad || '',
          fecha: data.fecha ? data.fecha.slice(0, 10) : '',
          rol: data.rol || '',
          codigo: data.codigo || ''
        };
        setUsuario(userData);

        // Inputs vacíos inicialmente
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          fecha: ''
        });
      } catch (error) {
        console.error('❌ Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [usuarioId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    // Si no escribe nada en un campo, mantiene el valor actual
    const datosActualizados = { ...usuario };
    for (let campo in formData) {
      if (formData[campo] !== '') {
        datosActualizados[campo] = formData[campo];
      }
    }

    try {
      const res = await fetch(`http://localhost:3000/api/personas/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');

      setUsuario(datosActualizados);
      setMensaje('✅ Información actualizada correctamente.');
      setEditando(false);

      // Vaciar inputs para la próxima edición
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        fecha: ''
      });
    } catch (error) {
      console.error('❌ Error al guardar:', error.message);
      setMensaje('❌ Error al actualizar la información.');
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      fecha: ''
    });
  };

  if (loading) return <div className="mt-4 text-center">Cargando información...</div>;
  if (!usuario) return <div className="mt-4 text-center text-danger">No se pudo cargar la información del usuario.</div>;

  const campos = [
    { label: 'Nombres', name: 'nombre', type: 'text', placeholder: 'Nuevos nombres' },
    { label: 'Apellidos', name: 'apellido', type: 'text', placeholder: 'Nuevos apellidos' },
    { label: 'Correo Electrónico', name: 'email', type: 'email', placeholder: 'Nuevo correo electrónico' },
    { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: 'Nuevo teléfono' },
    { label: 'Dirección', name: 'direccion', type: 'text', placeholder: 'Nueva dirección' },
    { label: 'Fecha de Nacimiento', name: 'fecha', type: 'date', placeholder: '' },
    { label: 'Ciudad', name: 'ciudad', type: 'text', placeholder: 'Nueva ciudad' },
  ];

  return (
    <div className="section-content mt-4">
      <h5>Información de Cuenta</h5>
      <p>Consulta y modifica los datos de tu cuenta.</p>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleGuardar}>
        {campos.map((campo, i) => (
          <div key={i} className="mb-3">
            <label className="form-label">
              {campo.label} actual: <strong>{usuario[campo.name] || '—'}</strong>
            </label>
            <input
              type={campo.type}
              className="form-control"
              name={campo.name}
              placeholder={campo.placeholder}
              value={formData[campo.name]}
              onChange={handleChange}
              disabled={!editando}  // ✅ Ahora se deshabilitan solo si NO estamos editando
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Rol: <strong>{usuario.rol || '—'}</strong></label>
          <input type="text" className="form-control" value={usuario.rol} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Código de empresa: <strong>{usuario.codigo || '—'}</strong></label>
          <input type="text" className="form-control" value={usuario.codigo} readOnly />
        </div>

        <div className="mt-3">
          {!editando ? (
            <button type="button" className="btn btn-primary me-2" onClick={() => setEditando(true)}>
              Editar
            </button>
          ) : (
            <>
              <button type="submit" className="btn btn-success me-2">
                Guardar Cambios
              </button>
              <button type="button" className="btn btn-warning me-2" onClick={handleCancelar}>
                Cancelar
              </button>
            </>
          )}
          <button type="button" className="btn btn-secondary" onClick={onVolver}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultarInformacion;
