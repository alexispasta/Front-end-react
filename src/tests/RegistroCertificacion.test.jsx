// src/tests/RegistroCertificacion.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RegistroCertificacion from "../components/RegistroCertificacion";
import "@testing-library/jest-dom";

global.alert = jest.fn();
global.confirm = jest.fn(() => true);

describe("RegistroCertificacion", () => {
  const personaId = "123";
  const empresaId = "456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("carga certificados al inicio", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [
          { _id: "1", nombre: "Certificado A", fecha: new Date().toISOString(), archivoUrl: "/uploads/a.pdf" },
        ],
      })
    );

    await act(async () => {
      render(<RegistroCertificacion personaId={personaId} empresaId={empresaId} onVolver={() => {}} />);
    });

    expect(await screen.findByText(/Certificado A/)).toBeInTheDocument();
  });

  test("muestra alerta si intentas guardar sin nombre o archivo", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    );

    await act(async () => {
      render(<RegistroCertificacion personaId={personaId} empresaId={empresaId} onVolver={() => {}} />);
    });

    fireEvent.click(screen.getByText(/Guardar certificado/i));
    expect(global.alert).toHaveBeenCalledWith("⚠️ Debes ingresar nombre y seleccionar archivo");
  });

  test("guarda un certificado correctamente", async () => {
    const nuevoCertificado = {
      _id: "2",
      nombre: "Nuevo Certificado",
      fecha: new Date().toISOString(),
      archivoUrl: "/uploads/b.pdf",
    };

    global.fetch = jest.fn()
      // GET inicial
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // POST
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ certificado: nuevoCertificado }),
      });

    await act(async () => {
      render(<RegistroCertificacion personaId={personaId} empresaId={empresaId} onVolver={() => {}} />);
    });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Nuevo Certificado" } });
    const file = new File(["contenido"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText(/Cargar archivo/i), { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(screen.getByText(/Guardar certificado/i));
    });

    // Esperamos que React re-renderice el DOM con el nuevo certificado
    expect(await screen.findByText(/Nuevo Certificado/)).toBeInTheDocument();
    expect(global.alert).toHaveBeenCalledWith("✅ Certificado guardado correctamente");
  });

  test("elimina un certificado correctamente", async () => {
    // GET inicial con un certificado
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { _id: "3", nombre: "Eliminar Cert", fecha: new Date().toISOString(), archivoUrl: "/uploads/c.pdf" },
        ],
      })
      // DELETE
      .mockResolvedValueOnce({ ok: true });

    await act(async () => {
      render(<RegistroCertificacion personaId={personaId} empresaId={empresaId} onVolver={() => {}} />);
    });

    const btnEliminar = await screen.findByText("Eliminar");
    await act(async () => {
      fireEvent.click(btnEliminar);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("❌ Certificado eliminado");
      expect(screen.queryByText("Eliminar Cert", { selector: "strong" })).not.toBeInTheDocument();
    });
  });
});
