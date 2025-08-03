import React, { useState, useEffect } from 'react';
import MenuOpcionesGerente from '../../components/MenuOpcionesGerente';
import EmpleadosTabla from '../../components/EmpleadosTabla';
import EmpleadoDetalleForm from '../../components/EmpleadoDetalleForm';
import GestionAsistencia from '../../components/GestionAsistencia';
import GestionReportes from '../../components/GestionReportes';
import GestionNomina from '../../components/GestionNomina';
import GestionPermisos from '../../components/GestionPermisos';
import GestionInformes from '../../components/GestionInformes';
import ConfiguracionSistema from '../../components/ConfiguracionSistema';

const Pagina_Inicio_Gerente = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Cargar empleados al iniciar
  useEffect(() => {
    fetch("http://localhost:3000/api/gerente/empleados")
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error("Error cargando empleados:", err));
  }, []);

  // Manejar selección de empleado
  const handleEditar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
  };

  const handleCerrarDetalle = () => {
    setEmpleadoSeleccionado(null);
  };

  // Guardar cambios de un empleado en el backend
  const handleGuardarEmpleado = async (empleadoActualizado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/gerente/empleado/${empleadoActualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleadoActualizado)
      });
      const data = await res.json();
      alert(data.message || "Empleado actualizado");
      
      // Actualizamos estado local
      setEmpleados(empleados.map(emp => emp.id === empleadoActualizado.id ? empleadoActualizado : emp));
      setEmpleadoSeleccionado(null);
    } catch (error) {
      console.error("Error guardando empleado:", error);
    }
  };

  // Renderizado según la opción
  const renderContenido = () => {
    if (empleadoSeleccionado) {
      return (
        <EmpleadoDetalleForm
          empleado={empleadoSeleccionado}
          onCerrar={handleCerrarDetalle}
          onGuardar={handleGuardarEmpleado}
        />
      );
    }

    switch (opcionSeleccionada) {
      case 'empleados':
        return <EmpleadosTabla empleados={empleados} onEditar={handleEditar} onVolver={() => setOpcionSeleccionada(null)} />;
      case 'asistencia':
        return <GestionAsistencia onVolver={() => setOpcionSeleccionada(null)} />;
      case 'nomina':
        return <GestionNomina onVolver={() => setOpcionSeleccionada(null)} />;
      case 'reportes':
        return <GestionReportes onVolver={() => setOpcionSeleccionada(null)} />;
      case 'informes':
        return <GestionInformes onVolver={() => setOpcionSeleccionada(null)} />;
      case 'permisos':
        return <GestionPermisos onVolver={() => setOpcionSeleccionada(null)} />;
      case 'sistema':
        return <ConfiguracionSistema onVolver={() => setOpcionSeleccionada(null)} />;
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
