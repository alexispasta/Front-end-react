import React from 'react';

const RightPanel = () => {
  const mostrarRoles = () => {
    alert("Función mostrarRoles");
  };

  const mostrarRecuperar = () => {
    alert("Función mostrarRecuperar");
  };

  const mostrarOpciones = () => {
    alert("Función mostrarOpciones");
  };

  return (
    <div className="w-1/2 bg-white flex flex-col justify-center p-8">
      <h2 className="text-2xl font-semibold mb-6">Ingresar</h2>

      <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
      <input type="email" placeholder="usuario@ejemplo.com" className="w-full px-4 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" />

      <label className="block text-sm font-medium text-gray-700 mt-4">Contraseña</label>
      <input type="password" placeholder="********" className="w-full px-4 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" />

      <button onClick={mostrarRoles} className="w-full bg-gray-900 text-white py-2 mt-6 rounded hover:bg-gray-700 transition">Log in</button>

      <a href="#" onClick={mostrarRecuperar} className="text-sm text-gray-600 mt-4 text-center block hover:underline">¿Olvidó su contraseña?</a>
      <a href="#" onClick={mostrarOpciones} className="text-sm text-gray-600 mt-4 text-center block hover:underline">Crear cuenta</a>
    </div>
  );
};

export default RightPanel;
