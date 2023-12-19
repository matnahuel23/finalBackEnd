const CartDTO = require ('../DTOs/cart.DTO')

module.exports = class CartRepository {
    constructor(dao){
        this.dao = dao
    }
    getCarts = async () => {
        let result = await this.dao.getCarts()
        return result
    }
    createCart = async (cart) => {
        let cartToInsert = new CartDTO(cart)
        let result = await this.dao.createCart(cartToInsert)
        return result
    }
}