import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  // Simulación de usuario autenticado
  res.json({
    user: {
      id: 1,
      email: req.body.email,
      nombre: "Admin",
      role: "admin" // <-- agrega este campo
    },
    token: "ejemplo-token"
  });
});

export default router;