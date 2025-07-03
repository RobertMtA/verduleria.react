import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CssBaseline,
  Alert,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80vh",
  padding: theme.spacing(4),
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  marginTop: theme.spacing(3),
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        setError("Error inesperado del servidor.");
        setLoading(false);
        return;
      }

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "No se pudo enviar el correo. Intenta nuevamente.");
        console.error("Error backend:", data.error);
      }
    } catch (err) {
      setError("No se pudo enviar el correo. Intenta nuevamente.");
      console.error("Error fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <StyledContainer component="main">
        <CssBaseline />
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            ¡Correo enviado!
          </Typography>
          <Typography variant="body1" paragraph>
            Hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Si no ves el correo, revisa tu carpeta de spam.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ mt: 3 }}
          >
            Volver al inicio de sesión
          </Button>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer component="main">
      <CssBaseline />
      <Box textAlign="center">
        <Typography component="h1" variant="h4">
          Recuperar contraseña
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Typography>
      </Box>

      <StyledForm onSubmit={handleSubmit}>
        <Box sx={{ mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2, height: "48px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Enviar enlace"
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Volver al inicio de sesión
          </Button>
        </Box>
      </StyledForm>
    </StyledContainer>
  );
};

export default ForgotPassword;
