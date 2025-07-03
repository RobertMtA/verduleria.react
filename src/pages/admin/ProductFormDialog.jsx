import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography
} from "@mui/material";
import { getImageUrl } from "../../utils/imageUtils";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const categoriasDisponibles = [
  "Frutas",
  "Verduras", 
  "Lácteos",
  "Carnes",
  "Panadería",
  "Bebidas",
  "General",
  "Otros"
];

const ProductFormDialog = ({ open, onClose, product, onSave, loading }) => {
  const [formData, setFormData] = React.useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    activo: true,
    imagen: ""
  });

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [imageError, setImageError] = React.useState("");

  React.useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || 0,
        stock: product.stock || 0,
        categoria: product.categoria || "",
        activo: product.activo === 1 || product.activo === "1" || product.activo === true ? true : false,
        imagen: product.image || ""
      });
      // Limpiar imagen preview cuando se abre el modal para editar
      setImagePreview("");
      setSelectedImage(null);
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria: "",
        activo: true,
        imagen: ""
      });
      setImagePreview("");
      setSelectedImage(null);
    }
    setImageError("");
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Solo se permiten archivos JPG, PNG o WebP");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("La imagen no puede superar 5MB");
        return;
      }

      setSelectedImage(file);
      setImageError("");
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Subir imagen al servidor
  const uploadImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('image', file);

    try {
      setUploadingImage(true);
      console.log('🚀 Subiendo imagen:', file.name);
      
      const response = await fetch(`${API_URL}/upload-image`, {
        method: 'POST',
        body: formDataImg
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Imagen subida exitosamente:', data);
      return data.imagePath; // Retorna la ruta de la imagen
    } catch (error) {
      console.error('💥 Error al subir imagen:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    let finalFormData = { ...formData, activo: !!formData.activo };

    // Si hay una imagen seleccionada, subirla primero
    if (selectedImage) {
      try {
        const imagePath = await uploadImage(selectedImage);
        finalFormData.image = imagePath;
      } catch (error) {
        setImageError("Error al subir la imagen: " + error.message);
        return;
      }
    }

    onSave(finalFormData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? "Editar Producto" : "Nuevo Producto"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="product-name"
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="product-category"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  label="Categoría"
                  required
                >
                  {categoriasDisponibles.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="product-price"
                label="Precio"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="product-stock"
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="product-description"
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="product-active"
                    name="activo"
                    checked={!!formData.activo}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Producto activo"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Imagen del Producto
              </Typography>
              <input
                accept="image/*"
                id="image-upload"
                name="imagen"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button 
                  variant="contained" 
                  component="span"
                  color="primary"
                  disabled={uploadingImage}
                  sx={{ mr: 2 }}
                >
                  {uploadingImage ? "Subiendo..." : (selectedImage ? "Cambiar Imagen" : "Subir Imagen")}
                </Button>
              </label>
              {selectedImage && (
              <Typography variant="caption" color="text.secondary">
                {selectedImage.name}
              </Typography>
            )}
            {imagePreview && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <img 
                  src={imagePreview} 
                  alt="Vista previa" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 8, objectFit: 'cover' }}
                />
                <Button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview("");
                  }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    padding: 0,
                    minHeight: 0
                  }}
                >
                  ×
                </Button>
              </Box>
            )}
            
            {/* Mostrar imagen actual cuando se está editando */}
            {!imagePreview && formData.imagen && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Imagen actual:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <img 
                    src={getImageUrl(formData.imagen)} 
                    alt="Imagen actual" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: 8, 
                      objectFit: 'cover',
                      border: '1px solid #ddd'
                    }}
                    onError={(e) => {
                      console.error('Error cargando imagen:', formData.imagen);
                      console.error('URL construida:', getImageUrl(formData.imagen));
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
              </Box>
            )}
            {imageError && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {imageError}
              </Typography>
            )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading || uploadingImage}
        >
          {uploadingImage ? "Subiendo imagen..." : (loading ? "Guardando..." : "Guardar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
