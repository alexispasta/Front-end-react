import { useNavigate } from "react-router-dom";

const RolesSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Elija el rol con que desea ingresar
        </h2>
        <button
          onClick={() => navigate("/empleado")}
          className="w-full bg-black text-white py-2 rounded mb-2"
        >
          Empleado
        </button>
        <button
          onClick={() => navigate("/rrhh")}
          className="w-full bg-black text-white py-2 rounded mb-2"
        >
          RRHH
        </button>
        <button
          onClick={() => navigate("/gerente")}
          className="w-full bg-black text-white py-2 rounded mb-2"
        >
          Gerente
        </button>
        <button
          onClick={() => navigate("/supervisor")}
          className="w-full bg-black text-white py-2 rounded mb-4"
        >
          Supervisor
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-black hover:underline"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default RolesSelector;
