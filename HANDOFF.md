# CommerCity 2.0 — Handoff y Documentación Técnica de Entrega

## Descripción del Proyecto
Marketplace de escritorio desarrollado con **Electron.js**, conectado a la API REST oficial de **CommerCity v2** (Node.js/Express + MySQL `commercity_v2`). La aplicación implementa un diseño de alta fidelidad basado en Figma con tema oscuro, acentos en naranja institucional (`#ea580c`), tipografía moderna (*Plus Jakarta Sans* e *Inter*) y arquitectura modular para los roles de **Comprador**, **Vendedor** y **Administrador**.

- **Versión**: `2.0.0`
- **Hito**: **Sprint 3 — Integración Integral de Todos los Requerimientos Funcionales del SRS a la API Real**
- **Institución**: SENA — Centro de Diseño Tecnológico Industrial (ADSO 35, Cali, Colombia)
- **Fecha de Actualización**: Octubre 2026

---

## 📋 Resumen de Modificaciones Realizadas

Durante estos sprints se llevó a cabo la transición definitiva desde datos simulados en memoria hacia una integración completa contra la API real en `http://localhost:3000`:

| Archivo | Tipo de Cambio | Descripción de la Modificación |
|---------|----------------|--------------------------------|
| `src/api.js` | **NUEVO** | Módulo cliente HTTP centralizado. Implementa el contrato estricto de la API v2: autenticación JWT, carrito por `comprador_id` (sin JWT), paginación de productos, checkout ACID con validación Luhn, cancelación con restitución de stock, métricas de Mi Tienda (90/10), administración, recuperación de contraseñas (5 min), perfil público, notificaciones, seguidores, chat bidireccional y calificaciones. Normalizador de imágenes `apiFormatImageUrl`. |
| `src/app.js` | **MODIFICADO** | Sustitución completa de lógica mock. Se enlazó el login/registro reactivo a la API con soporte para correos oficiales y alias. Carga dinámica del catálogo con paginación ("Cargar más piezas..."), categorías dinámicas desde BD (17 categorías), sincronización del carrito en servidor, pasarela de pago, historial con cancelación atómica, gestión de pedidos, métricas de vendedor/admin, notificaciones en tiempo real, seguidores dinámicos, chat con auto-scroll y calificaciones post-compra. |
| `src/index.html` | **MODIFICADO** | Inclusión de `<script src="api.js"></script>` antes de `app.js`. Actualización de placeholders en el formulario de inicio de sesión para admitir tanto correos oficiales (`@commercity.com`) como alias de acceso rápido, e IDs interactivos para listas dinámicas de mensajes y seguidores. |
| `main.js` | **MODIFICADO** | Inclusión de `webSecurity: false` en las `webPreferences` del `BrowserWindow`. Esto permite que las peticiones `fetch()` originadas desde el protocolo `file://` en Electron alcancen sin restricciones de CORS el backend local en `http://localhost:3000`. |
| `test-e2e.js` | **NUEVO** | Suite de 22 pruebas de integración automatizadas de extremo a extremo contra la base de datos real `commercity_v2` cubriendo todo el ciclo: autenticación, perfil, catálogo, categorías, carrito, vendedor, historial, administración, recuperación de claves, perfil público, notificaciones, seguidores, chat y calificaciones. |
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
| **RF3** | Auth / Cuenta | Solicitar recuperación de contraseña enviando enlace seguro anti-enumeración. | Implementado con `POST /api/usuarios/recover`. El cliente valida tanto correos como alias y genera token con expiración atómica en MySQL. |
| **RF4** | Auth / Seguridad | Restablecimiento de contraseña con token criptográfico de un solo uso que expira en 5 minutos. | Implementado con `POST /api/usuarios/reset-password`. Enlaza validación Zod (mínimo 6 chars) y limpieza inmediata del token. |
| **RF16–18** | Usuarios / Perfil | Visualización del perfil público de otros usuarios y vendedores sin exponer datos sensibles. | Implementado con `GET /api/usuarios/perfil-publico/:id`. Al hacer clic en un vendedor desde el catálogo o ficha de producto, se despliega su nombre, biografía y avatar oficial. |
| **RF95–100** | Notificaciones | Campana de notificaciones con contador de no leídas, marcado como leídas y eliminación individual/masiva. | Implementado con `GET /api/notificaciones`, `GET /api/notificaciones/no-leidas`, `PATCH /api/notificaciones/leidas` y `DELETE /api/notificaciones`. La campana refleja el estado del usuario en tiempo real. |
| **RF101–103** | Usuarios / Social | Sistema bidireccional de Seguidores y Siguiendo con actualización reactiva de estadísticas y botón seguir/dejar de seguir. | Implementado con `GET /api/seguidores/seguidores`, `GET /api/seguidores/siguiendo`, `POST /api/seguidores` y `DELETE /api/seguidores/:id`. Persiste en la tabla relacional `seguidores` de MySQL. |
| **RF12–15, RF105** | Chat / Mensajes | Canal directo de comunicación comprador-vendedor, historial de conversaciones, lectura de mensajes y envío bidireccional. | Implementado con `GET /api/chat/conversaciones`, `GET /api/chat/mensajes/:id`, `PATCH /api/chat/mensajes/:id/leido` y `POST /api/chat`. Sanitización de datos anti-XSS y scroll automático. |
| **RF84–86, RF107** | Calificaciones / Reseñas | Sistema de reputación y valoración de vendedores y productos mediante puntuación de 1 a 5 estrellas. | Implementado con `POST /api/calificaciones/vendedor` y `POST /api/calificaciones/producto`. Conectado a la pasarela de pago post-compra con persistencia reactiva. |

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
├── test-e2e.js              # Suite de 22 pruebas E2E contra la API real en localhost:3000
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
2. Asegúrate de que el archivo `.env` contenga las variables de conexión correctas:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=<contraseña rotada — solicitar al líder técnico>
   DB_NAME=commercity_v2
   JWT_SECRET=<clave JWT — solicitar al líder técnico>
   ```
   > ⚠️ **Nunca comitees el archivo `.env` al repositorio.** Está incluido en `.gitignore`.
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
   ⏳ 14. Admin: Estadísticas globales /api/admin/stats... (Vendedores: 31, Compradores: 133, Productos: 312) ✅ OK
   ⏳ 15. Auth: Solicitar recuperación /api/usuarios/recover (RF3/RF4)... ✅ OK
   ⏳ 16. Usuarios: Obtener perfil público /api/usuarios/perfil-publico/2 (RF16-18)... ✅ OK
   ⏳ 17. Auth: Restablecer contraseña con token inválido/expirado rechaza (400 - RF4)... ✅ OK
   ⏳ 18. Reautenticar Vendedor (juan.giraldo@commercity.com)... ✅ OK
   ⏳ 19. Notificaciones: Listar y verificar no-leídas /api/notificaciones (RF95-100)... (Total: 1, No leídas: 0) ✅ OK
   ⏳ 20. Seguidores: Seguir usuario #482 y listar siguiendo /api/seguidores (RF101-103)... (Seguir y dejar de seguir OK) ✅ OK
   ⏳ 21. Chat: Listar conversaciones y enviar mensaje /api/chat (RF12-15)... ✅ OK
   ⏳ 22. Calificaciones: Calificar vendedor y producto /api/calificaciones (RF84-86)... ✅ OK
   ========================================================
   RESULTADO FINAL: 22 PASADAS, 0 FALLIDAS
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

## ⚠️ Seguridad de Electron: `webSecurity: false`

En el archivo `main.js`, la propiedad `webSecurity: false` está habilitada **exclusivamente para desarrollo local**, permitiendo que las peticiones `fetch()` originadas desde `file://` alcancen `http://localhost:3000` sin restricciones de CORS.

**Antes de empaquetar el `.exe` para distribución, es obligatorio:**

1. **Eliminar la línea `webSecurity: false`** del `BrowserWindow` en `main.js`.
2. **Habilitar CORS** en el backend Express con la cabecera `Access-Control-Allow-Origin` apuntando al origen correcto, **o bien**
3. **Registrar un protocolo custom** de Electron (`protocol.handle` / `protocol.registerHttpProtocol`) para servir los archivos del frontend desde un esquema tipo `app://`, evitando así el uso de `file://`.

> [!CAUTION]
> Con `webSecurity: false` activo en producción, la aplicación queda expuesta a ataques XSS y a que cualquier origen externo inyecte requests arbitrarios al backend.

---

## 🟢 Módulos Sociales y Transaccionales Integrados (Sprint 3)

Los siguientes módulos están 100% conectados a los endpoints de la API v2 y probados contra MySQL:

| Módulo | RF del SRS | Endpoints Conectados | Estado |
|--------|------------|----------------------|--------|
| **Chat Comprador-Vendedor** | RF12, RF13, RF14, RF15, RF105 | `GET /api/chat/conversaciones`, `GET /api/chat/mensajes/:id`, `POST /api/chat` (multipart y texto) y `PATCH /api/chat/mensajes/:id/leido`. | ✅ Funcional y verificado en E2E. |
| **Calificaciones / Reseñas** | RF84, RF85, RF86, RF107 | `POST /api/calificaciones/vendedor` y `POST /api/calificaciones/producto`. | ✅ Conectado a pasarela y BD. |
| **Notificaciones Dinámicas** | RF95–100 | `GET /api/notificaciones`, `GET /api/notificaciones/no-leidas`, `PATCH /api/notificaciones/leidas`. | ✅ Badge y contador en tiempo real. |
| **Seguidores y Siguiendo** | RF101–103 | `GET /api/seguidores`, `GET /api/seguidores/siguiendo`, `POST /api/seguidores`, `DELETE /api/seguidores/:id`. | ✅ Modal y persistencia reactiva. |

---

## ⚡ Solución de Problemas Frecuentes (FAQ)

- **¿Qué hacer si aparece "Error de conexión con el servidor"?**  
  Asegúrate de que el backend esté corriendo en una terminal en `http://localhost:3000` (`node src/server/server.js`) y que MySQL tenga el servicio activo.
- **¿Por qué Electron permite peticiones locales sin error de CORS?**  
  Porque en `main.js` se definió explícitamente `webSecurity: false` dentro de `webPreferences` para el entorno de desarrollo.
- **¿Qué formato de tarjeta exige la pasarela de pago (M-28)?**  
  En cumplimiento de **M-28 / PCI-DSS**, la aplicación de escritorio **nunca transmite el PAN (`numero_tarjeta`)**; envía únicamente `ultimos4_tarjeta` y `marca_tarjeta` (Visa, Mastercard, Amex, Otra) validadas localmente.
- **¿Dónde se guarda el token JWT?**  
  En `api.js` se gestiona con persistencia dual en memoria (`memoryToken`) y en `sessionStorage`/`localStorage` de Electron para mantener la sesión activa entre recargas.

---

## 📦 Comandos de Referencia

| Comando | Función |
|---------|---------|
| `npm start` | Inicia la aplicación Electron (v44.7.0) en modo desarrollo |
| `npm run test:e2e` | Ejecuta la suite de 22 pruebas E2E de punta a punta contra la BD real MySQL |
| `npm run test:contrato` | Valida estáticamente el contrato OpenAPI (41 rutas cliente vs 63 rutas del backend) |
| `npm ci` | Reinstala limpiamente las dependencias fijadas (`electron@44.7.0`) |
| `npm run build` | Genera el instalador ejecutable (`.exe`) para Windows mediante `electron-builder` |

---
*Documento de Handoff Técnico — Proyecto CommerCity 2.0 SENA ADSO — Actualizado con Evidencias E2E y Contrato Octubre 2026*
