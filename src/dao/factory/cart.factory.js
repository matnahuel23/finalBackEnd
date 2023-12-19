const config = require('../../config/config.js');

switch (config.persistence) {
    case "MONGO":
        const CartsMongo = require ('../classes/cart.dao.js')
        Carts = new CartsMongo ();
        break
    case "MEMORY":
        const CartsMemory= require('../memory/cart.memory.js');
        Carts = new CartsMemory;
        break;
}

module.exports = Carts;