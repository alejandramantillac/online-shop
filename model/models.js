// models.js

class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
    this.cart = [];
    this.purchaseHistory = [];
  }

  static addToCart(product, quantity = 1, user_id) {
    const user = User.users.find(user => user.id === parseInt(user_id));
    if (!user) {
      throw new Error('User not found');
    }

    const productInCart = user.cart.find(item => item.product.id === product.id);

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      user.cart.push({ product, quantity });
    }

    return user.cart;
  }

  static clearCart(user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    user.cart = [];
  }

  static addPurchase(purchase, user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    user.purchaseHistory.push(purchase);
  }

  static getPurchaseHistory(user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    return user.purchaseHistory;
  }

  // Authentication method
  static authenticate(username, password) {
    const user = User.users.find(user => user.username === username && user.password === password);
    return user ? user : null;
  }

  static users = [
    new User(1, 'admin', 'admin', 'admin'),
    new User(2, 'user', 'user', 'user'),
  ];
}

class Product {
  constructor(id, name, description, price, quantity, imageUrl) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
      this.imageUrl = imageUrl;
  }

  reduceQuantity(amount) {
      if (this.quantity >= amount) {
          this.quantity -= amount;
      } else {
          throw new Error("Insufficient quantity");
      }
  }
  // add base product for dev
  static products = [
    new Product(
      1,
      'iPhone 14 Pro Max',
      'El iPhone 14 Pro Max es el buque insignia de Apple con su impresionante chip A16 Bionic, cámara de 48MP y pantalla Super Retina XDR de 6.7".',
      1099,
      20,
      'https://bit.ly/4dM59WE'
    ),
    new Product(
      2,
      'Samsung Galaxy S23 Ultra',
      'El Galaxy S23 Ultra es el smartphone más avanzado de Samsung con su cámara de 200MP, S Pen integrada y pantalla Dynamic AMOLED 2X de 6.8".',
      1199.99,
      15,
      'https://bit.ly/3WHFRmt'
    ),
    new Product(
      3,
      'Google Pixel 7 Pro',
      'El Pixel 7 Pro es el smartphone de gama alta de Google con su cámara de triple lente, chipset Tensor G2 y pantalla LTPO AMOLED de 6.7".',
      899,
      10,
      'https://bit.ly/3UL1lfx'
    ),
    new Product(
      4,
      'OnePlus 11 5G',
      'El OnePlus 11 5G es un smartphone potente con su procesador Snapdragon 8 Gen 2, cámara de 50MP y pantalla Fluid AMOLED de 6.7".',
      699,
      25,
      'https://bit.ly/3WO3r0Y'
    ),
    new Product(
      5,
      'Sony Xperia 1 IV',
      'El Xperia 1 IV de Sony es un smartphone enfocado en la fotografía con su cámara de triple lente, pantalla 4K HDR OLED de 6.5" y procesador Snapdragon 8 Gen 1.',
      1599,
      8,
      'https://bit.ly/4bn0SHA'
    ),
    new Product(
      6,
      'OPPO Find X6 Pro',
      'El OPPO Find X6 Pro es un smartphone de gama alta con su cámara de triple lente Hasselblad, pantalla LTPO AMOLED de 6.8" y carga súper rápida de 100W.',
      1099,
      12,
      'https://bit.ly/3QLDuva'
    )
  ];

}

class Purchase {
  constructor(id, userId, products, totalAmount) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    this.totalAmount = totalAmount;
    this.date = new Date();
  }

  static purchases = []
}

module.exports = {
  User,
  Product,
  Purchase,
};
