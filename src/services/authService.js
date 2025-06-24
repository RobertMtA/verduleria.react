export async function login(email, password) {
  const response = await fetch('http://localhost/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error en login');
  return data;
}

export async function register(nombre, email, password) {
  const response = await fetch('http://localhost/api/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error en registro');
  return data;
}