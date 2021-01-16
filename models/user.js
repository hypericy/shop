const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection('users')
      .insertOne(this)
      .catch(console.log);
  }

  addToCart(product) {
    // check if product is already in the cart
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    })
    let quantity = 1
    let updatedCart;
    if (cartProductIndex >= 0) {
      this.cart.items[cartProductIndex].quantity += 1;
      updatedCart = this.cart;
    }
    else {
      updatedCart = { items: [...this.cart.items, { productId: new mongodb.ObjectId(product._id), quantity: quantity }] }
    }

    const db = getDb();
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId
    });
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p, quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      });
  }

  deleteCartProduct(id) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== id.toString();
    })
    console.log(updatedCartItems);
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: new mongodb.ObjectId(this._id),
      }  
      return db.collection('orders')
      .insertOne(order)  
    })
    .then(() => {
      this.cart = { items: [] };
      return db.collection('users')
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: this.cart } }
        );
    })
    .catch(console.log);
  }

  getOrders() {
    const db = getDb();

    return db.collection('orders')
      .find({user: new mongodb.ObjectID(this._id)})
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) })
      .then(user => {
        return user;
      })
      .catch(console.log);
  }
}

module.exports = User; 