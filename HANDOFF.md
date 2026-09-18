# CommerCity 2.0 — Handoff y Documentación Técnica de Entrega

## Descripción del Proyecto
Marketplace de escritorio desarrollado con **Electron.js**, conectado a la API REST oficial de **CommerCity v2** (Node.js/Express + MySQL `commercity_v2`). La aplicación implementa un diseño de alta fidelidad basado en Figma con tema oscuro, acentos en naranja institucional (`#ea580c`), tipografía moderna (*Plus Jakarta Sans* e *Inter*) y arquitectura modular para los roles de **Comprador**, **Vendedor** y **Administrador**.

- **Versión**: `2.0.0`
- **Hito**: **Sprint 2 — Fase 2: Conexión Integral de Clientes a la API Real**
- **Institución**: SENA — Centro de Diseño Tecnológico Industrial (ADSO 35, Cali, Colombia)
- **Fecha de Actualización**: Septiembre 2026

---

## 📋 Resumen de Modificaciones Realizadas (Sprint 2 - Fase 2)

Durante este sprint se llevó a cabo la transición definitiva desde datos simulados en memoria hacia una integración completa contra la API real en `http://localhost:3000`:

| Archivo | Tipo de Cambio | Descripción de la Modificación |
|---------|----------------|--------------------------------|
| `src/api.js` | **NUEVO** | Módulo cliente HTTP centralizado. Implementa el contrato estricto de la API v2: autenticación JWT, carrito por `comprador_id` (sin JWT), paginación de productos, checkout ACID con validación Luhn, cancelación con restitución de stock, métricas de Mi Tienda (90/10) y administración. Normalizador de imágenes `apiFormatImageUrl`. |
| `src/app.js` | **MODIFICADO** | Sustitución completa de lógica mock. Se enlazó el login/registro reactivo a la API con soporte para correos oficiales y alias. Carga dinámica del catálogo con paginación ("Cargar más piezas..."), categorías dinámicas desde BD (17 categorías), sincronización del carrito en servidor, pasarela de pago, historial con cancelación atómica, gestión de pedidos y métricas de vendedor/admin. |
| `src/index.html` | **MODIFICADO** | Inclusión de `<script src="api.js"></script>` antes de `app.js`. Actualización de placeholders en el formulario de inicio de sesión para admitir tanto correos oficiales (`@commercity.com`) como alias de acceso rápido. |
| `main.js` | **MODIFICADO** | Inclusión de `webSecurity: false` en las `webPreferences` del `BrowserWindow`. Esto permite que las peticiones `fetch()` originadas desde el protocolo `file://` en Electron alcancen sin restricciones de CORS el backend local en `http://localhost:3000`. |
| `test-e2e.js` | **NUEVO** | Suite de 14 pruebas de integración automatizadas de extremo a extremo contra la base de datos real `commercity_v2` cubriendo todo el ciclo: autenticación, perfil, catálogo, categorías, carrito, vendedor, historial y administración. |
| `HANDOFF.md` | **MODIFICADO** | Actualización integral de la documentación de transferencia, matriz de requerimientos funcionales, credenciales reales y guía paso a paso para evaluadores. |

---

## 🎯 Matriz de Requerimientos Funcionales (RF) Implementados

| Código RF | Módulo / Sección | Descripción del Requerimiento | Implementación y Verificación |
|-----------|------------------|--------------------------------|-------------------------------|
| **RF35** | Comprador / Historial | El sistema permite al comprador cancelar un pedido en el historial si está en estado "Pendiente", restituyendo stock y gestionando devolución. | Implementado con `POST /api/historial/compras/:id/cancelar`. La UI muestra el botón "Cancelar" exclusivamente en pedidos pendientes y actualiza el saldo/estado de inmediato. |
| **RF36** | Comprador / Historial | El pedido pendiente cancelado desaparece o se actualiza de inmediato del listado de compras activas. | La UI elimina reactivamente la tarjeta o la marca como cancelada y refresca el historial desde el servidor sin recargar la aplicación. |
| **RF59** | Administrador | La cancelación descuenta la comisión del 10% de las estadísticas globales del administrador. | Endpoint `GET /api/admin/stats` refleja la deducción en el total retenido por la plataforma tras la ejecución de la transacción en base de datos. |
| **RF89** | Productos / Stock | Al cancelar un pedido, el stock de cada producto involucrado se restituye automáticamente en la base de datos. | La transacción ACID del backend ejecuta `UPDATE productos SET stock = stock + cantidad`. Al recargar el detalle del producto (`GET /api/productos/:id`), el stock aparece actualizado. |
| **RF129** | Vendedor / Pedidos | El pedido cancelado desaparece de los pedidos pendientes del vendedor y se ajusta la contabilidad en "Mi Tienda". | La vista de pedidos (`GET /api/tienda/ventas`) filtra los pedidos activos y el dashboard descuenta la venta. |
| **RF137** | Vendedor / Tienda | Se descuenta el 90% del valor de la venta cancelada en las estadísticas del vendedor. | Dashboard de vendedor (`GET /api/tienda/dashboard/stats`) recalcula ingresos netos y unidades vendidas en tiempo real. |
| **RF141** | Vendedor / Envíos | Control de flujo de estados de un pedido: `Pendiente` → `En camino` → `Entregado`. | Implementado mediante `PATCH /api/pedidos/:id/estado` desde el panel de Pedidos del Vendedor. |

---

## 👥 Credenciales Reales y Roles en Base de Datos

El backend utiliza contraseñas cifradas con `bcrypt` en MySQL. Las credenciales válidas y activas para pruebas son:

| Rol | Usuario / Alias | Correo Electrónico Oficial | Contraseña | ID en BD | Permisos y Vistas Habilitadas |
|-----|-----------------|----------------------------|------------|----------|-------------------------------|
| **Vendedor** | `juan_giraldo` | `juan.giraldo@commercity.com` | `123456` | `2` | Home, Catálogo, Carrito, Perfil Vendedor, Mi Tienda (Estadísticas 90/10), Gestión de Pedidos, Historial. |
| **Administrador** | `admin` | `admin01@commercity.com` | `123456` | `471` | Panel de Control Exclusivo de Admin, Estadísticas Globales del Marketplace, Métricas de Usuarios y Productos. |
| **Comprador Nuevo** | *Dinámico* | *Cualquier correo válido* | *Definida por usuario* | Auto-inc | Registro mediante `POST /api/usuarios/register`, navegación, carrito, compra y cancelación. |

> [!TIP]
> En la pantalla de inicio de sesión puedes escribir tanto el correo completo (`juan.giraldo@commercity.com`) como el alias directo (`juan_giraldo` o `admin`).

---

## 🛠️ Estructura y Arquitectura del Proyecto

```
VOCETO-2.0-COMMERCITY-SENA-ADSO-35/
├── main.js                  # Proceso principal de Electron (BrowserWindow, webSecurity:false, IPC)
├── package.json             # Manifiesto npm con scripts: start, build, test
├── package-lock.json
├── test-e2e.js              # Suite de 14 pruebas E2E contra la API real en localhost:3000
├── README.md                # Presentación general del proyecto
├── HANDOFF.md               # Este documento técnico y guía de evaluación
└── src/
    ├── api.js               # Cliente HTTP oficial y adaptadores de la API REST
    ├── app.js               # Controlador de interfaz, lógica reactiva y renderizado
    ├── index.html           # Estructura de vistas, sidebars y modales (Single Page App)
    └── styles.css           # Sistema de diseño: paleta de colores, tipografía, responsive
```

---

## 🚀 Guía Paso a Paso para Despliegue y Pruebas

Sigue esta secuencia para levantar el entorno y verificar todas las funcionalidades:

### Paso 1: Verificar y Levantar el Backend
1. Ubícate en el directorio del backend:
   ```powershell
   cd "C:\Users\imdea\.gemini\antigravity\scratch\Commercity\backend"
   ```
2. Asegúrate de que el archivo `.env` contenga la contraseña rotada de la base de datos:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=Mydbcommercity2026
   DB_NAME=commercity_v2
   JWT_SECRET=commercity_jwt_secret_key_2026_secure
   ```
3. Inicia el servidor backend:
   ```powershell
   npm start
   ```
   *Salida esperada:* `Servidor creado con puerto http://localhost:3000`.

---

### Paso 2: Ejecutar los Tests de Integración Automatizados (E2E)
Antes de interactuar con la interfaz gráfica, corre la suite de pruebas para confirmar que la base de datos y la API están perfectamente sincronizadas:
1. Abre una nueva terminal en el directorio del cliente frontend:
   ```powershell
   cd "c:\Users\imdea\.gemini\antigravity\scratch\VOCETO-2.0-COMMERCITY-SENA-ADSO-35"
   ```
2. Ejecuta:
   ```powershell
   node test-e2e.js
   ```
3. **Resultado esperado**:
   ```
   ========================================================
   🚀 INICIANDO TEST DE INTEGRACIÓN COMMERCITY V2
   ========================================================
   ⏳ 1. Login Vendedor (juan.giraldo@commercity.com)... ✅ OK
   ⏳ 2. Obtener perfil /api/usuarios/me con JWT... ✅ OK
   ⏳ 3. Catálogo /api/productos (paginación real)... (total: 312 productos) ✅ OK
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

---

### Paso 3: Iniciar la Aplicación Desktop Electron
Inicia la aplicación de escritorio:
```powershell
npm start
```
Se desplegará la ventana nativa de CommerCity 2.0 con aceleración por hardware y diseño dark mode.

---

### Paso 4: Guía de Navegación y Pruebas Funcionales en la UI

#### 4.1. Inicio de Sesión como Vendedor
1. En la pantalla de login, ingresa:
   - **Usuario / Correo:** `juan_giraldo` (o `juan.giraldo@commercity.com`)
   - **Contraseña:** `123456`
2. Presiona **Entrar →**.
3. La aplicación valida el JWT en `POST /api/usuarios/login`, guarda la sesión y carga automáticamente la vista **Inicio** desbloqueando las opciones de vendedor en el sidebar lateral.

#### 4.2. Exploración del Catálogo y Filtros
1. Observa el grid de productos: las tarjetas se cargan desde `/api/productos` con títulos, imágenes reales formateadas, precios y stock.
2. Abre el selector de **Categorías**: comprobarás las 17 categorías activas de la BD (`Tecnología`, `Audio`, `Calzado`, `Ropa`, etc.).
3. Escribe en la barra de búsqueda superior (ej. `audifonos`): el catálogo filtra dinámicamente en tiempo real.
4. Desplázate al pie de página y haz clic en **"Cargar más piezas..."**: se realiza una petición paginada al backend (`limite=8&pagina=2`) agregando nuevos productos sin refrescar la página.

#### 4.3. Detalle de Producto y Carrito
1. Haz clic sobre cualquier producto para desplegar el modal interactivo de detalle (`prod-overlay`).
2. Consulta el stock en tiempo real y la descripción oficial.
3. Selecciona la cantidad y haz clic en **"Agregar al carrito"**.
4. Haz clic en **Carrito** en el sidebar izquierdo:
   - Los productos aparecen agrupados por vendedor.
   - Modifica las unidades con `+` o `−`: el backend actualiza la cantidad en la tabla de carrito mediante `PATCH /api/carrito/:id`.
   - Haz clic en el icono de papelera: el ítem se remueve mediante `DELETE /api/carrito/:id`.

#### 4.4. Pasarela de Pago (Checkout)
1. Con productos en el carrito, presiona **Comprar**.
2. En la pasarela de pago, ingresa un número de tarjeta válido que cumpla el algoritmo de Luhn (ejemplo de prueba: `4532 0151 1283 0366`), fecha futura y CVV.
3. Presiona **Confirmar Pago**: el backend ejecutará la transacción ACID, creando el pedido, reservando la comisión 90/10 y descontando el stock de MySQL.

#### 4.5. Cancelación de Pedidos y Restitución de Stock (RF35, RF36, RF89)
1. Dirígete a **Historial** en el sidebar lateral.
2. Localiza el pedido en estado `Pendiente`.
3. Haz clic en el botón **Cancelar**:
   - Se invoca `POST /api/historial/compras/:id/cancelar`.
   - La base de datos restituye inmediatamente las unidades al stock del producto.
   - El pedido pendiente desaparece del historial activo y se muestra una notificación de confirmación de reembolso.

#### 4.6. Gestión de Tienda y Envíos (Vendedor)
1. Haz clic en **Tienda** en el sidebar:
   - Se consulta `GET /api/tienda/dashboard/stats`.
   - Verás los ingresos brutos, la retención del 10% y las ganancias netas del 90%.
2. Haz clic en **Pedidos**:
   - Se listan las ventas recibidas (`GET /api/tienda/ventas`).
   - Puedes actualizar el estado del envío (`Pendiente` → `En camino` → `Entregado`) mediante `PATCH /api/pedidos/:id/estado`.

#### 4.7. Panel de Administrador (RF59)
1. Haz clic en **Cerrar Sesión** en el sidebar.
2. Inicia sesión con las credenciales de administrador:
   - **Usuario:** `admin` (o `admin01@commercity.com`)
   - **Contraseña:** `123456`
3. Serás redirigido a la vista de Administrador (`page-admin`), donde se consumen las estadísticas globales (`/api/admin/stats`):
   - Total de vendedores registrados en MySQL (19+).
   - Total de compradores activos (115+).
   - Total de productos publicados en la plataforma (314+).

---

## ⚡ Solución de Problemas Frecuentes (FAQ)

- **¿Qué hacer si aparece "Error de conexión con el servidor"?**  
  Asegúrate de que el backend esté corriendo en una terminal en `http://localhost:3000` y que MySQL tenga el servicio activo (`mysqld` o XAMPP/WAMP).
- **¿Por qué Electron permite peticiones locales sin error de CORS?**  
  Porque en `main.js` se definió explícitamente `webSecurity: false` dentro de `webPreferences`.
- **¿Qué formato de tarjeta exige la pasarela de pago?**  
  El endpoint `POST /api/pedidos/confirmar-pago` valida el número de tarjeta mediante el algoritmo de Luhn (ej. `4532015112830366`).
- **¿Dónde se guarda el token JWT?**  
  En `api.js` se gestiona con persistencia dual en memoria (`memoryToken`) y en el `sessionStorage`/`localStorage` de Electron para mantener la sesión activa entre recargas.

---

## 📦 Comandos de Referencia

| Comando | Función |
|---------|---------|
| `npm start` | Inicia la aplicación Electron en modo desarrollo |
| `node test-e2e.js` | Corre la suite completa de 14 pruebas de integración E2E |
| `npm install` | Instala las dependencias del proyecto |
| `npm run build` | Genera el ejecutable de distribución para Windows |

---
*Documento de Handoff Técnico — Proyecto CommerCity 2.0 SENA ADSO*
