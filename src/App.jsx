import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/estaticos/Header';
import Footer from './components/estaticos/Footer';
import './styles/global.css';

// Componentes de carga optimizados
const Loader = () => (
  <div className="full-page-loader">
    <div className="loader-spinner"></div>
    <p>Cargando los productos más frescos...</p>
  </div>
);

// Componentes de debug
const DebugProfile = lazy(() => import('./components/DebugProfile'));
const Debug = lazy(() => import('./pages/Debug'));

// Layouts con pre-carga
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

// Páginas públicas con carga diferida agrupada
const PublicPages = {
  Home: lazy(() => import('./pages/Home')),
  Products: lazy(() => import('./pages/Products')),
  ProductoDetalle: lazy(() => import('./pages/ProductDetail')),
  Login: lazy(() => import('./pages/Login')),
  Register: lazy(() => import('./pages/Register')),
  Contacto: lazy(() => import('./pages/Contacto')),
  Ofertas: lazy(() => import('./pages/Ofertas')),
  Resenas: lazy(() => import('./pages/Resenas')),
  About: lazy(() => import('./pages/About')),
  Cart: lazy(() => import('./pages/Cart')),
  ForgotPassword: lazy(() => import('./pages/ForgotPassword')),
  ResetPassword: lazy(() => import('./pages/ResetPassword')),
  ConfirmacionPedido: lazy(() => import('./pages/ConfirmacionPedido')),
  HistorialPedidos: lazy(() => import('./pages/HistorialPedidos')),
  SeguimientoEntrega: lazy(() => import('./pages/SeguimientoEntrega')),
  Status: lazy(() => import('./pages/Status'))
};

// Páginas protegidas
const ProtectedPages = {
  Checkout: lazy(() => import('./pages/Checkout')),
  Profile: lazy(() => import('./pages/Profile'))
};

// Páginas de administración
const AdminPages = {
  Dashboard: lazy(() => import('./pages/admin/Dashboard')),
  Products: lazy(() => import('./pages/admin/ProductsAdmin')), // <-- aquí
  Orders: lazy(() => import('./pages/admin/Orders')),
  Panel: lazy(() => import('./pages/admin/AdminPanel')),
  NuevoProducto: lazy(() => import('./pages/admin/NuevoProducto')),
  Usuarios: lazy(() => import('./pages/admin/Usuarios')),
  Reportes: lazy(() => import('./pages/admin/Reportes')),
  Suscripciones: lazy(() => import('./pages/admin/Suscripciones')),
  EditarPedido: lazy(() => import('./pages/admin/EditarPedido')),
  PedidosAdmin: lazy(() => import('./pages/admin/PedidosAdmin')),
  ProductsAdmin: lazy(() => import('./pages/admin/ProductsAdmin')),
  ReseñasAdmin: lazy(() => import('./pages/admin/ReseñasAdmin')),
  AdminChat: lazy(() => import('./components/AdminChat')),
  AdminOfertas: lazy(() => import('./components/AdminOfertas')),
  AdminEstadisticas: lazy(() => import('./components/AdminEstadisticas')),
  MapaAdmin: lazy(() => import('./pages/admin/MapaAdmin'))
};

// Páginas de pago de MercadoPago
const PaymentPages = {
  PaymentSuccess: lazy(() => import('./pages/PaymentSuccess')),
  PaymentFailure: lazy(() => import('./pages/PaymentFailure')),
  PaymentPending: lazy(() => import('./pages/PaymentPending')),
  TransferInstructions: lazy(() => import('./pages/TransferInstructions'))
};

// Componentes de ruta mejorados
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute roles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

// Scroll to top en cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Rutas públicas con layout principal */}
            <Route element={<MainLayout />}>
              <Route index element={<PublicPages.Home />} />
              <Route path="/productos">
                <Route index element={<PublicPages.Products />} />
                <Route path=":id" element={<PublicPages.ProductoDetalle />} />
                <Route path="categoria/:category" element={<PublicPages.Products />} />
              </Route>
              
              <Route path="carrito" element={<PublicPages.Cart />} />
              <Route path="login" element={<PublicPages.Login />} />
              <Route path="registro" element={<PublicPages.Register />} />
              <Route path="contacto" element={<PublicPages.Contacto />} />
              <Route path="ofertas" element={<PublicPages.Ofertas />} />
              <Route path="resenas" element={<PublicPages.Resenas />} />
              <Route path="/about" element={<PublicPages.About />} />
              <Route path="status" element={<PublicPages.Status />} />
              <Route path="confirmacion-pedido" element={<PublicPages.ConfirmacionPedido />} />
              <Route path="/forgot-password" element={<PublicPages.ForgotPassword />} />
              <Route path="/reset-password/:token" element={<PublicPages.ResetPassword />} />

              {/* Rutas de resultado de pagos MercadoPago */}
              <Route path="pago-exitoso" element={<PaymentPages.PaymentSuccess />} />
              <Route path="pago-fallido" element={<PaymentPages.PaymentFailure />} />
              <Route path="pago-pendiente" element={<PaymentPages.PaymentPending />} />
              <Route path="instrucciones-transferencia" element={<PaymentPages.TransferInstructions />} />

              {/* Rutas protegidas */}
              <Route path="checkout" element={
                <ProtectedRoute>
                  <ProtectedPages.Checkout />
                </ProtectedRoute>
              } />
              
              <Route path="perfil">
                <Route index element={
                  <ProtectedRoute>
                    <ProtectedPages.Profile />
                  </ProtectedRoute>
                } />
                <Route path="pedidos" element={
                  <ProtectedRoute>
                    <Navigate to="/perfil" state={{ tab: 'orders' }} replace />
                  </ProtectedRoute>
                } />
                <Route path="seguimiento" element={
                  <ProtectedRoute>
                    <PublicPages.SeguimientoEntrega />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Ruta temporal de debug */}
              <Route path="debug" element={<DebugProfile />} />
              <Route path="debug-api" element={<Debug />} />
            </Route>

            {/* Rutas de administración */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminPages.Dashboard />} />
              <Route path="productos">
                <Route index element={<AdminPages.Products />} />
                <Route path="nuevo" element={<AdminPages.NuevoProducto />} />
              </Route>
              <Route path="pedidos" element={<AdminPages.PedidosAdmin />} />
              <Route path="reseñas" element={<AdminPages.ReseñasAdmin />} />
              <Route path="mapa" element={<AdminPages.MapaAdmin />} />
              <Route path="ofertas" element={<AdminPages.AdminOfertas />} />
              <Route path="chat" element={<AdminPages.AdminChat />} />
              <Route path="estadisticas" element={<AdminPages.AdminEstadisticas />} />
              <Route path="panel" element={<AdminPages.Panel />} />
              <Route path="usuarios" element={<AdminPages.Usuarios />} />
              <Route path="reportes" element={<AdminPages.Reportes />} />
              <Route path="suscripciones" element={<AdminPages.Suscripciones />} />
              <Route path="editar-pedido/:id" element={<AdminPages.EditarPedido />} />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={
              <MainLayout>
                <div className="not-found">
                  <h2>404 - Fruta no encontrada</h2>
                  <p>La página que buscas no está en nuestro canasto.</p>
                  <Link to="/" className="btn-primary">Volver al inicio</Link>
                </div>
              </MainLayout>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
