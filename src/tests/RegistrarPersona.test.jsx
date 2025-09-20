// src/tests/RegistrarPersona.test.jsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import RegistrarPersona from "../components/RegistrarPersona";
import "@testing-library/jest-dom";

global.alert = jest.fn();

describe("RegistrarPersona", () => {
  const onVolverMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Helper para llenar el formulario
  const llenarFormulario = () => {
    fireEvent.change(screen.getByLabelText(/Nombres/i), { target: { value: "Andres" } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: "Sanchez" } });
    fireEvent.change(screen.getByLabelText(/Identificación/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: "3001234567" } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: "Calle 1" } });
    fireEvent.change(screen.getByLabelText(/Rol de Empresa/i), { target: { value: "empleado" } });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: "Bogotá" } });
  };

  test("muestra error si no hay empresaId en localStorage", async () => {
    await act(async () => {
      render(<RegistrarPersona onVolver={onVolverMock} />);
    });

    llenarFormulario();

    fireEvent.click(screen.getByRole("button", { name: /Registrar Persona/i }));

    expect(await screen.findByText(/No se encontró la empresa/i)).toBeInTheDocument();
  });

  test("registra una persona correctamente", async () => {
    localStorage.setItem("empresaId", "456");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    );

    await act(async () => {
      render(<RegistrarPersona onVolver={onVolverMock} />);
    });

    llenarFormulario();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Registrar Persona/i }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/personas",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"empresaId":"456"'),
      })
    );

    expect(await screen.findByText(/Persona registrada correctamente/)).toBeInTheDocument();
  });

  test("muestra mensaje de error si fetch falla", async () => {
    localStorage.setItem("empresaId", "456");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(<RegistrarPersona onVolver={onVolverMock} />);
    });

    llenarFormulario();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Registrar Persona/i }));
    });

    expect(await screen.findByText(/Error al registrar persona/)).toBeInTheDocument();
  });

  test("el botón volver llama a onVolver", async () => {
    await act(async () => {
      render(<RegistrarPersona onVolver={onVolverMock} />);
    });

    fireEvent.click(screen.getByRole("button", { name: /← Volver al Menú/i }));
    expect(onVolverMock).toHaveBeenCalled();
  });
});
