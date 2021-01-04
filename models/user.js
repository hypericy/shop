const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User{
  constructor(username , email, cart, id){
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save(){
    const db = getDb();
    db.collection('users')
    .insertOne(this)
    .catch(console.log);
  }

  addToCart(product){
    // check if product is already in the cart
    const cartProduct = this.cart.items.findIndex(cp =>{
      return cp._id === product._id;
    })
    //
    const updatedCart ={items: [{...product,quantity: 1}]}
    return db.collection('user')
      .updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      { $set: {cart: updatedCart} }
      );
  }

  static findById(userId){
    const db = getDb();
    // console.log(userId);
    return db.collection('users')
    .findOne({_id: new mongodb.ObjectID(userId)})
    .then(user =>{
      return user;
    })
    .catch(console.log);
  }
}

module.exports = User; 