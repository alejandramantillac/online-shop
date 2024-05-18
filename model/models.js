// models.js

/**
 * Represents a user in the online shop.
 */

class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
    this.cart = [];
    this.purchaseHistory = [];
  }

  /**
   * Adds a product to the user's cart.
   * @param {Object} product - The product to be added to the cart.
   * @param {number} [quantity=1] - The quantity of the product to be added. Defaults to 1.
   * @param {number} user_id - The ID of the user.
   * @returns {Array} - The updated cart of the user.
   * @throws {Error} - If the user is not found or there is not enough stock.
   */
  static addToCart(product, quantity = 1, user_id) {
    const user = User.users.find(user => user.id === parseInt(user_id));
    if (!user) {
      throw new Error('User not found');
    }

    const productInCart = user.cart.find(item => item.product.id === product.id);

    if (product.quantity < quantity || (productInCart && product.quantity < productInCart.quantity + quantity)) {
      throw new Error('Not enough stock');
    }

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      user.cart.push({ product, quantity });
    }

    return user.cart;
  }

  /**
   * Clears the cart for a specific user.
   * @param {number} user_id - The ID of the user.
   */
  static clearCart(user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    user.cart = [];
  }

  /**
   * Adds a purchase to the user's purchase history.
   * @param {Object} purchase - The purchase object to be added.
   * @param {number} user_id - The ID of the user.
   */
  static addPurchase(purchase, user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    user.purchaseHistory.push(purchase);
  }

  /**
   * Retrieves the purchase history of a user.
   * @param {number} user_id - The ID of the user.
   * @returns {Array} - An array containing the purchase history of the user.
   */
  static getPurchaseHistory(user_id) {
    const user = User.users.find((user) => user.id === parseInt(user_id));
    return user.purchaseHistory;
  }

  /**
   * Authenticates a user by checking if the provided username and password match any existing user.
   * @param {string} username - The username to authenticate.
   * @param {string} password - The password to authenticate.
   * @returns {User|null} - The authenticated user object if the username and password match, or null if no match is found.
   */
  static authenticate(username, password) {
    const user = User.users.find(user => user.username === username && user.password === password);
    return user ? user : null;
  }

  static users = [
    new User(1, 'admin', 'admin', 'admin'),
    new User(2, 'user', 'user', 'user'),
  ];
}

/**
 * Represents a product in the online shop.
 */
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

/**
 * Represents a purchase made by a user.
 */
class Purchase {
  /**
   * Creates a new instance of the Purchase class.
   * @param {number} id - The unique identifier for the purchase.
   * @param {number} userId - The ID of the user who made the purchase.
   * @param {Array} products - The array of products included in the purchase.
   * @param {number} totalAmount - The total amount of the purchase.
   * @param {string} qrCode - The QR code for the purchase.
   */
  constructor(id, userId, products, totalAmount, qrCode) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    this.totalAmount = totalAmount;
    this.date = new Date();
    this.qrCode = qrCode;
  }

  static purchases = [];
}

module.exports = {
  User,
  Product,
  Purchase,
};
