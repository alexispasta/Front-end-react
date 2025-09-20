import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrarEmpresa from "../pages/RegistrarEmpresa";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock para useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock global alert
global.alert = jest.fn();

describe("RegistrarEmpresa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el formulario correctamente", () => {
    render(
      <MemoryRouter>
        <RegistrarEmpresa />
      </MemoryRouter>
    );

    // Títulos
    expect(screen.getByText(/Registro Empresa y Gerente/i)).toBeInTheDocument();
    expect(screen.getByText(/Datos de la Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Datos del Gerente/i)).toBeInTheDocument();

    // Inputs empresa
    expect(screen.getByLabelText(/Nombre de Empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono Empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección Empresa/i)).toBeInTheDocument();

    // Inputs gerente
    expect(screen.getByLabelText(/^Nombres$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identificación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Correo Electrónico$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Teléfono$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Dirección$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();

    // Botón
    expect(screen.getByRole("button", { name: /Registrar Empresa y Gerente/i })).toBeInTheDocument();
  });

  test("muestra alert si intenta enviar formulario vacío", async () => {
    render(
      <MemoryRouter>
        <RegistrarEmpresa />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Registrar Empresa y Gerente/i }));

    // Al ser required, no debería llamarse fetch, pero sí el alert de HTML5
    expect(global.alert).not.toHaveBeenCalled();
  });

  test("registra la empresa y gerente correctamente", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({}) })
    );

    render(
      <MemoryRouter>
        <RegistrarEmpresa />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Llenar campos
    await user.type(screen.getByLabelText(/Nombre de Empresa/i), "Mi Empresa");
    await user.type(screen.getByLabelText(/Correo Empresa/i), "empresa@correo.com");
    await user.type(screen.getByLabelText(/País/i), "Colombia");
    await user.type(screen.getByLabelText(/Teléfono Empresa/i), "3001234567");
    await user.type(screen.getByLabelText(/Dirección Empresa/i), "Calle 1");

    await user.type(screen.getByLabelText(/^Nombres$/i), "Andres");
    await user.type(screen.getByLabelText(/Apellidos/i), "Sanchez");
    await user.type(screen.getByLabelText(/Identificación/i), "123456");
    await user.type(screen.getByLabelText(/^Correo Electrónico$/i), "a@b.com");
    await user.type(screen.getByLabelText(/Contraseña/i), "1234");
    await user.type(screen.getByLabelText(/^Teléfono$/i), "3007654321");
    await user.type(screen.getByLabelText(/^Dirección$/i), "Calle 2");
    await user.type(screen.getByLabelText(/Fecha de Nacimiento/i), "1990-01-01");
    await user.type(screen.getByLabelText(/Ciudad/i), "Bogotá");

    await user.click(screen.getByRole("button", { name: /Registrar Empresa y Gerente/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith("✅ Empresa y gerente registrados correctamente");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("muestra alerta de error si fetch falla", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: async () => ({ message: "Error en servidor" }) })
    );

    render(
      <MemoryRouter>
        <RegistrarEmpresa />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Nombre de Empresa/i), "Mi Empresa");
    await user.type(screen.getByLabelText(/Correo Empresa/i), "empresa@correo.com");
    await user.type(screen.getByLabelText(/País/i), "Colombia");
    await user.type(screen.getByLabelText(/Teléfono Empresa/i), "3001234567");
    await user.type(screen.getByLabelText(/Dirección Empresa/i), "Calle 1");

    await user.type(screen.getByLabelText(/^Nombres$/i), "Andres");
    await user.type(screen.getByLabelText(/Apellidos/i), "Sanchez");
    await user.type(screen.getByLabelText(/Identificación/i), "123456");
    await user.type(screen.getByLabelText(/^Correo Electrónico$/i), "a@b.com");
    await user.type(screen.getByLabelText(/Contraseña/i), "1234");
    await user.type(screen.getByLabelText(/^Teléfono$/i), "3007654321");
    await user.type(screen.getByLabelText(/^Dirección$/i), "Calle 2");
    await user.type(screen.getByLabelText(/Fecha de Nacimiento/i), "1990-01-01");
    await user.type(screen.getByLabelText(/Ciudad/i), "Bogotá");

    await user.click(screen.getByRole("button", { name: /Registrar Empresa y Gerente/i }));

    expect(global.alert).toHaveBeenCalledWith("Error al registrar empresa y gerente");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("valida correo electrónico inválido", async () => {
    render(
      <MemoryRouter>
        <RegistrarEmpresa />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/^Correo Electrónico$/i);
    await user.type(emailInput, "correo-invalido");

    await user.click(screen.getByRole("button", { name: /Registrar Empresa y Gerente/i }));

    // La validación HTML5 bloquea el submit, no llama fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  

});
