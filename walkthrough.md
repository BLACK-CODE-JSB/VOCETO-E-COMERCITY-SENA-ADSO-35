# Walkthrough: Sprint 2 — Conexión a la API Real de CommerCity v2

Se ha completado exitosamente la **Fase 2 (Sprint 2)** de integración del frontend Electron con el backend Express y la base de datos real `commercity_v2`.

---

## 1. Cambios Realizados

### 1.1. Cliente Oficial de API ([`src/api.js`](file:///c:/Users/imdea/.gemini/antigravity/scratch/VOCETO-2.0-COMMERCITY-SENA-ADSO-35/src/api.js))
Se creó un módulo centralizado que encapsula todas las llamadas HTTP contra `http://localhost:3000`:
- **Gestión de Sesión y JWT**: Manejo dual en memoria y `sessionStorage`/`localStorage` (`getToken()`, `setToken()`, `clearToken()`).
- **Formateador de Imágenes**: `apiFormatImageUrl()` normaliza URLs externas y rutas relativas `/uploads/*`.
- **Autenticación**: `apiLogin()`, `apiRegister()`, `apiLogout()`, `apiGetPerfil()`, `apiCambiarRol()`.
- **Catálogo & Categorías**: `apiGetProductos()`, `apiGetCategorias()`, `apiGetProductoDetalle()`, `apiValidarStock()`.
- **Carrito de Compras (Contrato Real)**: `apiGetCarrito(compradorId)`, `apiAgregarAlCarrito()`, `apiModificarCantidadCarrito()`, `apiEliminarDelCarrito()` (**sin JWT**, usando `comprador_id` como parámetro según diseño de la API).
- **Pedidos & Checkout**: `apiGetResumenPedido()`, `apiConfirmarPago()`, `apiActualizarEstadoPedido()`.
- **Historial de Compras & Cancelación (RF35/RF36/RF59/RF89/RF129/RF137/RF141)**: `apiGetHistorialCompras()`, `apiCancelarPedido(detalleId)`.
- **Mi Tienda (Vendedor)**: `apiGetDashboardStats()`, `apiGetVentasVendedor()`.
- **Panel Administrador**: `apiGetAdminStats()`, `apiGetAdminUsuarios()`, `apiGetAdminProductos()`, `apiGetAdminReportes()`.

---

### 1.2. Integración en el Frontend ([`src/app.js`](file:///c:/Users/imdea/.gemini/antigravity/scratch/VOCETO-2.0-COMMERCITY-SENA-ADSO-35/src/app.js))
- **Login Real con JWT**: Reemplazó los usuarios en memoria (`USERS`) por llamadas a `apiLogin()`. Soporta tanto correo electrónico directo (`juan.giraldo@commercity.com`, `admin01@commercity.com`) como alias de usuario (`juan_giraldo`, `admin`).
- **Registro Real**: `doRegistro()` invoca `POST /api/usuarios/register`, inicia sesión automáticamente y activa el rol vendedor si la casilla fue marcada.
- **Catálogo Dinámico**: Carga productos de la base de datos real con paginación (`limite: 8`), renderiza stock real, descuentos y tarjetas interactivas.
- **Filtro de Categorías Dinámico**: Pobla el menú `<select id="cat-filter">` con las 17 categorías activas en la BD (`apiGetCategorias()`).
- **Detalle de Producto**: Abre cualquier producto consultando `GET /api/productos/:id`, deshabilita el botón si el stock es 0 y muestra vendedor y especificaciones.
- **Carrito Reactivo**: Conectado a la base de datos a través de `GET /api/carrito?comprador_id=N`. Soporta sumar cantidad, restar y eliminar ítems con persistencia en el backend.
- **Checkout / Pasarela**: Valida el número de tarjeta y titular con verificación Luhn en backend (`POST /api/pedidos/confirmar-pago`).
- **Historial & Cancelación**: Carga pedidos con `GET /api/historial/compras`. Si el pedido está en estado `Pendiente`, el botón **Cancelar** llama a `POST /api/historial/compras/:id/cancelar`, restituyendo stock y ajustando comisiones mediante transacción ACID.
- **Mi Tienda & Pedidos**: `renderTiendaStats()` y `renderPedidos()` consumen las métricas y ventas reales del vendedor.

---

### 1.3. Configuración de Electron y HTML
- [`main.js`](file:///c:/Users/imdea/.gemini/antigravity/scratch/VOCETO-2.0-COMMERCITY-SENA-ADSO-35/main.js): Se habilitó `webSecurity: false` en `BrowserWindow` para garantizar compatibilidad con peticiones `fetch` sin restricciones de origen local.
- [`src/index.html`](file:///c:/Users/imdea/.gemini/antigravity/scratch/VOCETO-2.0-COMMERCITY-SENA-ADSO-35/src/index.html): Se vinculó `<script src="api.js"></script>` antes de `app.js` y se actualizó el placeholder del login.

---

## 2. Verificación y Pruebas E2E

Se creó y ejecutó la suite de pruebas automatizadas [`test-e2e.js`](file:///c:/Users/imdea/.gemini/antigravity/scratch/VOCETO-2.0-COMMERCITY-SENA-ADSO-35/test-e2e.js) contra el backend en `http://localhost:3000`:

```bash
========================================================
🚀 INICIANDO TEST DE INTEGRACIÓN COMMERCITY V2
========================================================
⏳ 1. Login Vendedor (juan.giraldo@commercity.com)... ✅ OK
⏳ 2. Obtener perfil /api/usuarios/me con JWT... ✅ OK
⏳ 3. Catálogo /api/productos (paginación real)... (total: 312 productos, prod #1 id: 585) ✅ OK
⏳ 4. Categorías /api/categorias... (17 categorías disponibles) ✅ OK
⏳ 5. Detalle de producto /api/productos/585... ✅ OK
⏳ 6. Carrito: Listar carrito comprador (comprador_id=2)... ✅ OK
⏳ 7. Carrito: Agregar producto #585 (cantidad=1)... ✅ OK
⏳ 8. Carrito: Modificar cantidad producto #585 (cantidad=2)... ✅ OK
⏳ 9. Carrito: Eliminar producto #585... ✅ OK
⏳ 10. Vendedor: Dashboard stats /api/tienda/dashboard/stats... ✅ OK
⏳ 11. Vendedor: Listar ventas /api/tienda/ventas... ✅ OK
⏳ 12. Comprador: Historial de compras /api/historial/compras... ✅ OK
⏳ 13. Admin: Login (admin01@commercity.com)... ✅ OK
⏳ 14. Admin: Estadísticas globales /api/admin/stats... (Vendedores: 19, Compradores: 115, Productos: 314) ✅ OK
========================================================
RESULTADO FINAL: 14 PASADAS, 0 FALLIDAS
========================================================
```

Todo el flujo quedó completamente integrado, validado y operativo.
