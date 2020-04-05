const db = require('../utils/database');
const Cart = require('./cart');
const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return cb([]);
        return cb(JSON.parse(fileContent));
    })
}
module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        // getProductsFromFile(products => {
        //     if (this.id) {
        //         const existingProductIndex = products.findIndex(p => p.id === this.id);
        //         const existingProduct = products[existingProductIndex];
        //         const updatedProducts = [...products];
        //         updatedProducts[existingProductIndex] = this;
        //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        //             console.log(err)
        //         })
        //     } else {
        //         this.id = Math.random();
        //         products.push(this);
        //         fs.writeFile(p, JSON.stringify(products), (err) => {
        //             console.log(err)
        //         })
        //     }
        // })

        //using sql
        return db.execute('INSERT INTO products (title,price,description,imageUrl) values (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl])
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteCartById(product.id, product.price)
                }
            })
        })
    }

    static fetchAll() {
        // getProductsFromFile(cb);
        // using sql
        return db.execute('SELECT * FROM products')
    }

    static findById(id, cb) {
        // getProductsFromFile(products => {
        //     const product = products.find(p => p.id === id);
        //     cb(product);
        // })

        // using sql
        return db.execute('SELECT * FROM products where products.id = ?', [id])

    }
}