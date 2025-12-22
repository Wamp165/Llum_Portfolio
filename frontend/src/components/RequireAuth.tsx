import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../config";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setOk(false);
      return;
    }

    fetch(`${API_URL}/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => setOk(res.ok));
  }, []);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/admin/login" replace />;

  return children;
}
