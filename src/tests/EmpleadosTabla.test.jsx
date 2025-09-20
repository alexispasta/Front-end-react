// src/tests/EmpleadosTabla.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import EmpleadosTabla from "../components/EmpleadosTabla";
import RegistroCertificacion from "../components/RegistroCertificacion";

// Mock del componente RegistroCertificacion
jest.mock("../components/RegistroCertificacion", () => {
  return function MockRegistroCertificacion({ onVolver }) {
    return (
      <div data-testid="registro-certificacion">
        Certificados
        <button onClick={onVolver}>Volver</button>
      </div>
    );
  };
});


beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem("empresaId", "123");
  window.confirm = jest.fn(() => true); // Confirmación siempre sí
});

afterEach(() => {
  jest.resetAllMocks();
});

const mockEmpleados = [
  {
    _id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@test.com",
    telefono: "123",
    codigo: "EMP001",
    rol: "Empleado",
    ciudad: "Bogotá",
  },
];

test("muestra mensaje de error si fetch falla", async () => {
  global.fetch.mockRejectedValueOnce(new Error("Error al cargar empleados"));

  render(<EmpleadosTabla onVolver={() => {}} />);

  await waitFor(() =>
    expect(screen.getByText("Error al cargar empleados")).toBeInTheDocument()
  );
});

test("muestra la tabla con empleados", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockEmpleados,
  });

  render(<EmpleadosTabla onVolver={() => {}} />);

  expect(await screen.findByText("Juan")).toBeInTheDocument();
  expect(screen.getByText("Pérez")).toBeInTheDocument();
});

test("abre y cierra el formulario de edición", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockEmpleados,
  });

  render(<EmpleadosTabla onVolver={() => {}} />);

  await userEvent.click(await screen.findByText("Editar"));
  expect(await screen.findByText(/Editando: Juan/i)).toBeInTheDocument();

  await userEvent.click(screen.getByText("Cancelar"));
  await waitFor(() =>
    expect(screen.queryByText(/Editando: Juan/i)).not.toBeInTheDocument()
  );
});

test("guarda cambios y actualiza nombre", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados }) // GET inicial
    .mockResolvedValueOnce({ ok: true }) // PUT
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...mockEmpleados[0], nombre: "Juan Actualizado" }],
    }); // GET actualizado

  render(<EmpleadosTabla onVolver={() => {}} />);

  await userEvent.click(await screen.findByText("Editar"));

  const inputNombre = await screen.findByLabelText("Nombre");
  await userEvent.clear(inputNombre);
  await userEvent.type(inputNombre, "Juan Actualizado");

  await userEvent.click(screen.getByText("Guardar"));

  await waitFor(() =>
    expect(
      screen.getByText("Empleado actualizado correctamente ✅")
    ).toBeInTheDocument()
  );
  expect(await screen.findByText("Juan Actualizado")).toBeInTheDocument();
});

test("elimina empleado correctamente", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados }) // GET
    .mockResolvedValueOnce({ ok: true }); // DELETE

  render(<EmpleadosTabla onVolver={() => {}} />);

  await userEvent.click(await screen.findByText("Eliminar"));

  await waitFor(() =>
    expect(
      screen.getByText("Empleado eliminado correctamente ❌")
    ).toBeInTheDocument()
  );
  expect(screen.queryByText("Juan")).not.toBeInTheDocument();
});

test("muestra sección de certificados y permite volver", async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados });

  render(<EmpleadosTabla onVolver={() => {}} />);

  // Hacer clic en "Certificados"
  const botonCertificados = await screen.findByText("Certificados");
  await userEvent.click(botonCertificados);

  // Esperar que aparezca el componente mockeado de certificados
  const registro = await screen.findByTestId("registro-certificacion");
  expect(registro).toBeInTheDocument();

  // Hacer clic en "Volver" dentro de RegistroCertificacion
  const botonVolver = screen.getByText("Volver");
  await userEvent.click(botonVolver);

  // Esperar que el componente desaparezca
  await waitFor(() =>
    expect(screen.queryByTestId("registro-certificacion")).not.toBeInTheDocument()
  );
});


test("botón Volver al menú llama a onVolver", async () => {
  const onVolverMock = jest.fn();
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  render(<EmpleadosTabla onVolver={onVolverMock} />);

  await userEvent.click(screen.getByText("← Volver al Menú"));
  expect(onVolverMock).toHaveBeenCalled();
});

test("muestra mensaje de error al guardar cambios con PUT fallido", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados }) // GET inicial
    .mockResolvedValueOnce({ ok: false, statusText: "Error PUT" }); // PUT falla

  render(<EmpleadosTabla onVolver={() => {}} />);

  await userEvent.click(await screen.findByText("Editar"));

  const inputNombre = await screen.findByLabelText("Nombre");
  await userEvent.clear(inputNombre);
  await userEvent.type(inputNombre, "Juan Actualizado");

  await userEvent.click(screen.getByText("Guardar"));

  await waitFor(() =>
    expect(screen.getByText("Error al actualizar empleado")).toBeInTheDocument()
  );
});

test("muestra mensaje de error al eliminar empleado con DELETE fallido", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados }) // GET
    .mockResolvedValueOnce({ ok: false, statusText: "Error DELETE" }); // DELETE falla

  render(<EmpleadosTabla onVolver={() => {}} />);

  await userEvent.click(await screen.findByText("Eliminar"));

  await waitFor(() =>
    expect(screen.getByText("Error al eliminar empleado")).toBeInTheDocument()
  );
});
