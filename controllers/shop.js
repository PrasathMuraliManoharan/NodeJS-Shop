const Product = require('../models/product')
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products',
            })
        })
        .catch(err => {
            console.log(err);
        });

};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            res.render('shop/product-detail',
                {
                    product: product[0],
                    pageTitle: product.title,
                    path: '/products'
                })
        })
        .catch(err => { console.log(err) })
}

exports.getIndex = (req, res, next) => {

    Product.fetchAll()
        .then(([rows, fieldData]) => {
            console.log(rows)
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
            })
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (product of cart.products) {
                const cartProductData = products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: cartProductData, qty: product.qty })
                }
            }
            res.render('shop/cart', {
                products: cartProducts,
                pageTitle: 'Your Cart',
                path: '/cart',
            })
        })
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(product.id, product.price)
    });
    res.redirect('/cart');
};
exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Your Orders',
            path: '/orders',
        })
    });
};
exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/checkout',
        })
    });
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productid;
    Product.findById(prodId, (product) => {
        Cart.deleteCartById(prodId, product.price);
        res.redirect('/cart');
    })
}




