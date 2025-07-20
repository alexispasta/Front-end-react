import React, { useState } from 'react';


const Login = () => {
  const [view, setView] = useState('login');

  const renderLogin = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">Ingresar</h2>
      <label className="text-sm text-gray-700 mb-1">Correo Electrónico</label>
      <input
        type="email"
        placeholder="usuario@ejemplo.com"
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="text-sm text-gray-700 mb-1">Contraseña</label>
      <input
        type="password"
        placeholder="********"
        className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
        onClick={() => setView('roles')}
      >
        Log in
      </button>
      <div className="flex justify-between mt-4 text-sm">
        <button onClick={() => setView('recuperar')} className="text-blue-600 hover:underline">
          ¿Olvidó su contraseña?
        </button>
        <button onClick={() => setView('crear')} className="text-blue-600 hover:underline">
          Crear cuenta
        </button>
      </div>
    </>
  );

  const renderCrear = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">Crear cuenta</h2>
      <p className="text-center text-gray-700 mb-6">¿Desea crear una cuenta de Persona o de Empresa?</p>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-4">Persona</button>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-6">Empresa</button>
      <button onClick={() => setView('login')} className="text-blue-600 hover:underline">
        ← Volver al inicio de sesión
      </button>
    </>
  );

  const renderRecuperar = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">Recuperar contraseña</h2>
      <label className="text-sm text-gray-700 mb-1">Correo Electrónico</label>
      <input
        type="email"
        placeholder="usuario@ejemplo.com"
        className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-4">Enviar</button>
      <button onClick={() => setView('login')} className="text-blue-600 hover:underline">
        ← Volver al inicio de sesión
      </button>
    </>
  );

  const renderRoles = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">Elija el rol con que desea ingresar</h2>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-2">Empleado</button>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-2">RRHH</button>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-2">Gerente</button>
      <button className="w-full bg-gray-900 text-white py-2 rounded mb-4">Supervisor</button>
      <button onClick={() => setView('login')} className="text-blue-600 hover:underline">
        ← Volver al inicio de sesión
      </button>
    </>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-5xl flex shadow-lg rounded-lg overflow-hidden">
        {/* Panel izquierdo */}
        <div className="w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-10">
          <img src="src//assets/mi_logo.png" alt="Logo" className="w-24 mb-6" />
          <h2 className="text-xl font-bold text-center">SISTEMA DE GESTIÓN DE RECURSOS HUMANOS</h2>
          <p className="text-sm text-center mt-4">Todo lo que necesitas para el control de tu empresa.</p>
        </div>

        {/* Panel derecho */}
        <div className="w-1/2 bg-white flex flex-col justify-center p-10">
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
