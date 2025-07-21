import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [view, setView] = useState('login');
  const navigate = useNavigate();

  const handleRoleLogin = (rol, ruta) => {
    localStorage.setItem('rol', rol);
    onLogin();
    navigate(ruta);
  };

  const renderLogin = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-black">Ingresar</h2>

      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input type="email" placeholder="usuario@ejemplo.com" className="w-full border rounded px-3 py-2 mb-4 text-black" />

      <label className="text-sm text-black mb-1">Contraseña</label>
      <input type="password" placeholder="********" className="w-full border rounded px-3 py-2 mb-4 text-black" />

      <button className="w-full bg-black text-white py-2 rounded mb-4" onClick={() => setView('roles')}>
        Log in
      </button>

      <div className="flex flex-col items-center space-y-2">
        <button className="text-sm text-blue-600 hover:underline" onClick={() => setView('recuperar')}>
          ¿Olvidaste tu contraseña?
        </button>
        <button className="text-sm text-blue-600 hover:underline" onClick={() => setView('crear')}>
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </>
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
    <>
      <h2 className="text-2xl font-semibold mb-6 text-black text-center">Recuperar contraseña</h2>
      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input type="email" className="w-full border rounded px-3 py-2 mb-4 text-black" />
      <button className="w-full bg-black text-white py-2 rounded mb-4">Enviar</button>
      <button onClick={() => setView('login')} className="text-black hover:underline">← Volver</button>
    </>
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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl h-full flex shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-10">
          <img src="src/assets/mi_logo.png" alt="Logo" className="w-24 mb-4" />
          <h2 className="text-xl font-bold text-center">SISTEMA DE GESTIÓN DE RECURSOS HUMANOS</h2>
          <p className="text-sm text-center">Todo lo que necesitas para el control de tu empresa.</p>
        </div>
        <div className="w-1/2 bg-white flex flex-col justify-center p-10 overflow-y-auto">
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
