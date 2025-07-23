  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import miLogo from '../../src/assets/mi_logo.png';

  const Login = ({ onLogin = () => {} }) => {
    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');

    const navigate = useNavigate();

    const handleLoginClick = (e) => {
      e.preventDefault();
      setView('roles');
    };

    const handleRoleLogin = (rol, ruta) => {
      localStorage.setItem('rol', rol);
      onLogin();
      navigate(ruta);
    };

    const renderLogin = () => (
      <form onSubmit={handleLoginClick}>
        <h2 className="text-2xl font-semibold mb-6 text-black">Ingresar</h2>

        <label className="text-sm text-black mb-1">Correo Electrónico</label>
        <input
          type="email"
          placeholder="usuario@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 text-black"
        />

        <label className="text-sm text-black mb-1">Contraseña</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 text-black"
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded mb-4">
          Log in
        </button>

        <div className="flex flex-col items-center space-y-2">
          <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setView('recuperar')}>
            ¿Olvidaste tu contraseña?
          </button>
          <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setView('crear')}>
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </form>
    );

    const renderCrear = () => (
      <>
        <h2 className="text-2xl font-semibold mb-6 text-black text-center">Crear cuenta</h2>
        <p className="text-black text-center mb-4">¿Desea crear una cuenta de Persona o de Empresa?</p>
        <button className="w-full bg-black text-white py-2 rounded mb-2">Persona</button>
        <button
          className="w-full bg-black text-white py-2 rounded mb-6"
          onClick={() => navigate('/registrar-empresa')}
        >
          Empresa
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

    const renderRoles = () => (
      <>
        <h2 className="text-2xl font-semibold mb-6 text-black text-center">Elija su rol</h2>
        <button className="w-full bg-black text-white py-2 rounded mb-2" onClick={() => handleRoleLogin('empleado', '/empleado/inicio')}>Empleado</button>
        <button className="w-full bg-black text-white py-2 rounded mb-2" onClick={() => handleRoleLogin('rrhh', '/rrhh/inicio')}>RRHH</button>
        <button className="w-full bg-black text-white py-2 rounded mb-2" onClick={() => handleRoleLogin('gerente', '/gerente/inicio')}>Gerente</button>
        <button className="w-full bg-black text-white py-2 rounded mb-2" onClick={() => handleRoleLogin('supervisor', '/supervisor/inicio')}>Supervisor</button>
        <button onClick={() => setView('login')} className="text-black hover:underline">← Volver</button>
      </>
    );

    return (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
    <div className="flex w-full h-full shadow-lg rounded-none overflow-hidden">
      {/* Sección izquierda - logo y texto */}
      <div className="flex-1 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-black flex flex-col items-center justify-center p-10">
        <img
          src={miLogo}
          alt="Logo"
          className="mx-auto mb-6 object-contain"
          style={{ width: '280px', height: '280px' }}
        />
        <h2 className="text-xl font-bold text-center">SISTEMA DE GESTIÓN DE RECURSOS HUMANOS</h2>
        <p className="text-sm text-center mt-2">Todo lo que necesitas para el control de tu empresa.</p>
      </div>

      {/* Sección derecha - formulario */}
      <div className="flex-1 bg-white flex flex-col justify-center p-10 overflow-y-auto">
        {view === 'login' && renderLogin()}
        {view === 'crear' && renderCrear()}
        {view === 'recuperar' && renderRecuperar()}
        {view === 'roles' && renderRoles()}
      </div>
    </div>
  </div>
);

  };

  export default Login;
