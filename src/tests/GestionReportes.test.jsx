// src/tests/GestionReportes.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GestionReportes from "../components/GestionReportes";

// 🔹 Mock de fetch global
global.fetch = jest.fn();

// 🔹 Mock de localStorage
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => "empresa123");
});

// Reset mocks entre tests
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("GestionReportes", () => {
  const empleadosMock = [
    { _id: "e1", nombre: "Juan", apellido: "Pérez", codigo: "EMP001" },
    { _id: "e2", nombre: "Ana", apellido: "López", codigo: "EMP002" },
  ];

  const reportesMock = [
    { _id: "r1", asunto: "Reporte 1", descripcion: "Desc 1", personaId: empleadosMock[0], createdAt: new Date().toISOString() },
    { _id: "r2", asunto: "Reporte 2", descripcion: "Desc 2", personaId: empleadosMock[1], createdAt: new Date().toISOString() },
  ];

  test("muestra mensaje cuando no hay empleados ni reportes", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // empleados
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // reportes

    render(<GestionReportes onVolver={() => {}} />);
    expect(await screen.findByText(/No hay empleados/i)).toBeInTheDocument();
    expect(await screen.findByText(/No hay reportes registrados/i)).toBeInTheDocument();
  });

  test("muestra empleados en la lista", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => empleadosMock })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<GestionReportes onVolver={() => {}} />);
    expect(await screen.findByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/\(EMP001\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana López/i)).toBeInTheDocument();
  });

  test("permite crear un nuevo reporte y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => empleadosMock })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true }) // POST
      .mockResolvedValueOnce({ ok: true, json: async () => [reportesMock[0]] }); // recarga

    render(<GestionReportes onVolver={() => {}} />);

    // Seleccionar el primer botón "Crear Informe"
    const botonesCrear = await screen.findAllByText(/Crear Informe/i);
    fireEvent.click(botonesCrear[0]);

    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: "Reporte 1" } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: "Desc 1" } });

    fireEvent.click(screen.getByText(/Guardar Informe/i));

    await waitFor(() => {
      expect(screen.getByText(/Reporte enviado correctamente/i)).toBeInTheDocument();
      expect(screen.getByText(/Reporte 1/i)).toBeInTheDocument();
    });
  });

  test("muestra error si POST falla al crear reporte", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => empleadosMock })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: false }); // POST falla

    render(<GestionReportes onVolver={() => {}} />);

    const botonesCrear = await screen.findAllByText(/Crear Informe/i);
    fireEvent.click(botonesCrear[0]);
    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: "Reporte 1" } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: "Desc 1" } });
    fireEvent.click(screen.getByText(/Guardar Informe/i));

    await waitFor(() => {
      expect(screen.getByText(/Error al enviar reporte/i)).toBeInTheDocument();
    });
  });

  test("permite seleccionar y consultar un reporte", async () => {
    window.alert = jest.fn();

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock[0] }); // consultar

    render(<GestionReportes onVolver={() => {}} />);

    // Seleccionar el primer reporte usando data-testid
    const checkboxReporte = await screen.findByTestId("checkbox-r1");
    fireEvent.click(checkboxReporte);

    fireEvent.click(screen.getByText(/Consultar/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("📌 Asunto:"));
    });
  });

  test("muestra error si intenta consultar sin seleccionar", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<GestionReportes onVolver={() => {}} />);
    fireEvent.click(await screen.findByText(/Consultar/i));

    await waitFor(() => {
      expect(screen.getByText(/Seleccione un reporte/i)).toBeInTheDocument();
    });
  });

  test("elimina un reporte individual", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock })
      .mockResolvedValueOnce({ ok: true }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // recarga

    render(<GestionReportes onVolver={() => {}} />);
    const checkboxReporte = await screen.findByTestId("checkbox-r1");
    fireEvent.click(checkboxReporte);
    fireEvent.click(screen.getByText(/Eliminar Seleccionado/i));

    await waitFor(() => {
      expect(screen.getByText(/Reporte eliminado/i)).toBeInTheDocument();
    });
  });

  test("no elimina reporte si confirma cancelación", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => false);

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock });

    render(<GestionReportes onVolver={() => {}} />);
    const checkboxReporte = await screen.findByTestId("checkbox-r1");
    fireEvent.click(checkboxReporte);
    fireEvent.click(screen.getByText(/Eliminar Seleccionado/i));

    await waitFor(() => {
      expect(screen.queryByText(/Reporte eliminado/i)).not.toBeInTheDocument();
    });
  });

  test("elimina todos los reportes", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock })
      .mockResolvedValueOnce({ ok: true }); // DELETE all

    render(<GestionReportes onVolver={() => {}} />);
    fireEvent.click(await screen.findByText(/Eliminar Todos/i));

    await waitFor(() => {
      expect(screen.getByText(/Todos los reportes eliminados/i)).toBeInTheDocument();
    });
  });

  test("no elimina todos los reportes si confirma cancelación", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => false);

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => reportesMock });

    render(<GestionReportes onVolver={() => {}} />);
    fireEvent.click(await screen.findByText(/Eliminar Todos/i));

    await waitFor(() => {
      expect(screen.queryByText(/Todos los reportes eliminados/i)).not.toBeInTheDocument();
    });
  });

  test("muestra mensaje de error si fetch inicial falla", async () => {
    fetch.mockRejectedValueOnce(new Error("Error de red"));

    render(<GestionReportes onVolver={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/Error de red/i)).toBeInTheDocument();
    });
  });

  test("botón Volver llama a onVolver", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    const onVolverMock = jest.fn();
    render(<GestionReportes onVolver={onVolverMock} />);
    fireEvent.click(screen.getByText(/Volver/i));

    expect(onVolverMock).toHaveBeenCalled();
  });
});
