# 🛒 CommerCity 2.0 — Aplicación de Escritorio (Desktop App)

[![Electron](https://img.shields.io/badge/Electron-33.2.1-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![API Backend](https://img.shields.io/badge/API-Express%20v2-black?logo=express)](http://localhost:3000)
[![Database](https://img.shields.io/badge/MySQL-commercity__v2-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-22%2F22%20Passing-brightgreen)](test-e2e.js)
[![Sprint](https://img.shields.io/badge/Sprint-3%20(Integraci%C3%B3n%20Total)-orange)](#-resumen-de-integraci%C3%B3n)

Aplicación de escritorio nativa para el marketplace **CommerCity 2.0**, desarrollada con **Electron.js** y conectada a la API REST oficial en Node.js/Express con base de datos MySQL `commercity_v2`. 

Desarrollada para el programa **ADSO 35** del **SENA — Centro de Diseño Tecnológico Industrial** (Cali, Colombia).

---

## 🧭 ¿Qué es esta versión?

Esta versión evoluciona el prototipo inicial hacia una **aplicación de escritorio comercial de alta fidelidad**, con:

- **Conexión real con el backend**: Eliminación de datos mock en memoria; consumo reactivo de la API REST mediante `src/api.js`.
- **Diseño Figma Dark Mode**: Paleta en grises oscuros profundos, acentos naranja institucional (`#ea580c`), badges contextuales y tipografías *Plus Jakarta Sans* e *Inter*.
- **Transacciones ACID seguras**: Checkout con algoritmo de Luhn, cálculo de comisiones 90/10 e IVA, y cancelación de pedidos con restitución automática de stock.
- **Módulos sociales y de comunicación completos**: Notificaciones dinámicas, seguidores/siguiendo, perfil público, chat comprador-vendedor en tiempo real, calificaciones por estrellas y recuperación segura de contraseñas.
- **Empaquetado profesional**: Configurada con Electron Builder para generar instalador autónomo para Windows (`.exe` con NSIS).

---

## 🚀 Resumen de Integración (100% Requerimientos del SRS)

En esta fase se completó la integración total de todos los requerimientos funcionales a la base de datos real:

1. **Cliente API Centralizado (`src/api.js`)**:
   - Autenticación JWT con persistencia de sesión dual (memoria y `sessionStorage`).
   - Carrito de compras sin JWT por `comprador_id` (cumpliendo el contrato estricto del backend).
   - Catálogo con paginación real, filtros por categoría y búsqueda en servidor.
   - Checkout con validación Luhn y desglose de impuestos y comisiones (RF47, RF131).
   - Cancelación de pedidos pendientes con restitución atómica de stock (RF35, RF36, RF89).
   - Recuperación de contraseña (`/api/usuarios/recover`) con token de 5 min (RF3, RF4).
   - Perfil público con métricas y biografía (`/api/usuarios/perfil-publico/:id`, RF16–18).
   - Notificaciones dinámicas con badges no-leídos (`/api/notificaciones`, RF95–100).
   - Sistema social de seguidores/siguiendo (`/api/seguidores`, RF101–103).
   - Chat interno con mensajes y lectura (`/api/chat`, RF12–15, RF105).
   - Calificaciones por estrellas de vendedores y productos (`/api/calificaciones`, RF84–86, RF107).
2. **Interfaz Reactiva (`src/app.js`)**:
   - Carga dinámica del catálogo con paginación y 17 categorías activas de la BD.
   - Sincronización inmediata de carrito, historial, ventas y panel de administrador.
   - Modales interactivos para seguidores, perfil público, chat en vivo y pasarela de pago con calificación.
3. **Suite E2E Automatizada (`test-e2e.js`)**:
   - **22 pruebas de integración automatizadas** continuas que validan todo el contrato de la API contra MySQL.

---

## 🔑 Credenciales de Prueba

Las credenciales de acceso para las cuentas de prueba del entorno de desarrollo se encuentran documentadas internamente en el archivo [HANDOFF.md](HANDOFF.md). **No se publican en este README por seguridad.**

> Solicita las credenciales al equipo o consulta el HANDOFF si eres evaluador del proyecto.

---

## ⚙️ Requisitos Previos

1. **Node.js**: Versión 18.x o superior instalada.
2. **Servidor Backend CommerCity**:
   - Ubicado en su respectivo repositorio/directorio.
   - Base de datos MySQL `commercity_v2` importada y activa.
   - Archivo `.env` configurado con las variables de entorno necesarias (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`). Consulta el HANDOFF para los valores.
   - Ejecutándose en segundo plano (`npm start`).

---

## ⚠️ Nota de Seguridad: `webSecurity` en Electron

En modo desarrollo, `main.js` tiene `webSecurity: false` para permitir peticiones `fetch()` desde `file://` hacia `http://localhost:3000`. **Esto es solo para desarrollo local.**

Antes de empaquetar el `.exe` de distribución, se debe:
1. **Eliminar `webSecurity: false`** de `main.js`.
2. **Habilitar CORS** correctamente en el backend Express (cabeceras `Access-Control-Allow-Origin`), o
3. **Usar un protocolo custom** de Electron (`protocol.registerHttpProtocol` / `protocol.handle`) para cargar los archivos del frontend, evitando `file://` y sus restricciones.

Sin este paso, la aplicación queda expuesta a XSS y requests arbitrarios desde cualquier origen.

---

## 💻 Instalación y Uso

### 1. Clonar o abrir el proyecto
```powershell
cd VOCETO-2.0-COMMERCITY-SENA-ADSO-35
```

### 2. Instalar dependencias
```powershell
npm install
```

### 3. Ejecutar pruebas de integración E2E
Verifica que la conexión con el backend y la base de datos esté al 100%:
```powershell
node test-e2e.js
```
*Salida esperada: `RESULTADO FINAL: 22 PASADAS, 0 FALLIDAS`*.

### 4. Iniciar la aplicación en modo desarrollo
```powershell
npm start
```
Se abrirá la ventana de escritorio de CommerCity 2.0 lista para interactuar.

### 5. Empaquetar para distribución (.exe)
```powershell
npm run build
```
Generará el instalador portable y el instalador NSIS en la carpeta `dist/`.

---

## 📁 Estructura del Código

```
VOCETO-2.0-COMMERCITY-SENA-ADSO-35/
├── main.js                  # Proceso principal de Electron (BrowserWindow, IPC, seguridad)
├── package.json             # Dependencias, scripts y configuración de Electron Builder
├── test-e2e.js              # Suite de 22 pruebas de integración con la API real
├── README.md                # Este documento de presentación y arranque
├── HANDOFF.md               # Documentación técnica completa y guía paso a paso de evaluación
└── src/
    ├── api.js               # Cliente oficial de la API REST (fetch, JWT, contratos)
    ├── app.js               # Lógica de presentación, enrutamiento interno y reactividad
    ├── index.html           # Plantilla HTML con vistas, sidebars y modales
    └── styles.css           # Sistema de diseño, layout responsive y tema visual
```

---

## ✅ Módulos Conectados a la API (100% Requerimientos del SRS)

Todos los módulos del SRS están conectados a la API REST del backend con manejo de errores y respaldo visual:

| Módulo | RF Asociados | Estado de Integración | Descripción |
|--------|--------------|-----------------------|-------------|
| **Catálogo & Categorías** | RF5–8 | Conectado | Paginación dinámica en `/api/productos` y 17 categorías activas. |
| **Carrito de Compras** | RF9–11 | Conectado | Sincronizado por `comprador_id` en `/api/carrito`. |
| **Pasarela & Comisiones** | RF47, RF131 | Conectado | Validación Luhn, división 90/10 en `/api/pedidos/confirmar-pago`. |
| **Cancelación & Stock** | RF35, RF36, RF89 | Conectado | Reembolso y restitución de stock en `/api/historial/compras/:id/cancelar`. |
| **Chat Comprador-Vendedor** | RF12–15, RF105 | Conectado | Historial, lectura y envío en `/api/chat` con sanitización XSS. |
| **Notificaciones** | RF95–100 | Conectado | Campana con conteo de no leídas, eliminar y redirección contextual. |
| **Seguidores / Siguiendo** | RF101–103 | Conectado | Listas dinámicas y toggle seguir/dejar de seguir en `/api/seguidores`. |
| **Calificaciones / Reseñas** | RF84–86, RF107 | Conectado | Puntuación por estrellas post-compra en `/api/calificaciones/vendedor`. |
| **Perfil Público** | RF16–18 | Conectado | Ficha de usuario y vendedor en `/api/usuarios/perfil-publico/:id`. |
| **Recuperar Contraseña** | RF3, RF4 | Conectado | Token de 5 min y cambio en `/api/usuarios/recover` y `reset-password`. |

---

## 📖 Documentación Extendida

Para la documentación técnica completa, la matriz de requerimientos funcionales implementados (RF35, RF36, RF59, RF89, RF129, RF137, RF141), credenciales de prueba y la guía paso a paso para evaluadores, consulta:

👉 **[HANDOFF.md](HANDOFF.md)**

---

*CommerCity 2.0 — Proyecto Formativo SENA ADSO 35 | Octubre 2026*
