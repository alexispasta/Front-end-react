// src/tests/GestionAsistencia.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import GestionAsistencia from "../components/GestionAsistencia";

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem("empresaId", "empresa123");
  window.confirm = jest.fn(() => true); // Confirm siempre sí
});

afterEach(() => {
  jest.resetAllMocks();
});

const mockEmpleados = [
  { _id: "1", nombre: "Juan", apellido: "Pérez", codigo: "EMP001" },
  { _id: "2", nombre: "Ana", apellido: "López", codigo: "EMP002" },
];

const mockHistorial = ["2025-09-10", "2025-09-18"];

describe("GestionAsistencia", () => {

  test("muestra 'Cargando empleados...' mientras carga", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEmpleados,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(<GestionAsistencia onVolver={() => {}} />);
    expect(screen.getByText(/Cargando empleados/i)).toBeInTheDocument();
    expect(await screen.findByText(/Juan Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/Ana López/)).toBeInTheDocument();
  });

  test("guarda asistencia y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados }) // carga empleados
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // historial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Asistencia guardada ✅" }) }) // POST asistencia
      .mockResolvedValueOnce({ ok: true, json: async () => mockHistorial }); // recarga historial

    render(<GestionAsistencia onVolver={() => {}} />);
    await screen.findByText(/Juan Pérez/);

    const fechaInput = screen.getByLabelText(/Fecha/i, { selector: "input" });
    await userEvent.type(fechaInput, "2025-09-18");

    const btnGuardar = screen.getByText(/Guardar Asistencia/i);
    await userEvent.click(btnGuardar);

    expect(await screen.findByText(/Asistencia guardada/i)).toBeInTheDocument();
  });

  test("muestra mensaje si intenta guardar sin fecha", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<GestionAsistencia onVolver={() => {}} />);
    await screen.findByText(/Juan Pérez/);

    const btnGuardar = screen.getByText(/Guardar Asistencia/i);
    await userEvent.click(btnGuardar);

    expect(await screen.findByText(/Debe seleccionar una fecha/i)).toBeInTheDocument();
  });

  test("muestra mensaje si intenta eliminar historial sin seleccionar fecha", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockHistorial });

    render(<GestionAsistencia onVolver={() => {}} />);
    await screen.findByText(/Juan Pérez/);

    const btnEliminarFecha = screen.getByText(/Eliminar Fecha/i);
    await userEvent.click(btnEliminarFecha);

    expect(await screen.findByText(/Seleccione una fecha para eliminar/i)).toBeInTheDocument();
  });

  test("elimina fecha correctamente", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockHistorial })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Fecha eliminada ✅" }) }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => ["2025-09-18"] }); // recarga historial

    render(<GestionAsistencia onVolver={() => {}} />);
    await screen.findByText(/Juan Pérez/);

    const radioFecha = await screen.findByDisplayValue("2025-09-10");
    await userEvent.click(radioFecha);

    const btnEliminarFecha = screen.getByText(/Eliminar Fecha/i);
    await userEvent.click(btnEliminarFecha);

    expect(await screen.findByText(/Fecha eliminada/i)).toBeInTheDocument();
  });

  test("elimina todo el historial correctamente", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockHistorial })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Historial eliminado ✅" }) }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // recarga historial

    render(<GestionAsistencia onVolver={() => {}} />);
    await screen.findByText(/Juan Pérez/);

    const btnEliminarTodo = screen.getByText(/Eliminar Todo el Historial/i);
    await userEvent.click(btnEliminarTodo);

    expect(await screen.findByText(/Historial eliminado/i)).toBeInTheDocument();
  });

  test("botón Volver llama a onVolver", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
         .mockResolvedValueOnce({ ok: true, json: async () => [] });

    const onVolverMock = jest.fn();
    render(<GestionAsistencia onVolver={onVolverMock} />);

    const btnVolver = screen.getByText(/← Volver al Menú/i);
    await userEvent.click(btnVolver);

    expect(onVolverMock).toHaveBeenCalled();
  });

  
});

// Simulamos console.error para tests de fetch fallido
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
