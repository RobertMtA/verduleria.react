// Keep-alive script para mantener activa la instancia de Render
// Usar con servicios como cron-job.org o UptimeRobot

const BACKEND_URL = 'https://verduleria-backend-m19n.onrender.com'; // URL real de Render

const keepAlive = async () => {
  try {
    // Usar endpoint que sabemos que funciona
    const response = await fetch(`${BACKEND_URL}/api/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Keep-alive successful at ${new Date().toISOString()}`);
    } else {
      console.log(`⚠️ Keep-alive returned status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Keep-alive failed: ${error.message}`);
  }
};

// Para uso con servicios de cron
if (typeof module !== 'undefined' && module.exports) {
  module.exports = keepAlive;
}

// Para ejecución directa
if (typeof window === 'undefined') {
  keepAlive();
}
