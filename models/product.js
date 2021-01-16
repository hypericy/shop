const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product{
  constructor(title , price , description , imageUrl, id, userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this._id = new mongodb.ObjectID(id);
  }
  save() {
    const db = getDb();
    return db.collection('products')
    .insertOne(this)
    .then(result =>{
      // console.log(result);
    })
    .catch(console.log);
  }

  update(){
    const db = getDb();
    return db.collection('products')
    .updateOne({_id: this._id}, {$set: this})
    .then(result =>{
      // console.log(result);
    })
    .catch(console.log);
  }

  static fetchAll(){
    const db = getDb(); 
    return db.collection('products').find().toArray();
  }

  static findById(id){
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectID(id)})
    .next()
    .then(product=>{
      return product;
    })
    .catch(console.log);
  }

  static deleteById(id){
    const db = getDb();
    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectID(id)})
    .then()
    .catch(console.log)
  }
}



module.exports = Product;
