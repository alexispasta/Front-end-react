// src/tests/GestionNomina.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GestionNomina from "../components/GestionNomina";

// 🔹 Mock global fetch
global.fetch = jest.fn();

// 🔹 Mock de bootstrap.Modal
jest.mock("bootstrap", () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  })),
}));

// 🔹 Mock window.alert para pruebas de error
window.alert = jest.fn();

describe("GestionNomina", () => {
  const mockEmpleados = [
    { _id: "1", nombre: "Ana", apellido: "Lopez", codigo: "101" },
    { _id: "2", nombre: "Juan", apellido: "Perez", codigo: "102" },
  ];

  const mockNominas = [
    { _id: "n1", cedula: "101", cuenta: "123", salario: 2000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("muestra mensaje si no hay empresaId en localStorage", () => {
    render(<GestionNomina onVolver={() => {}} />);
    expect(
      screen.getByText("❌ No se encontró empresa del usuario logueado.")
    ).toBeInTheDocument();
  });

  test("muestra error si fetch de empleados falla", async () => {
    localStorage.setItem("empresaId", "123");
    fetch.mockResolvedValueOnce({ ok: false, text: async () => "Error empleados" });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<GestionNomina onVolver={() => {}} />);
    expect(await screen.findByText("Error al cargar datos")).toBeInTheDocument();
  });

  test("carga empleados y nómina correctamente", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockNominas });

    render(<GestionNomina onVolver={() => {}} />);
    expect(await screen.findByText("Ana Lopez")).toBeInTheDocument();
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getAllByText(/Crear Nómina|Editar Nómina/i).length).toBe(2);
  });

  test("abre formulario al hacer clic en Crear Nómina", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockNominas });

    render(<GestionNomina onVolver={() => {}} />);
    const boton = await screen.findByText("Editar Nómina");
    fireEvent.click(boton);

    expect(await screen.findByText("Información de Nómina")).toBeInTheDocument();
    expect(screen.getByLabelText("Cuenta Bancaria")).toBeInTheDocument();
  });

  test("guardar nómina muestra modal", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockNominas })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: "n2", cedula: "102" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => [...mockNominas, { _id: "n2", cedula: "102" }] });

    render(<GestionNomina onVolver={() => {}} />);
    fireEvent.click(await screen.findAllByText("Crear Nómina").then(btns => btns[0]));

    fireEvent.change(screen.getByLabelText("Cuenta Bancaria"), { target: { value: "999" } });
    fireEvent.change(screen.getByLabelText("Salario Base"), { target: { value: "1500" } });

    fireEvent.click(screen.getByText("Guardar Cambios"));

    await waitFor(() => {
      expect(require("bootstrap").Modal).toHaveBeenCalled();
    });
  });

  test("cierra formulario al hacer clic en Cancelar", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockNominas });

    render(<GestionNomina onVolver={() => {}} />);
    fireEvent.click(await screen.findByText("Editar Nómina"));
    fireEvent.click(screen.getByText("Cancelar"));

    expect(screen.queryByText("Información de Nómina")).not.toBeInTheDocument();
  });

  test("botón Volver llama a onVolver", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => mockNominas });

    const onVolverMock = jest.fn();
    render(<GestionNomina onVolver={onVolverMock} />);
    fireEvent.click(screen.getByText(/← Volver al Menú/i));
    expect(onVolverMock).toHaveBeenCalled();
  });

  


  test("muestra mensaje de error si POST/PUT falla", async () => {
    localStorage.setItem("empresaId", "123");
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmpleados })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Fallo al guardar" }) });

    render(<GestionNomina onVolver={() => {}} />);
    fireEvent.click((await screen.findAllByText("Crear Nómina"))[0]);

    fireEvent.change(screen.getByLabelText("Cuenta Bancaria"), { target: { value: "555" } });
    fireEvent.change(screen.getByLabelText("Salario Base"), { target: { value: "1000" } });

    fireEvent.click(screen.getByText("Guardar Cambios"));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Fallo al guardar"));
  });

  test("carga tabla con mensaje de 'Cargando empleados...' mientras carga", async () => {
    localStorage.setItem("empresaId", "123");
    let resolveFetch;
    fetch.mockReturnValueOnce(
      new Promise((res) => { resolveFetch = res; })
    );

    render(<GestionNomina onVolver={() => {}} />);
    expect(screen.getByText("Cargando empleados...")).toBeInTheDocument();
    resolveFetch({ ok: true, json: async () => [] });
  });
});
