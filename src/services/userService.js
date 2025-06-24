export async function updateUser(datos) {
  const response = await fetch("http://localhost/api/perfil.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return await response.json();
}