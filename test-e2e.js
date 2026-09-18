// Test de Integración E2E Frontend Client contra commercity_v2
const API = require('./src/api.js');

async function runE2ETests() {
  console.log('========================================================');
  console.log('🚀 INICIANDO TEST DE INTEGRACIÓN COMMERCITY V2');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ ${name}... `);
      await fn();
      console.log('✅ OK');
      passed++;
    } catch (e) {
      console.log('❌ FALLÓ');
      console.error('   ', e.message || e);
      failed++;
    }
  }

  // 1. Login Vendedor
  let vendorToken = null;
  let vendorUser = null;
  await test('1. Login Vendedor (juan.giraldo@commercity.com)', async () => {
    const res = await API.apiLogin('juan.giraldo@commercity.com', '123456');
    if (!res.success || !res.data.token) throw new Error('No se recibió token');
    vendorToken = res.data.token;
    vendorUser = res.data.user;
    if (vendorUser.id !== 2) throw new Error(`ID de usuario inesperado: ${vendorUser.id}`);
  });

  // 2. Perfil autenticado
  await test('2. Obtener perfil /api/usuarios/me con JWT', async () => {
    const res = await API.apiGetPerfil();
    const user = res.data.user || res.data;
    if (!res.success || user.email !== 'juan.giraldo@commercity.com') {
      throw new Error('Perfil no coincide con el token');
    }
  });

  // 3. Catálogo de productos
  let testProductId = null;
  await test('3. Catálogo /api/productos (paginación real)', async () => {
    const res = await API.apiGetProductos({ pagina: 1, limite: 5 });
    if (!res.success || !Array.isArray(res.data.productos)) throw new Error('No retornó array de productos');
    if (res.data.productos.length === 0) throw new Error('Catálogo vacío');
    testProductId = res.data.productos[0].id;
    console.log(`(total: ${res.data.totalProductos} productos, prod #1 id: ${testProductId}) `);
  });

  // 4. Categorías
  await test('4. Categorías /api/categorias', async () => {
    const res = await API.apiGetCategorias();
    if (!res.success || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error('Categorías no retornó listado');
    }
    console.log(`(${res.data.length} categorías disponibles) `);
  });

  // 5. Detalle de producto
  await test(`5. Detalle de producto /api/productos/${testProductId}`, async () => {
    const res = await API.apiGetProductoDetalle(testProductId);
    if (!res.success || !res.data || res.data.id !== testProductId) {
      throw new Error('Detalle de producto incorrecto');
    }
  });

  // 6. Carrito: Flujo completo (listar, agregar, modificar cantidad, eliminar)
  await test('6. Carrito: Listar carrito comprador (comprador_id=2)', async () => {
    const res = await API.apiGetCarrito(2);
    if (!res.success || !res.data.vendedores) throw new Error('Respuesta inválida de carrito');
  });

  await test(`7. Carrito: Agregar producto #${testProductId} (cantidad=1)`, async () => {
    const res = await API.apiAgregarAlCarrito(2, testProductId, 1);
    if (!res.success) throw new Error('Fallo al agregar producto al carrito');
  });

  await test(`8. Carrito: Modificar cantidad producto #${testProductId} (cantidad=2)`, async () => {
    const res = await API.apiModificarCantidadCarrito(testProductId, 2, 2);
    if (!res.success) throw new Error('Fallo al modificar cantidad');
  });

  await test(`9. Carrito: Eliminar producto #${testProductId}`, async () => {
    const res = await API.apiEliminarDelCarrito(testProductId, 2);
    if (!res.success) throw new Error('Fallo al eliminar producto del carrito');
  });

  // 10. Dashboard Stats Tienda (Vendedor)
  await test('10. Vendedor: Dashboard stats /api/tienda/dashboard/stats', async () => {
    const res = await API.apiGetDashboardStats();
    if (!res.success || !res.data.tarjetas) throw new Error('Respuesta inválida de dashboard stats');
  });

  // 11. Ventas Vendedor
  await test('11. Vendedor: Listar ventas /api/tienda/ventas', async () => {
    const res = await API.apiGetVentasVendedor();
    if (!res.success || !res.data.items) throw new Error('Respuesta inválida de ventas');
  });

  // 12. Historial de compras comprador
  await test('12. Comprador: Historial de compras /api/historial/compras', async () => {
    const res = await API.apiGetHistorialCompras();
    if (!res.success) throw new Error('Respuesta inválida de historial');
  });

  // 13. Admin Login & Stats
  await test('13. Admin: Login (admin01@commercity.com)', async () => {
    const res = await API.apiLogin('admin01@commercity.com', '123456');
    if (!res.success || !res.data.token) throw new Error('Fallo login admin');
    if (!res.data.user.roles.includes('administrador')) throw new Error('Rol admin no encontrado');
  });

  await test('14. Admin: Estadísticas globales /api/admin/stats', async () => {
    const res = await API.apiGetAdminStats();
    if (!res.success || res.data.totalProductos === undefined) throw new Error('Stats admin incompletas');
    console.log(`(Vendedores: ${res.data.totalVendedores}, Compradores: ${res.data.totalCompradores}, Productos: ${res.data.totalProductos}) `);
  });

  console.log('========================================================');
  console.log(`RESULTADO FINAL: ${passed} PASADAS, ${failed} FALLIDAS`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runE2ETests();
