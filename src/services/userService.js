export async function updateUser(datos) {
  const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";
  const response = await fetch(`${API_URL}/perfil`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return await response.json();
}
