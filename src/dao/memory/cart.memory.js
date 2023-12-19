const Contenedor = require ('./fileSystem.js')
const fs = new Contenedor () 

module.exports =  class Products {
    constructor() {
        this.data = []
    }
    
    getCarts = async () => {
        return fs.getAll()
    }

    getCartById = async (pid) => {
        return fs.getById(pid)
    }

    createCart = async (product) => {
        fs(product)
    }

    deleteCart = async (pid) => {
        fs.deleteById(pid)
    }

    indexProductInCart = async (cartId, productId) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((c) => c._id === cartId);

            if (!cart) {
                return -1; // Carrito no encontrado
            }

            // Itera a través de los productos en el carrito y verifica si el producto está presente
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].product.toString() === productId) {
                    // Si el producto está en el carrito, retorna el índice
                    return i;
                }
            }

            return -1; // Producto no encontrado en el carrito
        } catch (error) {
            console.log(error);
            return -1; // Error en la función
        }
    }
    
    updateCart = async (cartId, newCart) => {
        fs.updateObject(cartId, newCart)
    }

    updateCartTotal = async (cartId, newTotal) => {
        fs.updateObject(cartId, newTotal)
    }
}