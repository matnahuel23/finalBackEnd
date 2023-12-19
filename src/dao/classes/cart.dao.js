const cartModel = require ('../models/cart.model.js')

module.exports =  class Cart {
    getCarts = async () => {
        try {
            let result = await cartModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getCartById = async (cid) => {
        try {
            let result = await cartModel.findOne({ _id: cid }).populate('products.product')
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createCart = async (cart) => {
        try {
            let result = await cartModel.create(cart)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateCart = async (cid, cart) => {
        try {
            let result = await cartModel.updateOne({ _id: cid }, { $set: cart })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateCartTotal = async (cid, newTotal) => {
        try {
            const result = await cartModel.updateOne({ _id: cid }, { $set: { total: newTotal } });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    deleteCart = async (cid) => {
        try {
            let result = await cartModel.deleteOne({ _id: cid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
    
    indexProductInCart = async (cartId, productId) => {
        try {
          // Busca el carrito por su ID
          const cart = await cartModel.findOne({ _id: cartId });
          if (!cart) {
            // Si el carrito no se encuentra, puedes manejar el error o retornar -1
            return -1;
          }
          // Itera a través de los productos en el carrito y verifica si el producto está presente
          for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i].product.toString() === productId) {
              // Si el producto está en el carrito, retorna el índice
              return i;
            }
          }
          // Si el producto no se encuentra en el carrito, retorna -1
          return -1;
        } catch (error) {
          // Maneja el error como mejor convenga a tu aplicación
          console.error('Error en la función indexProductInCart:', error);
          return -1;
        }
    }   
}