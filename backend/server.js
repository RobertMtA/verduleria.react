import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Instala con: npm install node-fetch

const ACCESS_TOKEN = 'TEST-8823875515856581-062100-7403bf2c717e78cea313b61ed2f47a2a-792003923';

import usersRoutes from './routes/users.js';
import pool from './config/db.js';
import authRouter from "./api/auth.js";
import productosRouter from "./api/productos.js";
import reportesRouter from './api/reportes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para crear preferencia de pago
app.post('/api/crear-preferencia', async (req, res) => {
  const { items, email } = req.body;
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: items.map(item => ({
          title: String(item.title),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        })),
        payer: { email: String(email) },
        back_urls: {
          success: "https://tusitio.com/confirmacion",
          failure: "https://tusitio.com/error",
          pending: "https://tusitio.com/pending"
        },
        auto_return: "approved"
      })
    });
    const data = await response.json();
    if (data.init_point) {
      res.json({ init_point: data.init_point });
    } else {
      console.error("Error Mercado Pago:", data);
      res.status(500).json({ error: data.message || 'Error al crear preferencia' });
    }
  } catch (error) {
    console.error("Error Mercado Pago:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Rutas de productos
app.use("/api/productos", productosRouter);

// Rutas de usuarios
app.use('/api/users', usersRoutes);

// Rutas de reportes
app.use('/api/reportes', reportesRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Verdulería Online');
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

export default pool;

