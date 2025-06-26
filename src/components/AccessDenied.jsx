import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Lock as LockIcon } from '@mui/icons-material';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: 3,
        textAlign: 'center'
      }}
    >
      <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h3" component="h1" gutterBottom color="error">
        Acceso Denegado
      </Typography>
      
      <Typography variant="h6" component="p" color="text.secondary" mb={3}>
        No tienes permisos para acceder a esta sección.
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3, maxWidth: 500 }}>
        Esta área está restringida solo para administradores. 
        Si crees que esto es un error, contacta al administrador del sistema.
      </Alert>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        size="large"
      >
        Volver al Inicio
      </Button>
    </Box>
  );
};

export default AccessDenied;
