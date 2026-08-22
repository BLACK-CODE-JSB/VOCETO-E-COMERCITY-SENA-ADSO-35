# CommerCity 2.0 — Handoff

## Descripción del proyecto
Marketplace desktop app construida con **Electron.js**. Inspirada en un diseño Figma con tema oscuro y acentos naranjas. Desarrollada por Sebastian (SENA ADSO, Cali Colombia). Versión actual: **2.0.0**.

---

## Estructura de archivos
```
commercity-updated/
├── main.js                  # Proceso principal Electron (ventana, IPC, banner ASCII)
├── package.json             # versión 2.0.0, scripts: start / build
├── package-lock.json
├── README.md
└── src/
    ├── index.html           # Todo el HTML (páginas, sidebar, modales)
    ├── styles.css           # Todo el CSS (variables, layout, componentes)
    └── app.js               # Todo el JS (login, navegación, UI logic)
```

---

## Sistema de usuarios / roles

| Usuario        | Contraseña | Rol        | Acceso                                                    |
|----------------|------------|------------|-----------------------------------------------------------|
| `juan_giraldo` | `1234`     | comprador  | Home, Carrito, Perfil, Historial, Ajustes, Mensajes/Chat |
| `admin`        | `admin123` | admin      | Solo Panel de Control (sin sidebar)                       |

### Lógica de roles en `app.js`
- `USERS` — objeto con credenciales y rol de cada usuario.
- `currentUser` — usuario logueado en memoria.
- `applyRoleSidebar(role)` — muestra/oculta items del sidebar según rol.
- `convertirAVendedor()` — convierte comprador en vendedor, desbloquea Tienda y Pedidos, redirige a `perfil-vendedor`.
- Cuando un vendedor navega a `'perfil'`, `navigate()` lo redirige automáticamente a `'perfil-vendedor'`.

---

## Páginas implementadas (page-IDs en index.html)

### Auth (sin sidebar)
| ID | Descripción |
|----|-------------|
| `page-login` | Login split-panel (izquierda: branding, derecha: form) |
| `page-registro` | Card centrada con checkbox "Quiero vender" |
| `page-terminos` | Términos y condiciones con botón Volver |
| `page-recuperar` | Recuperar contraseña |
| `page-restablecer` | Restablecer contraseña |

### App — Comprador (con sidebar)
| ID | Descripción |
|----|-------------|
| `page-home` | Hero + grid 3 cols de productos con ficha overlay |
| `page-perfil` | Perfil comprador: avatar, seguidores/seguidos, MiFeed |
| `page-carrito` | Carrito con pasarela de pago overlay |
| `page-historial` | Historial de compras con filtros Todo/Pendiente/En camino/Entregado |
| `page-ajustes` | Info personal, dirección, convertir a vendedor, eliminar cuenta |
| `page-mensajes` | Lista de conversaciones |
| `page-chat` | Chat con producto compartido y footer de escritura |

### App — Vendedor (comprador convertido, sidebar ampliado)
| ID | Descripción |
|----|-------------|
| `page-perfil-vendedor` | Perfil vendedor: estrellas, tabs MiFeed/MisProductos, botón Agregar Producto |
| `page-tienda` | Estadísticas de tienda + registro cuenta bancaria |
| `page-pedidos` | Tabla de pedidos con detalle overlay |

### Admin (sin sidebar, layout propio)
| ID | Descripción |
|----|-------------|
| `page-admin` | Panel de control: stats, gestión usuarios/productos/reportes |
| `page-admin-ajustes` | Cuenta bancaria CommerCity + botón Salir (cierra sesión) |

---

## Sidebar
- **Comprador**: Principal (Inicio, Carrito) + Cuenta (Perfil, Historial, Ajustes)
- **Vendedor**: igual + Tienda y Pedidos desbloqueados
- **Admin**: sin sidebar — tiene topbar propio con ⚙ a la derecha
- IDs de secciones: `sb-sec-principal`, `sb-sec-cuenta`, `sb-sec-admin`
- Items: `nav-home`, `nav-carrito`, `nav-perfil`, `nav-tienda`, `nav-pedidos`, `nav-historial`, `nav-ajustes`, `nav-admin`
- Bottom: `sb-user-initial`, `sb-user-name`, `sb-user-role`

---

## Overlays y modales
| ID | Disparador |
|----|-----------|
| `prod-overlay` | Click en card de producto en Home |
| `modal-producto` | Botón "+ Agregar Producto" en perfil vendedor |
| `pago-overlay` | Botón "Comprar" en carrito |
| `detalle-overlay` | Botón "Ver detalle" en tabla de Pedidos |
| `reporte-overlay` | Botón "Responder/Ver" en tabla de Reportes del Admin |
| `seguidores-modal` | Click en número de seguidores/siguiendo en Perfil |

---

## CSS — variables principales
```css
--orange: #F5A623      /* Acento principal */
--bg:     #0e0e12      /* Fondo app */
--bg2:    #161619      /* Cards, sidebar */
--bg3:    #1e1e24      /* Inputs, chips */
--font:   'Sora'       /* Títulos, logo */
--ui:     'Inter'      /* Texto general */
```

---

## Problemas conocidos / pendientes
- Las imágenes de productos vienen de Unsplash (URLs externas) — en producción deberían ser assets locales.
- El sistema de usuarios es hardcodeado en `USERS` (sin backend/DB).
- El carrito no persiste entre sesiones.
- Las acciones de admin (Banear, Eliminar) son solo UI sin lógica real.

---

## Comandos
```bash
npm install     # primera vez
npm start       # desarrollo
npm run build   # empaquetar (electron-builder)
```

---

*Última actualización: Junio 2026 — Sebastian ADSO SENA*

---

## Historial de fixes (última sesión)

### Fix — Reportes admin dinámicos
- `openReporte(key)` recibe `'mario-alberto'` o `'nike-fi'`
- El overlay del reporte se llena dinámicamente con datos de `REPORTES[key]`
- IDs en HTML: `rp-tipo`, `rp-reportado`, `rp-rep-por`, `rp-motivo`, `rp-estado`, `rp-fecha`, `rp-evidencias`, `rp-respuesta-box`, `rp-respuesta-enviada`, `rp-respuesta-txt`, `rp-acciones-usuario`, `rp-acciones-producto`

### Fix — Chat re-entrada
- `openChat()` hace `chatPage.classList.remove('active')` antes de llamar `navigate('chat')` para forzar el switch aunque ya estuviera en esa página

### Fix — Ajustes convertir a vendedor
- El botón "Cambiar a vendedor" llama `convertirAVendedor()` correctamente
- `convertirAVendedor()` actualiza `currentUser`, `USERS[username]`, el sidebar, y navega a `perfil-vendedor`

### Fix — navigate() vendedor
- Si `page === 'perfil'` y `role === 'vendedor'`, redirige a `'perfil-vendedor'`

### Fix — Seguidores modal
- `openSeguidores(tab)` verifica `if (!modal || !list) return` antes de ejecutar

### Fix — Admin sin sidebar
- `navigate()` excluye `['admin','admin-ajustes']` del show/hide del sidebar
- `admin-topbar` tiene `z-index:10` para no quedar debajo de otros elementos

---

## Fix Figma MCP — Última sesión

### Tokens de diseño aplicados desde Figma (file: WeJbbg2MZuwRddWf2TCkOa)
- Fuentes: `Plus Jakarta Sans` (headings/sidebar/logo), `Hanken Grotesk` (auth), `Inter` (body)
- Colores exactos: bg `#0a0a0f`, card/sidebar `#12121a`, input `#1a1a26`, orange `#ef9918`, text `#e4e1e9`, text2 `#797998`, border `#35343a`, badge-blue `#0077ff`
- Cards de producto: `border-radius: 24px`, sin borde por defecto, `box-shadow` sutil
- Badges de descuento: píldora azul (`#0077ff`) en lugar de naranja
- Precio tachado: azul con 60% opacidad
- Hero: imagen real, overlay gradiente de izquierda, tipografía 56px extrabold
- Grid home: 4 columnas con `gap: 20px`

### Fix chat re-entrada
- `openChat()` limpia todas las `.page.active` antes de llamar `navigate('chat')`
- Usa `setTimeout(10ms)` para forzar que el DOM procese el remove antes del add
- Esto permite entrar al chat, volver a mensajes, y volver a entrar sin límite

---

## Última actualización

### Productos del Figma agregados
- **Home**: 8 productos en grid 4 columnas con badges azules y precios tachados reales del Figma
- **Perfil comprador MiFeed**: Bolso Boutique (-10%, $125K), Cuadro Decorativo Minimalista ($29K), Cuadro Decorativo (-25%, $25K), Bascula de Oro (-20%, $40K) x2, Cuadro Decorativo (-25, $25K)

### Registro de usuario
- `doRegistro()` crea usuario dinámico en `USERS` con rol comprador o vendedor
- Si el usuario ya existe muestra error
- Login automático tras registro exitoso
- El nombre del nuevo usuario aparece en sidebar y perfiles

### Foto de perfil personalizada
- `cambiarFotoPerfil(event, tipo)` — lee el archivo con FileReader y aplica a ambos perfiles
- Botón 📷 en avatar del perfil comprador y vendedor
- La imagen persiste en la sesión actual (no en disco — Electron)
- Al cerrar sesión se resetea

---

## Actualización de Requerimientos Implementados (Agosto 2026 — Requerimientos RF80-RF130)

### 1. Control de Stock y Cantidades (RF80, RF85)
- **Ficha detallada**: El botón de agregar al carrito se bloquea y muestra "Sin stock disponible" si el stock en `STOCK_PRODUCTOS` es 0 (ej. Reloj).
- **Control dinámico**: Tanto en la ficha (`changeQty`) como en el carrito (`cartQty`), no se permite seleccionar cantidades mayores al stock real, mostrando advertencias mediante avisos Toast.
- **Deducción de Inventario**: Al realizar el pago, las cantidades adquiridas se restan dinámicamente de `STOCK_PRODUCTOS`.

### 2. Reporte de Productos Obligatorio (RF82, RF83)
- **Modal interactivo**: El botón de reportar en la ficha despliega `#reportar-overlay`.
- **Campos obligatorios**: Requiere ingresar el motivo (`#rep-motivo`) y adjuntar evidencia (`#rep-evidencia`), validado en `enviarReporte()`.
- **Carga con FileReader**: La imagen se convierte a Base64 en memoria y se añade a la colección `REPORTES` con estado `'Pendiente'`, actualizando instantáneamente la tabla de reportes en el Panel de Control de Administrador.

### 3. Calificación de Vendedores (RF84)
- **Estrellas Interactivas**: Se añadió un componente de 5 estrellas en la tarjeta de éxito del pago (`pago-ok-state`) donde el comprador puede calificar al vendedor llamando a `rateSeller()`.

### 4. Barra de Búsqueda y Navegación de Categorías (RF88, RF89)
- **Búsqueda global**: El input `#search-input` filtra en tiempo real por nombre de producto, categoría o vendedor (buscando en el campo `vendedor` añadido en `PRODUCTS`).
- **Filtro de categorías**: El selector `#cat-filter` superpuesto sobre `.cat-select` actualiza la vista de forma combinada con la barra de búsqueda mediante `filtrarProductos()`.

### 5. Notificaciones Interactivas (RF95, RF96, RF97, RF98, RF99, RF100)
- **Indicador**: Muestra un punto naranja reactivo en el ícono de la campana si hay notificaciones no leídas.
- **Navegación**: Clicar en una notificación en el dropdown llama a `clickNotif(id)` y redirige automáticamente al usuario a la sección correspondiente (Pedidos, Historial, Mensajes o Admin).
- **Limpieza**: Permite borrar notificaciones individuales o limpiar de forma masiva.

### 6. Sistema de Seguimiento (RF102)
- **Botón Seguir**: Añadido en la ficha de producto (`#pd-follow-btn`) al lado del vendedor, vinculándose dinámicamente con la lista `SEGUIDOS` en memoria.

### 7. Pedidos y Sección Tienda Vendedor (RF118, RF119, RF120, RF121, RF126, RF127, RF128, RF129, RF130)
- **Pedidos Completos**: La lista en `#page-pedidos` se carga dinámicamente con columnas para comprador, dirección de envío, fecha del pedido, productos, cantidad, estado, precio unitario y total.
- **Cambio de Estado**: El dropdown permite actualizar el estado del pedido, lo cual genera una notificación reactiva para el comprador.
- **Historial e Ingresos**: La página Tienda muestra estadísticas actualizadas en tiempo real y el historial completo de transacciones en la tabla `#tienda-ventas-tbody`, calculando automáticamente el 10% de comisión y el 90% neto.
- **Privacidad**: Se gestiona de manera local y aislada el guardado de la cuenta bancaria sin exponerla públicamente.

### 8. Cancelación de Pedidos, Devolución de Dinero y Auditoría Fiscal (RF35, RF36, RF59, RF89, RF129, RF137, RF141)
- **Cancelación desde Comprador (RF35, RF36)**: Los pedidos en estado "Pendiente" en el Historial de Compras cuentan con la opción de cancelación interactiva en la tabla y en el modal de detalle. Al cancelarse, el pedido desaparece inmediatamente del historial de compras y se emite la devolución del dinero con notificación reactiva y toast.
- **Restitución Automática de Stock (RF89)**: Al cancelarse un pedido pendiente, las cantidades adquiridas son reintegradas instantáneamente a `STOCK_PRODUCTOS` y se refresca el grid de catálogo de productos.
- **Remoción en Pedidos y Ajuste en Mi Tienda (RF129, RF137)**: El pedido cancelado desaparece de la sección de Pedidos del vendedor. En la sección *Mi Tienda*, se recalculan las estadísticas en tiempo real: se descuentan las unidades vendidas, se descuenta el 90% de ingresos netos y se actualiza la tabla de transacciones de ventas.
- **Deducción de Comisiones en Estadísticas de Administrador (RF59)**: El panel de control del administrador descuenta automáticamente el 10% de comisión en las estadísticas globales (`#admin-stat-comisiones`).
- **Deducción de IVA en Base de Datos de Ganancias (RF141)**: El impuesto IVA del 19% se descuenta de forma automatizada en la base de datos contable (`ADMIN_DB.ivaTotal`) y se registra la transacción con estado "Reembolsado" en la tabla de *Ganancias y Recaudación Fiscal* del Administrador.

