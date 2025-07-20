import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h2 className="text-center">SGRH</h2>
      <hr className="bg-secondary" />
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/"
            className={`nav-link text-white ${location.pathname === '/' ? 'active bg-secondary' : ''}`}
          >
            Página de inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/quejas"
            className={`nav-link text-white ${location.pathname === '/quejas' ? 'active bg-secondary' : ''}`}
          >
            Quejas y sugerencias
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/informacion"
            className={`nav-link text-white ${location.pathname === '/informacion' ? 'active bg-secondary' : ''}`}
          >
            Información de Cuenta
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/salir"
            className={`nav-link text-white ${location.pathname === '/salir' ? 'active bg-secondary' : ''}`}
          >
            Salir
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
