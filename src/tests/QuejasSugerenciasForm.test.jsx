import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import QuejasSugerenciasForm from "../components/ComplaintForm"; // corregido
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("QuejasSugerenciasForm", () => {
  const onBackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = undefined;
  });

  test("renderiza el formulario correctamente", () => {
    render(<QuejasSugerenciasForm onBack={onBackMock} />);
    
    expect(screen.getByText(/Quejas y Sugerencias/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Volver/i })).toBeInTheDocument();
  });

  test("envía el formulario correctamente y muestra mensaje de éxito", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ message: "¡Mensaje enviado correctamente!" }),
      })
    );

    render(<QuejasSugerenciasForm onBack={onBackMock} />);

    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: "Prueba" } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: "Contenido de prueba" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/quejas",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asunto: "Prueba", mensaje: "Contenido de prueba" }),
      })
    );

    expect(await screen.findByText(/¡Mensaje enviado correctamente!/i)).toBeInTheDocument();

    act(() => { jest.runAllTimers(); });

    expect(screen.queryByText(/¡Mensaje enviado correctamente!/i)).not.toBeInTheDocument();
  });

  test("muestra mensaje de error si fetch falla", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    render(<QuejasSugerenciasForm onBack={onBackMock} />);

    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: "Prueba" } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: "Contenido de prueba" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));
    });

    expect(await screen.findByText(/Error al enviar la queja o sugerencia/i)).toBeInTheDocument();
  });

  test("el botón volver llama a onBack", () => {
    render(<QuejasSugerenciasForm onBack={onBackMock} />);
    fireEvent.click(screen.getByRole("button", { name: /Volver/i }));
    expect(onBackMock).toHaveBeenCalled();
  });
});
