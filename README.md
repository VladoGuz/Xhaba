# Xhaba 🌺
> **Plataforma E-commerce de Textiles y Ropa Típica de Oaxaca**
>
> Xhaba es una aplicación web premium que fusiona la calidez artesanal oaxaqueña con la robustez digital moderna. Permite la venta directa de prendas tejidas a mano por artesanos locales, garantizando la seguridad en las compras, la persistencia en tiempo real y el control de inventarios transaccional.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Google Fonts (Playfair Display & Outfit).
- **Backend**: Node.js, Express, PostgreSQL, Cookies HttpOnly & JSON Web Tokens (JWT) para sesiones.
- **Estilos**: Paleta Rústica y Artesanal integrada por tokens:
  - **Base**: Manta/Hueso (`#F5F2EB`)
  - **Acentos tradicionales**: Terracota (`#C66B41`), Ocre Cempasúchil (`#DCA134`), Rojo Cochinilla (`#9B1C31`), Azul Añil (`#2B4C7E`), Verde Maguey (`#3F5E4D`).

---

## 🔑 Cuentas de Demostración (Sembradas en Base de Datos)

Para explorar los paneles y flujos de la aplicación, utiliza las siguientes credenciales de prueba preconfiguradas:

| Rol de Cuenta | Correo Electrónico | Contraseña | Funcionalidad Clave |
| :--- | :--- | :--- | :--- |
| **Cliente / Comprador** | `client@xhaba.com` | `client123` | Añadir al carrito, persistencia y pasarela de pago. |
| **Artesano / Vendedor** | `artisan@xhaba.com` | `artisan123` | Registrar nuevas prendas con imágenes y gestionar inventarios. |
| **Administrador / Moderador** | `admin@xhaba.com` | `admin123` | Banear cuentas, ocultar prendas y monitorear carritos abandonados. |

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para configurar y arrancar la aplicación de manera local:

### 1. Requisitos Previos
- **Node.js** (versión 16 o superior) instalado.
- **PostgreSQL** (versión 12 o superior) instalado y corriendo en tu máquina.

### 2. Configurar la Base de Datos
1. Inicia sesión en PostgreSQL y crea una base de datos vacía llamada `artesanias_db`:
   ```sql
   CREATE DATABASE artesanias_db;
   ```
2. El backend está configurado para crear automáticamente las tablas e insertar todas las semillas de datos necesarias en su primer arranque. No requieres importar SQL manual.

### 3. Configuración del Servidor (Backend)
1. Dirígete a la carpeta del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias del backend:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de la carpeta `server` con la siguiente estructura de variables (reemplaza con tu contraseña de Postgres si es diferente):
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD="TU_CONTRASEÑA_DE_POSTGRES"
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=artesanias_db
   JWT_SECRET=super_secret_jwt_key_xhaba_2026_dev
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *Al iniciar, deberías ver en consola los mensajes de conexión exitosa a PostgreSQL y la creación de tablas y sembrado de datos.*

### 4. Configuración del Cliente (Frontend)
1. Abre una nueva terminal y navega al directorio del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias del frontend:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la dirección mostrada por Vite (usualmente `http://localhost:5173` o `http://localhost:5174`).

---

## ✨ Características Principales Implementadas

### 📁 1. Catálogo Dinámico de Fotos de la Prenda
- Los productos muestran imágenes reales asociadas en la base de datos (tabla `product_images`).
- Utiliza los activos tradicionales cargados en `client/src/assets/ropa_tipica/` cargados en tiempo de ejecución de manera dinámica por el helper del compilador de Vite.
- En el panel del artesano (Subir Prenda), se incluye un **Selector Visual** interactivo con vista previa en tiempo real para asignar la foto correcta a su obra textil.

### 🛡️ 2. Control de Concurrencia Real de Inventarios (HU-02)
- El proceso de checkout realiza una transacción SQL en el servidor bloqueando los registros seleccionados (`FOR UPDATE`).
- Si dos usuarios intentan adquirir la misma pieza única al mismo tiempo, el primer checkout reducirá el stock a `0`, y la transacción del segundo ejecutará un `ROLLBACK` seguro, notificando al usuario de forma semántica en la pasarela.

### 🛒 3. Sincronización del Carrito en Tiempo Real (HU-03)
- Persistencia automática de los artículos de la bolsa de compras en la tabla de la base de datos `cart_items` al iniciar sesión. El estado local y del servidor se sincronizan transparentemente en cada cambio.

### 📊 4. Monitoreo de Carritos Abandonados (HU-10)
- Mide estadísticas de usuarios únicos con carritos activos en las últimas 24h, valor total acumulado y tasa de conversión sobre las órdenes finalizadas. El administrador visualiza estos gráficos dinámicamente mediante el consumo de consultas SQL reales.
