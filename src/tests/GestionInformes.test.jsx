import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import GestionInformes from "../components/GestionInformes";

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem("empresaId", "empresa123");
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(window, "confirm").mockImplementation(() => true);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GestionInformes", () => {
  const mockInformes = [
    { _id: "1", nombre: "Informe A", descripcion: "Desc A", createdAt: new Date().toISOString() },
    { _id: "2", nombre: "Informe B", descripcion: "", createdAt: new Date().toISOString() },
  ];

  test("muestra mensaje cuando no hay informes", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<GestionInformes onVolver={() => {}} />);
    expect(await screen.findByText(/No hay informes registrados/i)).toBeInTheDocument();
  });

  test("carga y muestra informes correctamente", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockInformes });
    render(<GestionInformes onVolver={() => {}} />);
    expect(await screen.findByText(/Informe A/i)).toBeInTheDocument();
    expect(screen.getByText(/Informe B/i)).toBeInTheDocument();
  });

  test("crea un informe y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // carga inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Informe creado" }) }) // POST
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }); // recarga

    render(<GestionInformes onVolver={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Nombre del informe/i), { target: { value: "Informe A" } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: "Desc A" } });
    fireEvent.click(screen.getByText(/Crear Informe/i));

    expect(await screen.findByText(/Informe creado correctamente/i)).toBeInTheDocument();
    expect(await screen.findByText(/Informe A/i)).toBeInTheDocument();
  });

  test("consulta informe seleccionado", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }) // carga inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ nombre: "Informe A", descripcion: "Desc A" }) }); // GET

    render(<GestionInformes onVolver={() => {}} />);
    await screen.findByText(/Informe A/i);

    fireEvent.click(screen.getAllByText(/Consultar/i)[0]);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Informe: Informe A")));
  });

  test("elimina un informe y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }) // carga inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Informe eliminado" }) }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => [mockInformes[1]] }); // recarga

    render(<GestionInformes onVolver={() => {}} />);
    const fila = await screen.findByText("Informe A");
    const row = fila.closest("tr");
    const eliminarBtn = within(row).getByText(/Eliminar/i);

    fireEvent.click(eliminarBtn);
    expect(await screen.findByText(/Informe eliminado/i)).toBeInTheDocument();
    expect(screen.queryByText(/Informe A/i)).not.toBeInTheDocument();
  });

  test("muestra error si falla eliminar informe individual", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }) // carga inicial
      .mockResolvedValueOnce({ ok: false }); // DELETE falla

    render(<GestionInformes onVolver={() => {}} />);
    const fila = await screen.findByText("Informe A");
    const row = fila.closest("tr");
    const eliminarBtn = within(row).getByText(/Eliminar/i);

    fireEvent.click(eliminarBtn);
    expect(await screen.findByText(/Error al eliminar informe/i)).toBeInTheDocument();
  });

  test("elimina todos los informes y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }) // carga inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Todos eliminados" }) }) // DELETE all
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // recarga

    render(<GestionInformes onVolver={() => {}} />);
    await screen.findByText("Informe A"); // asegurar que los informes están cargados
    fireEvent.click(screen.getByText(/Eliminar Todos/i));

    expect(await screen.findByText(/Todos los informes eliminados/i)).toBeInTheDocument();
  });

  test("muestra error si falla eliminar todos los informes", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockInformes }) // carga inicial
      .mockResolvedValueOnce({ ok: false }); // DELETE all falla

    render(<GestionInformes onVolver={() => {}} />);
    await screen.findByText("Informe A"); // asegurar que los informes están cargados
    fireEvent.click(screen.getByText(/Eliminar Todos/i));

    expect(await screen.findByText(/Error al eliminar informes/i)).toBeInTheDocument();
  });

  test("botón Volver llama a onVolver", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    const onVolverMock = jest.fn();
    render(<GestionInformes onVolver={onVolverMock} />);
    fireEvent.click(screen.getByText(/← Volver al Menú/i));
    expect(onVolverMock).toHaveBeenCalled();
  });
});
