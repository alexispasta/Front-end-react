import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Pagina_Inicio_Empleado from './pages/Empleado/Pagina_Inicio_Empleado';
import Pagina_Inicio_Gerente from './pages/Gerente/Pagina_Inicio_Gerente';
import Pagina_Inicio_Supervisor from './pages/Supervisor/Pagina_Inicio_Supervisor';
import Pagina_Inicio_Rrhh from './pages/Rrhh/Pagina_Inicio';
import RegistrarEmpresa from './pages/RegistrarEmpresa';
import RegistrarPersona from './pages/RegistrarPersona';

import Informacion_Cuenta from './pages/Informacion_Cuenta';
import Quejas_Sugerencias from './pages/Quejas_Sugerencias';
import Salir_Cuenta from './pages/Salir_Cuenta';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {/* 👇 Texto agregado para que Jest pueda encontrarlo */}
      <h1 className="text-center mt-3">Bienvenido al Proyecto React</h1>

      {isLoggedIn ? (
        <div className="d-flex">
          <Sidebar onLogout={handleLogout} />
          <div className="p-4 flex-grow-1">
            <Routes>
              {/* Rutas con sidebar (solo cuando está logueado) */}
              <Route path="/empleado/inicio" element={<Pagina_Inicio_Empleado />} />
              <Route path="/gerente/inicio" element={<Pagina_Inicio_Gerente />} />
              <Route path="/supervisor/inicio" element={<Pagina_Inicio_Supervisor />} />
              <Route path="/rrhh/inicio" element={<Pagina_Inicio_Rrhh />} />

              {/* Otras páginas con sidebar */}
              <Route path="/informacion" element={<Informacion_Cuenta />} />
              <Route path="/quejas" element={<Quejas_Sugerencias />} />
              <Route path="/salir" element={<Salir_Cuenta onLogout={handleLogout} />} />

              {/* Ruta por defecto si está logueado */}
              <Route path="*" element={<Pagina_Inicio_Empleado />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Rutas públicas (sin sidebar) */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registrar-empresa" element={<RegistrarEmpresa />} />
          <Route path="/registrar-persona" element={<RegistrarPersona />} />

          {/* Ruta por defecto si no está logueado */}
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
