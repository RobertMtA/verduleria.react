// backend/api/ofertas.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schema para ofertas
const OfertaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio_original: { type: Number, required: true },
  precio_oferta: { type: Number, required: true },
  descuento_porcentaje: { type: Number, required: true },
  imagen: { type: String, default: '' },
  activa: { type: Boolean, default: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  producto_id: { type: String }, // ID del producto relacionado (opcional)
  categoria: { type: String, default: 'general' },
  stock_limitado: { type: Number, default: null }, // Stock limitado para la oferta
  creado_en: { type: Date, default: Date.now },
  actualizado_en: { type: Date, default: Date.now }
});

// Middleware para actualizar fecha de modificación
OfertaSchema.pre('save', function() {
  this.actualizado_en = new Date();
});

const Oferta = mongoose.models.Oferta || mongoose.model('Oferta', OfertaSchema);

// GET /api/ofertas - Obtener todas las ofertas (públicas)
router.get("/", async (req, res) => {
  try {
    const { activas_solo } = req.query;
    const ahora = new Date();
    
    let filtro = {};
    
    if (activas_solo === 'true') {
      filtro = {
        activa: true,
        fecha_inicio: { $lte: ahora },
        fecha_fin: { $gte: ahora }
      };
    }

    const ofertas = await Oferta.find(filtro).sort({ creado_en: -1 });
    
    // Calcular el descuento automáticamente si no está definido
    const ofertasConDescuento = ofertas.map(oferta => {
      const descuento = oferta.descuento_porcentaje || 
        Math.round(((oferta.precio_original - oferta.precio_oferta) / oferta.precio_original) * 100);
      
      return {
        ...oferta.toObject(),
        descuento_porcentaje: descuento,
        vigente: oferta.fecha_inicio <= ahora && oferta.fecha_fin >= ahora
      };
    });

    res.json({
      success: true,
      ofertas: ofertasConDescuento
    });
  } catch (error) {
    console.error("Error obteniendo ofertas:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// GET /api/ofertas/admin - Obtener todas las ofertas (admin)
router.get("/admin", async (req, res) => {
  try {
    const ofertas = await Oferta.find({}).sort({ creado_en: -1 });
    const ahora = new Date();
    
    const ofertasConEstado = ofertas.map(oferta => ({
      ...oferta.toObject(),
      vigente: oferta.fecha_inicio <= ahora && oferta.fecha_fin >= ahora,
      expirada: oferta.fecha_fin < ahora,
      futura: oferta.fecha_inicio > ahora
    }));

    res.json({
      success: true,
      ofertas: ofertasConEstado
    });
  } catch (error) {
    console.error("Error obteniendo ofertas admin:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// POST /api/ofertas - Crear nueva oferta
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio_original,
      precio_oferta,
      imagen,
      fecha_inicio,
      fecha_fin,
      producto_id,
      categoria,
      stock_limitado
    } = req.body;

    // Validaciones
    if (!nombre || !descripcion || !precio_original || !precio_oferta || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios"
      });
    }

    if (precio_oferta >= precio_original) {
      return res.status(400).json({
        success: false,
        error: "El precio de oferta debe ser menor al precio original"
      });
    }

    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      return res.status(400).json({
        success: false,
        error: "La fecha de fin debe ser posterior a la fecha de inicio"
      });
    }

    // Calcular descuento
    const descuento_porcentaje = Math.round(((precio_original - precio_oferta) / precio_original) * 100);

    const nuevaOferta = new Oferta({
      nombre,
      descripcion,
      precio_original: parseFloat(precio_original),
      precio_oferta: parseFloat(precio_oferta),
      descuento_porcentaje,
      imagen: imagen || '',
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      producto_id,
      categoria: categoria || 'general',
      stock_limitado: stock_limitado ? parseInt(stock_limitado) : null
    });

    await nuevaOferta.save();

    res.status(201).json({
      success: true,
      message: "Oferta creada exitosamente",
      oferta: nuevaOferta
    });
  } catch (error) {
    console.error("Error creando oferta:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// PUT /api/ofertas/:id - Actualizar oferta
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de oferta inválido"
      });
    }

    // Recalcular descuento si se actualizan los precios
    if (updateData.precio_original && updateData.precio_oferta) {
      updateData.descuento_porcentaje = Math.round(
        ((updateData.precio_original - updateData.precio_oferta) / updateData.precio_original) * 100
      );
    }

    const ofertaActualizada = await Oferta.findByIdAndUpdate(
      id,
      { ...updateData, actualizado_en: new Date() },
      { new: true, runValidators: true }
    );

    if (!ofertaActualizada) {
      return res.status(404).json({
        success: false,
        error: "Oferta no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Oferta actualizada exitosamente",
      oferta: ofertaActualizada
    });
  } catch (error) {
    console.error("Error actualizando oferta:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// DELETE /api/ofertas/:id - Eliminar oferta
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de oferta inválido"
      });
    }

    const ofertaEliminada = await Oferta.findByIdAndDelete(id);

    if (!ofertaEliminada) {
      return res.status(404).json({
        success: false,
        error: "Oferta no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Oferta eliminada exitosamente"
    });
  } catch (error) {
    console.error("Error eliminando oferta:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// PATCH /api/ofertas/:id/toggle - Activar/Desactivar oferta
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de oferta inválido"
      });
    }

    const oferta = await Oferta.findById(id);

    if (!oferta) {
      return res.status(404).json({
        success: false,
        error: "Oferta no encontrada"
      });
    }

    oferta.activa = !oferta.activa;
    oferta.actualizado_en = new Date();
    await oferta.save();

    res.json({
      success: true,
      message: `Oferta ${oferta.activa ? 'activada' : 'desactivada'} exitosamente`,
      oferta
    });
  } catch (error) {
    console.error("Error cambiando estado de oferta:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

export default router;
