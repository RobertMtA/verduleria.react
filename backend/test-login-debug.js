import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('🔐 DIAGNÓSTICO DE PROBLEMAS DE LOGIN');
    console.log('=' .repeat(50));
    
    // Test 1: Verificar usuario existente
    console.log('\n👤 PASO 1: Verificando usuario existente...');
    
    // Usar el usuario que sabemos que existe
    const testCredentials = {
      email: 'robertogaona1985@gmail.com',
      password: 'nuevaContrasena' + '1719885701133' // La última que se cambió
    };
    
    console.log('📧 Email de prueba:', testCredentials.email);
    console.log('🔑 Probando con contraseña reciente...');
    
    const loginResponse = await fetch('http://localhost:4001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCredentials)
    });
    
    console.log('📡 Status de respuesta:', loginResponse.status);
    
    const loginData = await loginResponse.json();
    console.log('📦 Respuesta del servidor:', JSON.stringify(loginData, null, 2));
    
    if (loginData.success) {
      console.log('✅ Login exitoso con credenciales recientes');
    } else {
      console.log('❌ Login falló, probando con contraseña original...');
      
      // Test 2: Probar con contraseña original
      const originalCredentials = {
        email: 'robertogaona1985@gmail.com',
        password: 'password123' // Contraseña original
      };
      
      const loginResponse2 = await fetch('http://localhost:4001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalCredentials)
      });
      
      const loginData2 = await loginResponse2.json();
      console.log('📦 Respuesta con contraseña original:', JSON.stringify(loginData2, null, 2));
      
      if (loginData2.success) {
        console.log('✅ Login exitoso con contraseña original');
      } else {
        console.log('❌ Login falló con ambas contraseñas');
        
        // Test 3: Crear un usuario de prueba nuevo
        console.log('\n👤 PASO 3: Creando usuario de prueba...');
        
        const newUser = {
          nombre: 'Usuario Prueba',
          email: 'prueba' + Date.now() + '@test.com',
          password: 'password123',
          telefono: '123456789',
          direccion: 'Dirección de prueba'
        };
        
        const registerResponse = await fetch('http://localhost:4001/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        
        const registerData = await registerResponse.json();
        console.log('📦 Respuesta de registro:', JSON.stringify(registerData, null, 2));
        
        if (registerData.success) {
          console.log('✅ Usuario creado exitosamente');
          
          // Test 4: Login con nuevo usuario
          console.log('\n🔐 PASO 4: Probando login con nuevo usuario...');
          
          const newLoginResponse = await fetch('http://localhost:4001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: newUser.email,
              password: newUser.password
            })
          });
          
          const newLoginData = await newLoginResponse.json();
          console.log('📦 Respuesta de login nuevo:', JSON.stringify(newLoginData, null, 2));
          
          if (newLoginData.success) {
            console.log('✅ ¡Login funcionando correctamente!');
            console.log('🎯 El problema está en las credenciales del usuario existente');
          } else {
            console.log('❌ Problema en el sistema de login');
          }
        }
      }
    }
    
    // Diagnóstico de estado del servidor
    console.log('\n🔍 DIAGNÓSTICO DEL SERVIDOR:');
    console.log('=' .repeat(50));
    
    try {
      const healthResponse = await fetch('http://localhost:4001/api/productos');
      console.log('🌐 Servidor backend:', healthResponse.ok ? '✅ Funcionando' : '❌ Con problemas');
    } catch (error) {
      console.log('🌐 Servidor backend: ❌ No responde');
    }
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
  }
};

console.log('🚀 Iniciando diagnóstico de login...\n');
testLogin();
