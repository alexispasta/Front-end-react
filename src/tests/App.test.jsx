import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders texto de bienvenida", () => {
  render(<App />);
  expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
});
