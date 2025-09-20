// src/tests/GestionPermisos.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import GestionPermisos from "../components/GestionPermisos"; 
import "@testing-library/jest-dom";

// Mock de fetch global
global.fetch = jest.fn();

// Mock de localStorage
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => "empresa123");
});

beforeEach(() => {
  jest.clearAllMocks();
  // Mock window.alert
  window.alert = jest.fn();
  // Mock window.confirm
  window.confirm = jest.fn(() => true);
});

describe("Componente GestionPermisos", () => {
  const permisosMock = [
    { _id: "1", empleadoNombre: "Ana", motivo: "Viaje", createdAt: new Date(), estado: "pendiente" },
    { _id: "2", empleadoNombre: "Juan", motivo: "Cita médica", createdAt: new Date(), estado: "aprobado" },
  ];

  test("muestra mensaje de 'No hay solicitudes' si no hay permisos", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<GestionPermisos onVolver={() => {}} />);

    await waitFor(() => {
      expect(
        screen.getByText(/No hay solicitudes de permisos/i)
      ).toBeInTheDocument();
    });
  });

  test("muestra permisos cargados en la tabla", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => permisosMock });

    render(<GestionPermisos onVolver={() => {}} />);

    expect(await screen.findByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Viaje")).toBeInTheDocument();
    expect(screen.getByText("pendiente")).toBeInTheDocument();

    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Cita médica")).toBeInTheDocument();
    expect(screen.getByText("aprobado")).toBeInTheDocument();
  });

  test("aprueba un permiso pendiente y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [permisosMock[0]] }) // carga inicial
      .mockResolvedValueOnce({ ok: true }) // PUT
      .mockResolvedValueOnce({ ok: true, json: async () => [{ ...permisosMock[0], estado: "aprobado" }] }); // recarga

    render(<GestionPermisos onVolver={() => {}} />);

    const btnAprobar = await screen.findByText("Aprobar");
    fireEvent.click(btnAprobar);

    await waitFor(() => {
      expect(screen.getByText(/Permiso aprobado correctamente/i)).toBeInTheDocument();
      expect(screen.getByText("aprobado")).toBeInTheDocument();
    });
  });

  test("rechaza un permiso pendiente y muestra mensaje de éxito", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [permisosMock[0]] }) // carga inicial
      .mockResolvedValueOnce({ ok: true }) // PUT
      .mockResolvedValueOnce({ ok: true, json: async () => [{ ...permisosMock[0], estado: "rechazado" }] }); // recarga

    render(<GestionPermisos onVolver={() => {}} />);

    const btnRechazar = await screen.findByText("Rechazar");
    fireEvent.click(btnRechazar);

    await waitFor(() => {
      expect(screen.getByText(/Permiso rechazado correctamente/i)).toBeInTheDocument();
      expect(screen.getByText("rechazado")).toBeInTheDocument();
    });
  });

  test("elimina un permiso individual y actualiza la tabla", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [permisosMock[0]] }) // carga inicial
      .mockResolvedValueOnce({ ok: true }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // recarga

    render(<GestionPermisos onVolver={() => {}} />);

    const btnEliminar = await screen.findByText("Eliminar");
    fireEvent.click(btnEliminar);

    await waitFor(() => {
      expect(screen.getByText(/Permiso eliminado correctamente/i)).toBeInTheDocument();
      expect(screen.getByText(/No hay solicitudes de permisos/i)).toBeInTheDocument();
    });
  });

  test("elimina todos los permisos cuando confirma", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => permisosMock }) // carga inicial
      .mockResolvedValueOnce({ ok: true }); // DELETE todos

    render(<GestionPermisos onVolver={() => {}} />);

    const btnEliminarTodos = await screen.findByText(/Eliminar TODOS los permisos/i);
    fireEvent.click(btnEliminarTodos);

    await waitFor(() => {
      expect(screen.getByText(/Todos los permisos eliminados/i)).toBeInTheDocument();
    });
  });

  test("no elimina todos los permisos si cancela confirmación", async () => {
    window.confirm = jest.fn(() => false); // cancelar

    fetch.mockResolvedValueOnce({ ok: true, json: async () => permisosMock }); // carga inicial

    render(<GestionPermisos onVolver={() => {}} />);

    const btnEliminarTodos = await screen.findByText(/Eliminar TODOS los permisos/i);
    fireEvent.click(btnEliminarTodos);

    await waitFor(() => {
      expect(screen.queryByText(/Todos los permisos eliminados/i)).not.toBeInTheDocument();
    });
  });

  test("muestra mensaje de error si fetch de permisos falla", async () => {
    fetch.mockRejectedValueOnce(new Error("Error de red"));

    render(<GestionPermisos onVolver={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Error de red/i)).toBeInTheDocument();
    });
  });

  test("muestra mensaje de error si PUT falla al aprobar/rechazar", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [permisosMock[0]] }) // carga inicial
      .mockResolvedValueOnce({ ok: false }); // PUT falla

    render(<GestionPermisos onVolver={() => {}} />);

    const btnAprobar = await screen.findByText("Aprobar");
    fireEvent.click(btnAprobar);

    await waitFor(() => {
      expect(screen.getByText(/No se pudo actualizar el permiso/i)).toBeInTheDocument();
    });
  });

  test("botón Volver llama a onVolver", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); // carga inicial
    const onVolverMock = jest.fn();

    render(<GestionPermisos onVolver={onVolverMock} />);
    fireEvent.click(screen.getByText(/← Volver al Menú/i));

    expect(onVolverMock).toHaveBeenCalled();
  });
});
