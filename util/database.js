const mongodb = require('mongodb');
const path = require('./path')
const MongoClient = mongodb.MongoClient;
let db;

const mongoConnect = (callback) => {
  MongoClient.connect(path, { useUnifiedTopology: true })
    .then(client => {
      console.log('Connected to MongoDB'); 
      db = client.db();
      callback(); 
    })
    .catch(err =>{
      console.log(err);
    });
}

const getDb = () =>{
  if(db)
    return db;
  throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;