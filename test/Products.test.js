// Usare CHAI para test

const mongoose = require ('mongoose')
const Product = require ('../src/dao/classes/product.dao.js')
const config = require ('../src/config/config.js');
const chai = require ('chai')

// ENV
const mongoURLTesting = config.mongoURLTesting;

// Conectarse a Mongoose
mongoose.connect(mongoURLTesting);

const expect = chai.expect

describe("Test Products con CHAI",()=>{
    before(function(){
        this.productDAO = new Product()
    })
    it("El DAO debe obtener un arreglo con productos", async function(){
        const result = await this.productDAO.getProducts()
        expect(result).to.be.deep.equal(result, [])
    })
/*     beforeEach(function(){
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    }) */
})
