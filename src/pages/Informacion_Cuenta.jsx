import React from 'react';
import InformacionCuentaForm from '../components/InformacionCuentaForm';

const Informacion_Cuenta = ({ onBack }) => {
  return (
    <div className="container mt-4">
      <InformacionCuentaForm onBack={onBack} />
    </div>
  );
};

export default Informacion_Cuenta;
