# Tienda en Línea - Proyecto Final

## Integrantes
* Maria Alejandra Mantilla Coral
* Andrés David Parra García
* Silem Nabib Villa Contreras
* Gerson De Jesús Hurtado Borja

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

### Usuarios Preexistentes en el Sistema

- **Administrador:** 
  - Usuario: `admin`
  - Contraseña: `admin`

- **Cliente:** 
  - Usuario: `user`
  - Contraseña: `user`

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

2. Abre tu navegador web y navega a `http://localhost/users/login`, podrás ingresar con las credenciales predefenidas (admin o user), o crear un nuevo usuario.

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

## Endpoints de la API

### Endpoints de Productos

#### Obtener todos los productos

- *URL:* /products/api/get
- *Método:* GET
- *Descripción:* Obtiene la lista de todos los productos disponibles.
- *Respuesta exitosa:*
  - *Código:* 200
  - *Contenido:* JSON con la lista de productos.
  - *Ejemplo de respuesta:*
    json
    [
      {
        "id": 1,
        "name": "Producto 1",
        "description": "Descripción del producto 1",
        "price": 100,
        "quantity": 10,
        "imageUrl": "/uploads/image1.jpg"
      },
      ...
    ]
    

#### Agregar un nuevo producto (Solo Admin)

- *URL:* /products/admin/add
- *Método:* POST
- *Descripción:* Permite a un administrador agregar un nuevo producto al inventario.
- *Autenticación:* Requiere autenticación y rol de administrador.
- *Parámetros del formulario:*
  - name: Nombre del producto.
  - description: Descripción del producto.
  - price: Precio del producto.
  - quantity: Cantidad en inventario.
  - image: Archivo de imagen del producto.
- *Respuesta exitosa:*
  - *Código:* 302 (Redirecciona a /products)

#### Agregar producto al carrito

- *URL:* /products/api/cart/add
- *Método:* POST
- *Descripción:* Permite a un cliente agregar un producto a su carrito.
- *Autenticación:* Requiere autenticación.
- *Parámetros del cuerpo:*
  - id: ID del producto.
  - quantity: Cantidad a agregar.
- *Encabezados:*
  - authorization: ID del usuario.
- *Respuesta exitosa:*
  - *Código:* 200
  - *Contenido:* JSON con el carrito actualizado.
  - *Ejemplo de respuesta:*
    json
    {
      "cart": [
        {
          "product": {
            "id": 1,
            "name": "Producto 1",
            "price": 100,
            "quantity": 2
          }
        },
        ...
      ]
    }
    

#### Ver productos en el carrito

- *URL:* /products/api/cart
- *Método:* GET
- *Descripción:* Obtiene los productos en el carrito del usuario.
- *Autenticación:* Requiere autenticación.
- *Encabezados:*
  - authorization: ID del usuario.
- *Respuesta exitosa:*
  - *Código:* 200
  - *Contenido:* JSON con el carrito.
  - *Ejemplo de respuesta:*
    json
    {
      "cart": [
        {
          "product": {
            "id": 1,
            "name": "Producto 1",
            "price": 100,
            "quantity": 2
          }
        },
        ...
      ]
    }
    

#### Comprar productos en el carrito

- *URL:* /products/buy
- *Método:* POST
- *Descripción:* Permite a un cliente comprar los productos en su carrito.
- *Autenticación:* Requiere autenticación.
- *Encabezados:*
  - authorization: ID del usuario.
- *Respuesta exitosa:*
  - *Código:* 200
  - *Contenido:* Renderiza la página de factura con la compra realizada.

### Endpoints de Usuarios

#### Registro de usuarios

- *URL:* /users/register
- *Método:* POST
- *Descripción:* Permite a un nuevo usuario registrarse.
- *Parámetros del cuerpo:*
  - username: Nombre de usuario.
  - password: Contraseña.
- *Respuesta exitosa:*
  - *Código:* 302 (Redirecciona a /products)

#### Inicio de sesión

- *URL:* /users/login
- *Método:* POST
- *Descripción:* Permite a un usuario iniciar sesión.
- *Parámetros del cuerpo:*
  - username: Nombre de usuario.
  - password: Contraseña.
- *Respuesta exitosa:*
  - *Código:* 302 (Redirecciona a /products)

#### Cierre de sesión

- *URL:* /users/logout
- *Método:* POST
- *Descripción:* Permite a un usuario cerrar sesión.
- *Respuesta exitosa:*
  - *Código:* 302 (Redirecciona a /login)

