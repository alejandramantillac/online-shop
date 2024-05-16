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

  addToCart(product) {
    this.cart.push(product);
  }

  clearCart() {
    this.cart = [];
  }

  addPurchase(purchase) {
    this.purchaseHistory.push(purchase);
  }

  getPurchaseHistory() {
    return this.purchaseHistory;
  }

  // Authentication method
  static authenticate(username, password, users) {
    const user = users.find(user => user.username === username && user.password === password);
    return user ? user : null;
  }
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
