# 🛒 CommerCity 2.0 — Aplicación de Escritorio (Desktop App)

[![Electron](https://img.shields.io/badge/Electron-33.2.1-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![API Backend](https://img.shields.io/badge/API-Express%20v2-black?logo=express)](http://localhost:3000)
[![Database](https://img.shields.io/badge/MySQL-commercity__v2-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-14%2F14%20Passing-brightgreen)](test-e2e.js)
[![Sprint](https://img.shields.io/badge/Sprint-2%20(Fase%202)-orange)](#-resumen-del-sprint-2)

Aplicación de escritorio nativa para el marketplace **CommerCity 2.0**, desarrollada con **Electron.js** y conectada a la API REST oficial en Node.js/Express con base de datos MySQL `commercity_v2`. 

Desarrollada para el programa **ADSO 35** del **SENA — Centro de Diseño Tecnológico Industrial** (Cali, Colombia).

---

## 🧭 ¿Qué es esta versión?

Esta versión evoluciona el prototipo inicial hacia una **aplicación de escritorio comercial de alta fidelidad**, con:

- **Conexión real con el backend**: Eliminación de datos mock en memoria; consumo reactivo de la API REST mediante `src/api.js`.
- **Diseño Figma Dark Mode**: Paleta en grises oscuros profundos, acentos naranja institucional (`#ea580c`), badges contextuales y tipografías *Plus Jakarta Sans* e *Inter*.
- **Transacciones ACID seguras**: Checkout con algoritmo de Luhn, cálculo de comisiones 90/10 e IVA, y cancelación de pedidos con restitución automática de stock.
- **Empaquetado profesional**: Configurada con Electron Builder para generar instalador autónomo para Windows (`.exe` con NSIS).

---

## 🚀 Resumen del Sprint 2 (Fase 2: Conexión con API Real)

En este sprint se completó la integración total de los clientes a la base de datos real:

1. **Cliente API Centralizado (`src/api.js`)**:
   - Autenticación JWT con persistencia de sesión dual (memoria y `sessionStorage`).
   - Gestión de carrito sin JWT por `comprador_id` (cumpliendo el contrato estricto del backend).
   - Catálogo con paginación real, filtros por categoría y búsqueda en servidor.
   - Checkout con validación Luhn y desglose de impuestos y comisiones.
   - Cancelación de pedidos pendientes con restitución atómica de stock (RF35, RF36, RF89).
2. **Interfaz Reactiva (`src/app.js`)**:
   - Carga dinámica del catálogo con botón *"Cargar más piezas..."*.
   - Selector de categorías poblado en vivo con las 17 categorías de la BD.
   - Sincronización inmediata del carrito por comprador.
   - Paneles específicos según rol: Comprador, Vendedor (Mi Tienda 90/10) y Administrador.
3. **Configuración Electron (`main.js`)**:
   - Habilitado `webSecurity: false` para permitir peticiones locales fluidas sin bloqueos de CORS entre el protocolo `file://` y `http://localhost:3000`.
4. **Suite E2E Automatizada (`test-e2e.js`)**:
   - 14 pruebas de integración continuas que validan todo el contrato de la API contra MySQL.

---

## 🔑 Credenciales de Acceso Rápido para Pruebas

La base de datos `commercity_v2` contiene las siguientes cuentas de prueba:

| Rol | Alias Rápido | Correo Oficial | Contraseña | Vistas y Capacidades |
|-----|--------------|----------------|------------|----------------------|
| **Vendedor** | `juan_giraldo` | `juan.giraldo@commercity.com` | `123456` | Catálogo, Carrito, Perfil, Mi Tienda (métricas 90/10), Gestión de Envíos, Historial. |
| **Administrador** | `admin` | `admin01@commercity.com` | `123456` | Panel de Control Exclusivo de Admin, Estadísticas Globales del Marketplace. |
| **Comprador** | *Cualquiera* | *Registro en app* | *A elección* | Registro dinámico en MySQL, compras y cancelación de pedidos. |

> **Nota:** Puedes iniciar sesión ingresando el **correo electrónico oficial** o simplemente el **alias rápido**.

---

## ⚙️ Requisitos Previos

1. **Node.js**: Versión 18.x o superior instalada.
2. **Servidor Backend CommerCity**:
   - Ubicado en su respectivo repositorio/directorio.
   - Base de datos MySQL `commercity_v2` importada y activa.
   - Archivo `.env` configurado con `PORT=3000` y `DB_PASSWORD=Mydbcommercity2026`.
   - Ejecutándose en segundo plano (`npm start`).

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
*Salida esperada: `RESULTADO FINAL: 14 PASADAS, 0 FALLIDAS`*.

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
├── test-e2e.js              # Suite de 14 pruebas de integración con la API real
├── README.md                # Este documento de presentación y arranque
├── HANDOFF.md               # Documentación técnica completa y guía paso a paso de evaluación
└── src/
    ├── api.js               # Cliente oficial de la API REST (fetch, JWT, contratos)
    ├── app.js               # Lógica de presentación, enrutamiento interno y reactividad
    ├── index.html           # Plantilla HTML con vistas, sidebars y modales
    └── styles.css           # Sistema de diseño, layout responsive y tema visual
```

---

## 📖 Documentación Extendida

Para una explicación exhaustiva de la arquitectura, la matriz completa de requerimientos funcionales (RF35, RF36, RF59, RF89, RF129, RF137, RF141), el flujo detallado de cancelación de pedidos y la guía paso a paso para evaluadores, consulta el archivo:

👉 **[HANDOFF.md](HANDOFF.md)**

---

*CommerCity 2.0 — Proyecto Formativo SENA ADSO 35 | Septiembre 2026*
