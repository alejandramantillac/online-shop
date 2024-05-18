# Tienda en Línea - Proyecto Final

## Integrantes
* Maria Alejandra Mantilla Coral
* Andrés David Parra García
* Silem Nabib Villa Contreras

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una tienda en línea para una empresa local. La aplicación permite a los administradores agregar productos al inventario y a los clientes comprarlos. Además, se genera una factura para cada compra realizada por un cliente. La gestión de datos se realiza de forma volátil, es decir, los datos permanecen mientras el programa principal esté en ejecución y no se garantiza persistencia de datos.

## Funcionalidades

### Roles de Usuario

- **Administrador:**
  - Iniciar sesión.
  - Agregar nuevos productos al inventario.

- **Cliente:**
  - Registrarse o iniciar sesión.
  - Ver la lista de productos disponibles.
  - Agregar productos al carrito.
  - Realizar compras.
  - Ver historial de compras.

## Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución para JavaScript.
- **Express:** Framework para aplicaciones web en Node.js.
- **Handlebars:** Motor de plantillas para generar HTML.
- **Multer:** Middleware para gestionar archivos multipart/form-data.
- **HTML, CSS y JavaScript:** Para desarrollar la interfaz de usuario.
- **Fetch API:** Para consumir los servicios REST desde el cliente.

## Configuración y Ejecución de la Aplicación

### Prerrequisitos

- Tener **Node.js** y **npm** instalados en el sistema.

### Instalación

1. Clona el repositorio a tu máquina local:

    ```bash
    git clone https://github.com/alejandramantillac/online-shop.git
    cd online-shop
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

### Ejecución

1. Inicia el servidor:

    ```bash
    npm start
    ```

2. Abre tu navegador web y navega a `http://localhost/users/login`.

### Estructura del Proyecto

- **middleware/:** Contiene middlewares para manejo de errores y autenticación.
- **model/:** Contiene los modelos de datos para usuarios, productos y compras.
- **public/:** Contiene archivos estáticos como JavaScript del lado del cliente y CSS.
- **routes/:** Contiene las definiciones de rutas para productos y usuarios.
- **views/:** Contiene las vistas generadas con Handlebars.

### Funcionalidades del Cliente

- **Navegar Productos:** Los clientes pueden ver todos los productos disponibles en la tienda.
- **Carrito de Compras:** Los clientes pueden agregar productos al carrito, ver los productos en el carrito y realizar la compra.
- **Historial de Compras:** Los clientes pueden ver el historial de sus compras anteriores.

### Funcionalidades del Administrador

- **Agregar Productos:** Los administradores pueden agregar nuevos productos al inventario de la tienda.
- **Gestión de Productos:** Los administradores pueden ver todos los productos y agregar más stock.

