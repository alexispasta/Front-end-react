import React from 'react';

const LeftPanel = () => {
  return (
    <div className="w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <img src="/img/mi_logo.png" alt="Logo" className="w-40 mb-4" />
      <h2 className="text-lg font-bold text-center">SISTEMA DE GESTIÓN DE RECURSOS HUMANOS</h2>
      <p className="text-sm text-center mt-2">Todo lo que necesitas para el control de tu empresa.</p>
    </div>
  );
};

export default LeftPanel;
