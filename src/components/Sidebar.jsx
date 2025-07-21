import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  const rutasInicio = {
    empleado: '/empleado/inicio',
    rrhh: '/rrhh/inicio',
    gerente: '/gerente/inicio',
    supervisor: '/supervisor/inicio',
  };

  const rutaInicio = rutasInicio[rol] || '/empleado/inicio';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    onLogout(); // actualiza estado de App.jsx
    navigate('/login');
  };

  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h2 className="text-center">SGRH</h2>
      <hr className="bg-secondary" />
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to={rutaInicio}
            className={`nav-link text-white ${location.pathname === rutaInicio ? 'active bg-secondary' : ''}`}
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
          <button
            onClick={handleLogout}
            className="nav-link text-white btn btn-link text-start"
          >
            Salir
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
