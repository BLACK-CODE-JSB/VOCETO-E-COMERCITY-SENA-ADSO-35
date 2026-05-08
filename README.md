# CommerCity — Aplicación de Escritorio

Marketplace local construido con Electron.

## Cómo ejecutar

### Requisitos
- Node.js 18+ instalado → https://nodejs.org
- npm (incluido con Node.js)

### Instalación y ejecución

```bash
# 1. Descomprime el proyecto y entra a la carpeta
cd commercity

# 2. Instala las dependencias
npm install

# 3. Ejecuta la app
npm start
```

##  Pantallas incluidas en este voceto:

| Pantalla | Descripción |
|---|---|
| Iniciar sesión | Login con email y contraseña |
| Registro | Creación de cuenta comprador/vendedor |
| Recuperar contraseña | Envío de enlace por correo |
| Restablecer contraseña | Nueva contraseña con validación |
| Ventana Principal | Home con hero, categorías y catálogo |
| Perfil Comprador | Datos personales, pedidos y saldo |
| Perfil Vendedor | Dashboard, stats y catálogo de productos |

##  Tecnologías

- **Electron** — framework para apps de escritorio
- **HTML/CSS/JS puro** — sin frameworks adicionales
- **Google Fonts** — tipografías Sora + DM Sans
- Ventana sin bordes con titlebar personalizada (estilo macOS)
⚙️ Proceso de desarrollo

Durante el desarrollo se realizaron las siguientes etapas:

1. Configuración del entorno
Se inicializó el proyecto con Node.js.
Se instalaron las dependencias principales:
Electron
Electron Builder
2. Estructura del proyecto

Se organizó el proyecto en carpetas principales:

main.js: lógica principal de la aplicación.
src/: interfaz de usuario (HTML, CSS, JS).
assets/: recursos como el logo e imágenes.
package.json: configuración general del proyecto.
3. Creación de la ventana principal
Se configuró una ventana personalizada sin barra de Windows.
Se establecieron dimensiones fijas y límites de tamaño.
Se añadió un ícono personalizado de la aplicación.
Se implementaron controles de ventana (minimizar, maximizar y cerrar) mediante IPC.
4. Diseño del instalador (Setup.exe)
Se utilizó electron-builder con el formato NSIS.
Se personalizó el instalador con:
Icono de la aplicación.
Banner de instalación.
Accesos directos en escritorio y menú inicio.
Se configuró la generación de un instalador ejecutable para Windows.
5. Generación del instalador
Se ejecutó el comando de compilación:
npm run build
Esto generó la carpeta dist/, donde se obtiene el instalador final.
📦 Resultado final

El proyecto genera un archivo instalador:

CommerCity Setup.exe

Este archivo permite instalar la aplicación en cualquier computadora Windows sin necesidad de herramientas adicionales.

🚀 Uso final

El usuario solo debe:

Ejecutar el instalador .exe
Seguir los pasos de instalación
Abrir la aplicación desde el acceso directo creado
