export function validatePassword(password) {
  if (!password) return "La contraseña es requerida";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  // Puedes agregar más validaciones aquí (mayúsculas, números, símbolos, etc.)
  return "";
}