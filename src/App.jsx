import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Pagina_Inicio_Empleado from './pages/Empleado/Pagina_Inicio_Empleado';
import Pagina_Inicio_Gerente from './pages/Gerente/Pagina_Inicio_Gerente';
import Pagina_Inicio_Supervisor from './pages/Supervisor/Pagina_Inicio_Supervisor';
import Pagina_Inicio_Rrhh from './pages/Rrhh/Pagina_Inicio';
// Si existe una página para Empresa
import Empresa from './pages/RegistrarEmpresa';

import Informacion_Cuenta from './pages/Informacion_Cuenta';
import Quejas_Sugerencias from './pages/Quejas_Sugerencias';
import Salir_Cuenta from './pages/Salir_Cuenta';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="d-flex">
          <Sidebar onLogout={() => setIsLoggedIn(false)} />
          <div className="p-4" style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/empleado/inicio" element={<Pagina_Inicio_Empleado />} />
              <Route path="/gerente/inicio" element={<Pagina_Inicio_Gerente />} />
              <Route path="/supervisor/inicio" element={<Pagina_Inicio_Supervisor />} />
              <Route path="/rrhh/inicio" element={<Pagina_Inicio_Rrhh />} />
              <Route path="/informacion" element={<Informacion_Cuenta />} />
              <Route path="/quejas" element={<Quejas_Sugerencias />} />
              <Route path="/registrar-empresa" element={<Empresa />} />

              <Route path="/salir" element={<Salir_Cuenta />} />
              <Route path="*" element={<Pagina_Inicio_Empleado />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;
