import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Salir_Cuenta from './pages/Rrhh/Salir_Cuenta';
import Quejas_Sugerencias from './pages/Rrhh/Quejas_Sugerencias';
import Pagina_Inicio from './pages/Rrhh/Pagina_Inicio';
import Informacion_Cuenta from './pages/Rrhh/Informacion_Cuenta';
import EmpleadoDetalleForm from './components/EmpleadoDetalleForm';
import Login from './pages/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="d-flex">
          <Sidebar />
          <div className="p-4" style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Pagina_Inicio />} />
              <Route path="/quejas" element={<Quejas_Sugerencias />} />
              <Route path="/informacion" element={<Informacion_Cuenta />} />
              <Route path="/salir" element={<Salir_Cuenta />} />
              <Route path="/empleado/:id" element={<EmpleadoDetalleForm />} />
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
