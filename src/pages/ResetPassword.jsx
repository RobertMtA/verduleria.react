import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CssBaseline,
  Alert,
  CircularProgress,
  Paper
} from "@mui/material";
import PasswordStrengthBar from 'react-password-strength-bar';

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/reset_password`
  : "https://verduleria-backend-m19n.onrender.com/api/reset_password";

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: ""
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (passwordScore < 2) {
      setErrors(prev => ({ ...prev, form: "La contraseña es demasiado débil" }));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          newPassword: formData.password 
        }),
        credentials: "include"
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        setErrors(prev => ({ ...prev, form: "Respuesta inválida del servidor." }));
        setLoading(false);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al cambiar la contraseña");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            Enlace inválido o faltante
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate("/forgot-password")}
            fullWidth
          >
            Solicitar nuevo enlace
          </Button>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            ¡Contraseña cambiada! Redirigiendo...
          </Alert>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Restablecer Contraseña
          </Typography>
          
          {errors.form && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.form}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nueva contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="new-password"
            />
            
            <PasswordStrengthBar 
              password={formData.password} 
              onChangeScore={setPasswordScore}
              minLength={8}
              style={{ marginBottom: '16px' }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Cambiar Contraseña"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
