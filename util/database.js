const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://chris:kcSciWwxrdcMAd48@cluster0.nphhe.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
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