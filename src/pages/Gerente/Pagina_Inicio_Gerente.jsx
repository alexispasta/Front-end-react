import React, { useState } from 'react';
import MenuOpcionesGerente from '../../components/MenuOpcionesGerente';
import EmpleadosTabla from '../../components/EmpleadosTabla';
import EmpleadoDetalleForm from '../../components/EmpleadoDetalleForm';
import GestionAsistencia from '../../components/GestionAsistencia';
import GestionReportes from '../../components/GestionReportes';
import GestionNomina from '../../components/GestionNomina';
import GestionPermisos from '../../components/GestionPermisos';
import GestionInformes from '../../components/GestionInformes';

// Los nuevos componentes:

import ConfiguracionSistema from '../../components/ConfiguracionSistema';

const Pagina_Inicio_Gerente = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const empleadosEjemplo = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      documento: '123456789',
      fecha: '2021-03-15',
      estado: 'activo',
      correo: 'juan.perez@email.com',
      salario: 2500000,
      cargo: 'Analista',
      eps: 'SURA',
    },
    {
      id: 2,
      nombre: 'María García',
      documento: '987654321',
      fecha: '2022-01-10',
      estado: 'inactivo',
      correo: 'maria.garcia@email.com',
      salario: 3200000,
      cargo: 'Coordinadora',
      eps: 'Nueva EPS',
    },
  ];

  const handleEditar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
  };

  const handleCerrarDetalle = () => {
    setEmpleadoSeleccionado(null);
  };

  const renderContenido = () => {
    if (empleadoSeleccionado) {
      return (
        <EmpleadoDetalleForm
          empleado={empleadoSeleccionado}
          onCerrar={handleCerrarDetalle}
        />
      );
    }

    switch (opcionSeleccionada) {
      case 'empleados':
        return <EmpleadosTabla empleados={empleadosEjemplo} onEditar={handleEditar} />;
      case 'asistencia':
        return <GestionAsistencia onVolver={() => setOpcionSeleccionada(null)}/>;
      case 'nomina':
        return <GestionNomina onVolver={() => setOpcionSeleccionada(null)}/>;
      case 'reportes':
        return <GestionReportes onVolver={() => setOpcionSeleccionada(null)}/>;
      case 'informes':
        return <GestionInformes  onVolver={() => setOpcionSeleccionada(null)}/>;
      case 'permisos':
        return <GestionPermisos onVolver={() => setOpcionSeleccionada(null)}/>;
      case 'sistema':
        return <ConfiguracionSistema onVolver={() => setOpcionSeleccionada(null)}/>;
      default:
        return <MenuOpcionesGerente onSeleccionar={setOpcionSeleccionada} />;
    }
  };

  return (
    <div className="container mt-4">
      <h1>Panel Gerente</h1>
      <div className="mt-4">{renderContenido()}</div>
    </div>
  );
};


export default Pagina_Inicio_Gerente;
