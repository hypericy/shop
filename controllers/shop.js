const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
  // res.redirect('/');
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    console.log(products);
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
    .catch(console.log);
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(cartProducts => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
    .catch();

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  let fetchCart;
  req.user.getCart()
    .then(cart => {
      fetchCart = cart;
      return cart.getProducts({where: {id: prodId}});
    })
    .then( products =>{
      let product = products.length > 0? products[0] : undefined;
      let qty =1;
      if(product){
        qty = product.cartItem.quantity+1;
        return fetchCart.addProduct(product, { 
          through: { quantity: qty }
        });
      }

      return Product.findByPk(prodId)
      .then(product => {
        return  fetchCart.addProduct(product, { 
          through: { quantity: qty }
        });
      })
      .catch(console.log);
    })
    .then(()=>{
      res.redirect('/cart');
    })
    .catch(console.log);
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  req.user
  .getCart()
  .then( cart =>{
    return cart.getProducts({where:{id: id}});
  })
  .then(product =>{
    return product[0].cartItem.destroy();
  })
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(console.log);

}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders =>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(console.log);
  
};

exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user.getCart()
  .then((cart)=>{
    fetchCart = cart;
    return cart.getProducts();
  })
  .then((products)=>{
    return req.user
    .createOrder()
    .then(order =>{
      order.addProducts(
        products.map(product =>{
          product.orderItem = { quantity: product.cartItem.quantity};
          return product;
        })
      )
    })
    .catch(console.log);
  })
  .then(()=>{
    return fetchCart.setProducts(null);
  })
  .then(()=>{
    res.redirect('/orders');
  })
  .catch(console.log)
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};