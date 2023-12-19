const ProductDTO = require ('../DTOs/product.DTO.js')

module.exports = class ProductRepository {
    constructor(dao){
        this.dao = dao
    }
    getProducts = async () => {
        let result = await this.dao.getProducts()
        return result
    }
    createProduct = async (product) => {
        let productToInsert = new ProductDTO(product)
        let result = await this.dao.createProduct(productToInsert)
        return result
    }
}