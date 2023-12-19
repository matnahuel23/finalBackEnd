const config = require('../../config/config.js');

switch (config.persistence) {
    case "MONGO":
        const ProductsMongo = require ('../classes/product.dao.js')
        Products = new ProductsMongo ();
        break
    case "MEMORY":
        const ProductsMemory= require('../memory/product.memory.js');
        Products = new ProductsMemory;
        break;
}

module.exports = Products;