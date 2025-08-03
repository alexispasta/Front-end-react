import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    const userId = localStorage.getItem("userId");

    if (rol && userId) {
      setUser({ rol, userId });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("rol");
    localStorage.removeItem("userId");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, logout };
}
