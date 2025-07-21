import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Importar useNavigate

const Login = ({ onLogin }) => {
  const [view, setView] = useState('login');
  const navigate = useNavigate(); // ⬅️ Hook para redirigir

  const renderLogin = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-black">Ingresar</h2>
      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input
        type="email"
        placeholder="usuario@ejemplo.com"
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black text-black"
      />
      <label className="text-sm text-black mb-1">Contraseña</label>
      <input
        type="password"
        placeholder="********"
        className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-black text-black"
      />
      <button
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        onClick={() => setView('roles')}
      >
        Log in
      </button>
      <div className="flex justify-between mt-4 text-sm">
        <button onClick={() => setView('recuperar')} className="text-black hover:underline">
          ¿Olvidó su contraseña?
        </button>
        <button onClick={() => setView('crear')} className="text-black hover:underline">
          Crear cuenta
        </button>
      </div>
    </>
  );

  const renderCrear = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">Crear cuenta</h2>
      <p className="text-center text-black mb-6">¿Desea crear una cuenta de Persona o de Empresa?</p>
      <button className="w-full bg-black text-white py-2 rounded mb-4">Persona</button>
      <button className="w-full bg-black text-white py-2 rounded mb-6">Empresa</button>
      <button onClick={() => setView('login')} className="text-black hover:underline">
        ← Volver al inicio de sesión
      </button>
    </>
  );

  const renderRecuperar = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">Recuperar contraseña</h2>
      <label className="text-sm text-black mb-1">Correo Electrónico</label>
      <input
        type="email"
        placeholder="usuario@ejemplo.com"
        className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-black text-black"
      />
      <button className="w-full bg-black text-white py-2 rounded mb-4">Enviar</button>
      <button onClick={() => setView('login')} className="text-black hover:underline">
        ← Volver al inicio de sesión
      </button>
    </>
  );

   const renderRoles = () => (
  <>
    <h2 className="text-2xl font-semibold mb-6 text-center text-black">Elija el rol con que desea ingresar</h2>

    {/* ✅ Empleado */}
    <button
      className="w-full bg-black text-white py-2 rounded mb-2"
      onClick={() => {
        onLogin();
        navigate('/Empleado/Pagina_Inicio_Empleado');
      }}
    >
      Empleado
    </button>

    {/* ✅ RRHH */}
    <button
      className="w-full bg-black text-white py-2 rounded mb-2"
      onClick={() => {
        onLogin();
        navigate('/Rrhh/Pagina_Inicio');
      }}
    >
      RRHH
    </button>

    {/* ✅ Gerente */}
    <button
      className="w-full bg-black text-white py-2 rounded mb-2"
      onClick={() => {
        onLogin();
        navigate('/Gerente/Pagina_Inicio_Gerente');
      }}
    >
      Gerente
    </button>

    {/* ✅ Supervisor */}
    <button
      className="w-full bg-black text-white py-2 rounded mb-4"
      onClick={() => {
        onLogin();
        navigate('/Supervisor/Pagina_Inicio_Supervisor');
      }}
    >
      Supervisor
    </button>

    <button onClick={() => setView('login')} className="text-black hover:underline">
      ← Volver al inicio de sesión
    </button>
  </>
);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl h-full flex shadow-lg rounded-lg overflow-hidden">
        {/* Panel izquierdo */}
        <div className="w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-10 space-y-4">
          <img
            src="src/assets/mi_logo.png"
            alt="Logo"
            className="w-24 h-auto max-h-[60px] object-contain"
          />
          <h2 className="text-xl font-bold text-center leading-tight">
            SISTEMA DE GESTIÓN DE RECURSOS HUMANOS
          </h2>
          <p className="text-sm text-center">
            Todo lo que necesitas para el control de tu empresa.
          </p>
        </div>

        {/* Panel derecho */}
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

