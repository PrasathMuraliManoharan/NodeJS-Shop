const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = id
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 })
    }

    const updatedCart = { items: updatedCartItems }
    const db = getDb();
    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
      .then(result => {
        return result
      })
      .catch(err => {
        console.log(err)
      })
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user; getCart
      })
      .catch(err => {
        console.log(err);
      });
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(p => p.productId);
    return db.collection('products').find({ _id: { $in: [...productIds] } }).toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p, quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      })
  }
  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(p => {
      return p.productId.toString() !== productId.toString(); // to remove deleted prodID
    });

    const db = getDb();
    const updatedCart = { items: updatedCartItems }
    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
      .then(result => {
        return result
      })
      .catch(err => {
        console.log(err)
      })
  }
  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name
        }
      };
      return db.collection('orders').insertOne(order)
    })
      .then(result => {
        this.cart = { items: [] }
        const db = getDb();
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } })
          .then(result => {
            return result
          })
          .catch(err => {
            console.log(err)
          })

      })
    // })

  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({ "user._id": new mongodb.ObjectId(this._id) }).toArray()
      .then(orders => {
        return orders;
      })
      .catch(err => {
        console.log(err)
      })

  }
}

module.exports = User;
