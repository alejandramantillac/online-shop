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

  static users = [];
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

  static products = [];
}

class Purchase {
  constructor(id, userId, products, totalAmount) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    this.totalAmount = totalAmount;
    this.date = new Date();
  }
}

module.exports = {
  User,
  Product,
  Purchase,
};
