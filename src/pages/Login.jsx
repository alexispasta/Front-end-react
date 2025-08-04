import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import miLogo from '../../src/assets/mi_logo.png';

const Login = ({ onLogin = () => {} }) => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      // 🔹 Soporte para ambos formatos
      const userId = data.usuario?._id || data.userId;
      const rol = data.usuario?.rol || data.rol;

      if (!userId || !rol) throw new Error("Respuesta inválida del servidor");

      // ✅ Guardamos en localStorage
      localStorage.setItem("usuarioId", userId);
      localStorage.setItem("rol", rol);

      onLogin();

      // ✅ Redirección según rol
      switch (rol) {
        case "empleado": navigate("/empleado/inicio"); break;
        case "rrhh": navigate("/rrhh/inicio"); break;
        case "gerente": navigate("/gerente/inicio"); break;
        case "supervisor": navigate("/supervisor/inicio"); break;
        default: setError("Rol no reconocido");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------- Vistas ----------
  const renderLogin = () => (
    <form onSubmit={handleLoginClick}>
      <h2 className="text-2xl font-semibold mb-6 text-black">Ingresar</h2>
      {error && <div className="text-red-500 text-center mb-3">{error}</div>}

      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input
        type="email"
        placeholder="usuario@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 text-black"
        required
      />

      <label className="text-sm text-black mb-1">Contraseña</label>
      <input
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 text-black"
        required
      />

      <button type="submit" className="w-full bg-black text-white py-2 rounded mb-4">
        Iniciar Sesión
      </button>

      <div className="flex flex-col items-center space-y-2">
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setView('recuperar')}
        >
          ¿Olvidaste tu contraseña?
        </button>
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setView('crear')}
        >
          ¿Deseas registrar una empresa?
        </button>
      </div>
    </form>
  );

  const renderCrear = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-black text-center">Registro de Empresa</h2>
      <p className="text-black text-center mb-4">
        Si aún no tienes una empresa registrada en el sistema, puedes hacerlo aquí. 
        El primer usuario creado será el <strong>Gerente</strong> de la empresa.
      </p>

      <button
        className="w-full bg-black text-white py-2 rounded mb-6"
        onClick={() => navigate('/registrar-empresa')}
      >
        Registrar Empresa
      </button>

      <button onClick={() => setView('login')} className="text-black hover:underline">← Volver</button>
    </>
  );

  const renderRecuperar = () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-semibold mb-6 text-black text-center">Recuperar contraseña</h2>
      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input
        type="email"
        value={recoveryEmail}
        onChange={(e) => setRecoveryEmail(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 mb-4 text-black"
      />
      <button type="submit" className="w-full bg-black text-white py-2 rounded mb-4">Enviar</button>
      <button type="button" onClick={() => setView('login')} className="text-black hover:underline">← Volver</button>
    </form>
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full h-full shadow-lg rounded-none overflow-hidden">
        {/* Sección izquierda - Logo y descripción */}
        <div className="flex-1 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-black flex flex-col items-center justify-center p-10">
          <img
            src={miLogo}
            alt="Logo"
            className="mx-auto mb-6 object-contain"
            style={{ width: '280px', height: '280px' }}
          />
          <h2 className="text-xl font-bold text-center">SISTEMA DE GESTIÓN DE RECURSOS HUMANOS</h2>
          <p className="text-sm text-center mt-2">Optimiza el control de tu empresa con nuestra plataforma profesional.</p>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="flex-1 bg-white flex flex-col justify-center p-10 overflow-y-auto">
          {view === 'login' && renderLogin()}
          {view === 'crear' && renderCrear()}
          {view === 'recuperar' && renderRecuperar()}
        </div>
      </div>
    </div>
  );
};

export default Login;
