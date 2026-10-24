// ═══════════════════════════════════════════════════════════════════════════════
// CommerCity v2 - Cliente API Oficial
// Comunicación centralizada con el backend Express (http://localhost:3000)
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:3000';

let memoryToken = null;
let memoryUser = null;

// ── Gestión de Tokens y Sesión ────────────────────────────────────────────────
function getToken() {
  if (memoryToken) return memoryToken;
  try {
    return (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('commercity_token')) ||
           (typeof localStorage !== 'undefined' && localStorage.getItem('commercity_token')) || null;
  } catch (e) {
    return null;
  }
}

function setToken(token) {
  memoryToken = token;
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('commercity_token', token);
    if (typeof localStorage !== 'undefined') localStorage.setItem('commercity_token', token);
  } catch (e) {}
}

function clearToken() {
  memoryToken = null;
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('commercity_token');
    if (typeof localStorage !== 'undefined') localStorage.removeItem('commercity_token');
  } catch (e) {}
}

function getStoredUser() {
  if (memoryUser) return memoryUser;
  try {
    const raw = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('commercity_user')) ||
                (typeof localStorage !== 'undefined' && localStorage.getItem('commercity_user'));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setStoredUser(user) {
  memoryUser = user;
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('commercity_user', JSON.stringify(user));
    if (typeof localStorage !== 'undefined') localStorage.setItem('commercity_user', JSON.stringify(user));
  } catch (e) {}
}

function clearStoredUser() {
  memoryUser = null;
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('commercity_user');
    if (typeof localStorage !== 'undefined') localStorage.removeItem('commercity_user');
  } catch (e) {}
}

// ── Fetch Helper ─────────────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token && !headers['Authorization'] && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { raw: await res.text() };
    }

    if (!res.ok) {
      const errMsg = (data && data.error && (data.error.message || data.error)) ||
                     (data && data.message) ||
                     `Error HTTP ${res.status}: ${res.statusText}`;
      const err = new Error(errMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    throw err;
  }
}

// ── Formateador de URLs de Imágenes ──────────────────────────────────────────
function apiFormatImageUrl(img) {
  if (!img) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  if (img.startsWith('/')) {
    return `${API_BASE}${img}`;
  }
  return `${API_BASE}/${img}`;
}

// ── Módulo: Autenticación y Usuarios ─────────────────────────────────────────
async function apiLogin(email, password) {
  const res = await apiFetch('/api/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  if (res.success && res.data && res.data.token) {
    setToken(res.data.token);
    setStoredUser(res.data.user);
  }
  return res;
}

async function apiRegister(userData) {
  return await apiFetch('/api/usuarios/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });
}

async function apiLogout() {
  try {
    await apiFetch('/api/usuarios/logout', { method: 'POST' });
  } catch (e) {
    // Si falla la revocación en backend, limpiamos localmente de todos modos
  } finally {
    clearToken();
    clearStoredUser();
  }
}

async function apiGetPerfil() {
  return await apiFetch('/api/usuarios/me');
}

async function apiCambiarRol(rol_destino) {
  return await apiFetch('/api/usuarios/me/rol', {
    method: 'PATCH',
    body: JSON.stringify({ rol_destino }),
  });
}

async function apiSolicitarRecuperacion(email) {
  return await apiFetch('/api/usuarios/recover', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

async function apiRestablecerPassword(token, password) {
  return await apiFetch('/api/usuarios/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
    skipAuth: true,
  });
}

async function apiGetPerfilPublico(id) {
  return await apiFetch(`/api/usuarios/perfil-publico/${encodeURIComponent(id)}`, {
    skipAuth: true,
  });
}

// ── Módulo: Catálogo y Productos ─────────────────────────────────────────────
async function apiGetProductos(params = {}) {
  const query = new URLSearchParams();
  if (params.pagina) query.set('pagina', params.pagina);
  if (params.limite) query.set('limite', params.limite);
  if (params.buscar) query.set('buscar', params.buscar);
  if (params.categoria && params.categoria !== 'Todos') query.set('categoria', params.categoria);
  if (params.vendedor) query.set('vendedor', params.vendedor);

  const qs = query.toString();
  return await apiFetch(`/api/productos${qs ? '?' + qs : ''}`, { skipAuth: true });
}

async function apiGetCategorias() {
  return await apiFetch('/api/categorias', { skipAuth: true });
}

async function apiGetProductoDetalle(id) {
  return await apiFetch(`/api/productos/${id}`, { skipAuth: true });
}

async function apiValidarStock(id) {
  return await apiFetch(`/api/productos/${id}/validar-stock`, { skipAuth: true });
}

// ── Módulo: Carrito de Compras (RF109 - Contrato Real sin JWT) ────────────────
async function apiGetCarrito(compradorId) {
  if (!compradorId) throw new Error('compradorId es requerido');
  return await apiFetch(`/api/carrito?comprador_id=${encodeURIComponent(compradorId)}`, { skipAuth: true });
}

async function apiAgregarAlCarrito(compradorId, productoId, cantidad = 1) {
  return await apiFetch('/api/carrito', {
    method: 'POST',
    body: JSON.stringify({
      comprador_id: Number(compradorId),
      producto_id: Number(productoId),
      cantidad: Number(cantidad),
    }),
    skipAuth: true,
  });
}

async function apiEliminarDelCarrito(productoId, compradorId) {
  return await apiFetch(`/api/carrito/${encodeURIComponent(productoId)}?comprador_id=${encodeURIComponent(compradorId)}`, {
    method: 'DELETE',
    skipAuth: true,
  });
}

async function apiModificarCantidadCarrito(productoId, compradorId, cantidad) {
  return await apiFetch(`/api/carrito/${encodeURIComponent(productoId)}?comprador_id=${encodeURIComponent(compradorId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ cantidad: Number(cantidad) }),
    skipAuth: true,
  });
}

// ── Módulo: Pedidos, Resumen y Checkout (Con JWT) ─────────────────────────────
async function apiGetResumenPedido() {
  return await apiFetch('/api/pedidos/resumen');
}

async function apiConfirmarPago(pagoData) {
  return await apiFetch('/api/pedidos/confirmar-pago', {
    method: 'POST',
    body: JSON.stringify(pagoData),
  });
}

async function apiActualizarEstadoPedido(id, estado) {
  return await apiFetch(`/api/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });
}

// ── Módulo: Historial de Compras y Cancelación ────────────────────────────────
async function apiGetHistorialCompras(estado = null) {
  const query = estado && estado !== 'Todo' ? `?estado=${encodeURIComponent(estado)}` : '';
  return await apiFetch(`/api/historial/compras${query}`);
}

async function apiCancelarPedido(detalleId) {
  return await apiFetch(`/api/historial/compras/${encodeURIComponent(detalleId)}/cancelar`, {
    method: 'POST',
  });
}

// ── Módulo: Vendedor / Mi Tienda ──────────────────────────────────────────────
async function apiGetVentasVendedor(params = {}) {
  const query = new URLSearchParams();
  if (params.pagina) query.set('pagina', params.pagina);
  if (params.limite) query.set('limite', params.limite);
  if (params.estado && params.estado !== 'Todo') query.set('estado', params.estado);
  const qs = query.toString();
  return await apiFetch(`/api/tienda/ventas${qs ? '?' + qs : ''}`);
}

async function apiGetDashboardStats() {
  return await apiFetch('/api/tienda/dashboard/stats');
}

// ── Módulo: Administración (Requiere rol administrador) ───────────────────────
async function apiGetAdminStats() {
  return await apiFetch('/api/admin/stats');
}

async function apiGetAdminUsuarios(params = {}) {
  const query = new URLSearchParams();
  if (params.pagina) query.set('pagina', params.pagina);
  if (params.buscar) query.set('buscar', params.buscar);
  const qs = query.toString();
  return await apiFetch(`/api/admin/usuarios${qs ? '?' + qs : ''}`);
}

async function apiGetAdminProductos(params = {}) {
  const query = new URLSearchParams();
  if (params.pagina) query.set('pagina', params.pagina);
  if (params.buscar) query.set('buscar', params.buscar);
  const qs = query.toString();
  return await apiFetch(`/api/admin/productos${qs ? '?' + qs : ''}`);
}

async function apiGetAdminReportes(params = {}) {
  const query = new URLSearchParams();
  if (params.pagina) query.set('pagina', params.pagina);
  if (params.estado) query.set('estado', params.estado);
  const qs = query.toString();
  return await apiFetch(`/api/admin/reportes${qs ? '?' + qs : ''}`);
}

async function apiResolverReporte(id, respuesta) {
  return await apiFetch(`/api/admin/reportes/${encodeURIComponent(id)}/resolver`, {
    method: 'PATCH',
    body: JSON.stringify({ respuesta }),
  });
}

// ── Módulo: Seguidores (RF101–103) ───────────────────────────────────────────
async function apiGetSeguidores() {
  return await apiFetch('/api/seguidores/seguidores');
}

async function apiGetSiguiendo() {
  return await apiFetch('/api/seguidores/siguiendo');
}

async function apiSeguirUsuario(seguidoId) {
  return await apiFetch('/api/seguidores', {
    method: 'POST',
    body: JSON.stringify({ seguido_id: Number(seguidoId) }),
  });
}

async function apiDejarDeSeguir(seguidoId) {
  return await apiFetch(`/api/seguidores/${encodeURIComponent(seguidoId)}`, {
    method: 'DELETE',
  });
}

// ── Módulo: Notificaciones (RF95–100 / RF101–104) ────────────────────────────
async function apiGetNotificaciones(params = {}) {
  const query = new URLSearchParams();
  if (params.tipo) query.set('tipo', params.tipo);
  if (params.limite) query.set('limite', params.limite);
  const qs = query.toString();
  return await apiFetch(`/api/notificaciones${qs ? '?' + qs : ''}`);
}

async function apiGetNotificacionesNoLeidas() {
  return await apiFetch('/api/notificaciones/no-leidas');
}

async function apiMarcarNotificacionLeida(id) {
  return await apiFetch(`/api/notificaciones/${encodeURIComponent(id)}/leida`, {
    method: 'PATCH',
  });
}

async function apiMarcarTodasNotificacionesLeidas() {
  return await apiFetch('/api/notificaciones/leidas', {
    method: 'PATCH',
  });
}

async function apiEliminarNotificacion(id) {
  return await apiFetch(`/api/notificaciones/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

async function apiEliminarTodasNotificaciones() {
  return await apiFetch('/api/notificaciones', {
    method: 'DELETE',
  });
}

// ── Módulo: Chat Interno (RF12–15, RF105) ────────────────────────────────
async function apiEnviarMensaje(receptorId, mensaje, archivo = null) {
  if (archivo) {
    const formData = new FormData();
    formData.append('receptor_id', Number(receptorId));
    if (mensaje) formData.append('mensaje', mensaje);
    formData.append('archivo', archivo);
    return await apiFetch('/api/chat', {
      method: 'POST',
      body: formData,
    });
  }
  return await apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ receptor_id: Number(receptorId), mensaje }),
  });
}

async function apiGetConversaciones() {
  return await apiFetch('/api/chat/conversaciones');
}

async function apiGetMensajesConversacion(usuarioId) {
  return await apiFetch(`/api/chat/mensajes/${encodeURIComponent(usuarioId)}`);
}

async function apiMarcarMensajeLeido(mensajeId) {
  return await apiFetch(`/api/chat/mensajes/${encodeURIComponent(mensajeId)}/leido`, {
    method: 'PATCH',
  });
}

// ── Módulo: Calificaciones (RF84–86, RF107) ──────────────────────────────
async function apiCalificarVendedor(pedidoId, estrellas, comentario = null, vendedorId = null) {
  const body = { pedido_id: Number(pedidoId), estrellas: Number(estrellas) };
  if (comentario) body.comentario = comentario;
  if (vendedorId) body.vendedor_id = Number(vendedorId);
  return await apiFetch('/api/calificaciones/vendedor', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function apiCalificarProducto(pedidoId, productoId, estrellas, comentario = null) {
  const body = {
    pedido_id: Number(pedidoId),
    producto_id: Number(productoId),
    estrellas: Number(estrellas),
  };
  if (comentario) body.comentario = comentario;
  return await apiFetch('/api/calificaciones/producto', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ── Exportación ───────────────────────────────────────────────────────────────
const API = {
  API_BASE,
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  apiFetch,
  apiFormatImageUrl,
  // Auth
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetPerfil,
  apiCambiarRol,
  apiSolicitarRecuperacion,
  apiRestablecerPassword,
  apiGetPerfilPublico,
  // Catalogo
  apiGetProductos,
  apiGetCategorias,
  apiGetProductoDetalle,
  apiValidarStock,
  // Carrito
  apiGetCarrito,
  apiAgregarAlCarrito,
  apiEliminarDelCarrito,
  apiModificarCantidadCarrito,
  // Pedidos
  apiGetResumenPedido,
  apiConfirmarPago,
  apiActualizarEstadoPedido,
  // Historial
  apiGetHistorialCompras,
  apiCancelarPedido,
  // Tienda
  apiGetVentasVendedor,
  apiGetDashboardStats,
  // Admin
  apiGetAdminStats,
  apiGetAdminUsuarios,
  apiGetAdminProductos,
  apiGetAdminReportes,
  apiResolverReporte,
  // Seguidores
  apiGetSeguidores,
  apiGetSiguiendo,
  apiSeguirUsuario,
  apiDejarDeSeguir,
  // Notificaciones
  apiGetNotificaciones,
  apiGetNotificacionesNoLeidas,
  apiMarcarNotificacionLeida,
  apiMarcarTodasNotificacionesLeidas,
  apiEliminarNotificacion,
  apiEliminarTodasNotificaciones,
  // Chat
  apiEnviarMensaje,
  apiGetConversaciones,
  apiGetMensajesConversacion,
  apiMarcarMensajeLeido,
  // Calificaciones
  apiCalificarVendedor,
  apiCalificarProducto,
};

// Exportar globalmente en window para el navegador/Electron y module.exports si existe
if (typeof window !== 'undefined') {
  window.API = API;
  Object.assign(window, API);
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
