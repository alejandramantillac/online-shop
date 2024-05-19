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

Instala las dependencias del proyecto:

```bash
npm install
```

### Ejecución

1. Inicia el servidor:

   ```bash
   npm start
   ```
2. Abre tu navegador web y navega a `http://localhost` podrás ingresar con las credenciales predefenidas (admin o user), o crear un nuevo usuario.

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

A continuación se detallan los endpoints disponibles en la API de productos, junto con ejemplos de peticiones.

    ***Nota:*** **las id's de usuario son autogeneradas, por lo que las id's de los ejemplos solo son para muestra.**

#### 1. Obtener productos en formato JSON

**Endpoint:** `GET /products/api`

Este endpoint devuelve un JSON con todos los productos disponibles.

    **URL:**` /products/api`
    **Método:**` GET`
    **Autenticación:** No requiere autenticación.

**Ejemplo de petición:**

```http
GET http://127.0.0.1/products/api HTTP/1.1
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "iPhone 14 Pro Max",
    "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
    "price": 1099,
    "quantity": 20,
    "imageUrl": "https://bit.ly/4dM59WE"
  },
  ...
]
```

---

#### 2. Añadir un producto al carrito

**Endpoint:** `POST /products/api/cart/add`

    **URL:** `/products/api/cart/add`
    **Método:** `POST`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

    **Cuerpo:**
        `id=<id_del_producto>`
        `quantity=<cantidad_a_agregar>`

**Ejemplo de petición:**

```http
POST http://127.0.0.1/products/api/cart/add HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
Content-Type: application/x-www-form-urlencoded

id=1&quantity=1
```

**Respuesta:**

```json
[
  {
    "product": {
      "id": 1,
      "name": "iPhone 14 Pro Max",
      "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
      "price": 1099,
      "quantity": 18,
      "imageUrl": "https://bit.ly/4dM59WE"
    },
    "quantity": 2
  },
  ...
]
```

---

#### 3. Obtener productos en el carrito

**Endpoint:** `GET /products/api/cart`

Este endpoint devuelve un JSON con los productos en el carrito del usuario.

    **URL:** `/products/api/cart`
    **Método:** `GET`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

**Ejemplo de petición:**

```http
GET http://127.0.0.1/products/api/cart HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
```

**Respuesta:**

```json
[
  {
    "product": {
      "id": 1,
      "name": "iPhone 14 Pro Max",
      "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
      "price": 1099,
      "quantity": 18,
      "imageUrl": "https://bit.ly/4dM59WE"
    },
    "quantity": 2
  },
  ...
]
```

---

#### 4. Eliminar productos del carrito

**Endpoint:** `POST /products/api/cart/remove`

Este endpoint permite a los usuarios eliminar productos de su carrito.

    **URL:** `/products/api/cart/remove`
    **Método:** `POST`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

    **Cuerpo:**
        `id=<id_del_producto>`
        `quantity=<cantidad_a_remover>`

**Ejemplo de petición:**

```http
POST http://127.0.0.1/products/api/cart/remove HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
Content-Type: application/x-www-form-urlencoded

id=1&quantity=1
```

**Respuesta:**

```json
[
  {
    "product": {
      "id": 1,
      "name": "iPhone 14 Pro Max",
      "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
      "price": 1099,
      "quantity": 19,
      "imageUrl": "https://bit.ly/4dM59WE"
    },
    "quantity": 1
  },
  ...
]
```

---

#### 5. Comprar productos del carrito

**Endpoint:** `POST /products/api/buy`

Este endpoint permite a los usuarios comprar los productos en su carrito.

    **URL:** `/products/api/buy`
    **Método:** `POST`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

**Ejemplo de petición:**

```http
POST http://127.0.0.1/products/api/buy HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
```

**Respuesta:**

```json
{
  "id": 1,
  "userId": "user_id",
  "products": [
    {
      "product": {
        "id": 1,
        "name": "iPhone 14 Pro Max",
        "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
        "price": 1099,
        "quantity": 18,
        "imageUrl": "https://bit.ly/4dM59WE"
      },
      "quantity": 2
    }
  ],
  "totalAmount": 2198,
  "date": "2023-05-17T12:34:56.789Z",
  "qrCode": "data:image/png;base64,....."
}
```

---

#### 6. Ver factura en formato JSON

**Endpoint:** `GET /products/api/invoice/:id`

Este endpoint permite a los usuarios obtener una factura en formato JSON.

    **URL:** `/products/api/invoice/<id_de_factura>`
    **Método:** `GET`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

**Ejemplo de petición:**

```http
GET http://127.0.0.1/products/api/invoice/1 HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
```

**Respuesta:**

```json
{
  "id": 1,
  "userId": "user_id",
  "products": [
    {
      "product": {
        "id": 1,
        "name": "iPhone 14 Pro Max",
        "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7\".",
        "price": 1099,
        "quantity": 18,
        "imageUrl": "https://bit.ly/4dM59WE"
      },
      "quantity": 2
    }
  ],
  "totalAmount": 2198,
  "date": "2023-05-17T12:34:56.789Z",
  "qrCode": "data:image/png;base64,....."
}
```

---

#### 7. Ver historial de compras en formato JSON

**Endpoint:** `GET /products/api/history`

Este endpoint permite a los usuarios obtener su historial de compras en formato JSON.

    **URL:** `/products/api/history`
    **Método:** `GET`
    **Autenticación:** Requiere autenticación.

    **Encabezados:**
        `Authorization: <id_del_usuario>`

**Ejemplo de petición:**

```http
GET http://127.0.0.1/products/api/history HTTP/1.1
Authorization: sss2beqmkfqo65z6s1yii
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "userId": "user_id",
    "products": [
      {
        "product": {
          "id": 1,
          "name": "iPhone 14 Pro Max",
          "description": "El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina X

DR de 6.7\".",
          "price": 1099,
          "quantity": 18,
          "imageUrl": "https://bit.ly/4dM59WE"
        },
        "quantity": 2
      }
    ],
    "totalAmount": 2198,
    "date": "2023-05-17T12:34:56.789Z",
    "qrCode": "data:image/png;base64,....."
  }
]
```
