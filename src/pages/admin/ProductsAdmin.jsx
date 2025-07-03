import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import corsProxyService from "../../services/corsProxyService";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Pagination
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ProductFormDialog from "./ProductFormDialog";
import useProducts from "../../hooks/useProducts";

const ProductsAdmin = () => {
  // Usa el hook con paginación
  const { products, loading, error, pagination, fetchProducts } = useProducts();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const itemsPerPage = 10;

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      setFormLoading(true);
      console.log("Eliminando producto con ID:", productId);
      
      const result = await corsProxyService.fetchWithProxy(`/productos/${productId}`, {
        method: "DELETE"
      });
      
      console.log("Resultado:", result);
      
      if (!result.success) {
        throw new Error(result.error || "Error al eliminar producto");
      }
      
      enqueueSnackbar(result.message || "Producto eliminado correctamente", { variant: "success" });
      fetchProducts(pagination.page, itemsPerPage);
    } catch (err) {
      console.error("Error completo:", err);
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      setFormLoading(true);
      let endpoint = "/productos";
      let method = "POST";

      // Para actualizar un producto existente
      if (selectedProduct) {
        endpoint = `/productos/${selectedProduct._id || selectedProduct.id}`;
        method = "PUT";
      }

      console.log("Enviando datos:", { method, endpoint, productData }); // Para debug

      const result = await corsProxyService.fetchWithProxy(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      console.log("Respuesta del servidor:", result); // Para debug

      if (!result.success) {
        throw new Error(result.error || "Error al guardar producto");
      }

      setOpenDialog(false);
      setSelectedProduct(null);
      enqueueSnackbar(
        result.message || `Producto ${selectedProduct ? "actualizado" : "creado"} correctamente`,
        { variant: "success" }
      );

      fetchProducts(pagination.page, itemsPerPage);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      enqueueSnackbar(`Error al guardar producto: ${err.message}`, { variant: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  // En el manejo de paginación:
  const handlePageChange = (event, value) => {
    fetchProducts(value, itemsPerPage);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Recargar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 3
        }}>
          <Typography variant="h4" component="h1">
            Gestión de Productos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            disabled={loading}
          >
            Nuevo Producto
          </Button>
        </Box>

        {loading && products.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.nombre}</TableCell>
                        <TableCell>{product.categoria || "Sin categoría"}</TableCell>
                        <TableCell>${Number(product.precio).toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Chip 
                            label={product.activo ? "Activo" : "Inactivo"} 
                            color={product.activo ? "success" : "error"} 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => navigate(`/productos/${product.id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      <ProductFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        loading={formLoading}
      />
    </Box>
  );
};

export default ProductsAdmin;
