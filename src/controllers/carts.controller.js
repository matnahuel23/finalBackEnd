const path = require ("path")
const cartsService = require("../dao/factory/cart.factory.js")
const productsService = require ("../dao/factory/product.factory.js")
const CartDTO = require ('../dao/DTOs/cart.DTO.js')

getCarts = async (req, res) => {
    try {
        let carts = await cartsService.getCarts()
        res.send({result:"success", payload:carts})
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener los carritos.' });
    }
}
getCartById = async (req, res) => {
    try {
        let { cid } = req.params;
        let cart = await cartsService.getCartById(cid)
        if (!cart) {
            res.send({ status: "error", error: 'Carrito no encontrado.' });
        } else {
            const viewPath = path.join(__dirname, '../views/cart.hbs');
            const { first_name, email, age, role, _id } = req.session.user;            
            // Renderiza la vista HBS y pasa los datos
            res.render(viewPath, { _id, cart, first_name, email, age, role });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el carrito.' });
    }
}
createCart = async (req, res) => {
    try {
        let newCart = new CartDTO({products, total})    
        let result = await cartsService.createCart(newCart);
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al agregar el carrito.' });
    }
}
updateCart = async (req, res) => {
    try {
        const { email } = req.session.user;
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = parseInt(req.body.quantity);
        
        if (quantity <= 0) {
            return res.send({ status: "error", error: 'Debe ingresar al menos una unidad del producto.' });
        }
        const cartAdd = await cartsService.getCartById(cid);
        if (!cartAdd) {
            return res.send({ status: "error", error: 'Carrito no encontrado' });
        }
        const product = await productsService.getProductById(pid);
        if (!product) {
            return res.send({ status: "error", error: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.send({ status: "error", error: 'No disponemos de ese stock' });
        }
        // Valido que el propietario del producto no pueda agregar su producto
        if ( email === product.owner){
            return res.send({ status: "error", error: 'No puede agregar un producto que le pertenece' });
        }
        // Verifica si el producto ya está en el carrito
        const existingProductIndex = await cartsService.indexProductInCart(cid, pid);
        if (existingProductIndex !== -1) {
            const existingProduct = cartAdd.products[existingProductIndex];
            if (existingProduct) {
                existingProduct.quantity += quantity;
            }
        } else {
            cartAdd.products.push({ product: pid, quantity });
        }
        cartAdd.markModified('products');
        const newStock = product.stock-quantity
        product.stock = newStock
        const newTotal = cartAdd.total + (product.price * quantity);
        cartAdd.total = newTotal;
        await cartsService.updateCart(cid, cartAdd);
        await productsService.updateProduct(pid, product);
        // Envía la respuesta al cliente
        return res.json({ status: "success", message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        // Envía la respuesta de error al cliente
        return res.status(500).json({ status: "error", message: 'Error al agregar el producto.' });
    }
}
deleteCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToRemove = await cartsService.getCartById({ _id: cid });

        if (!cartToRemove) {
            return res.status(404).json({ status: "error", error: 'Carrito no encontrado' });
        }

        // Devolver las cantidades de productos al stock
        for (const cartProduct of cartToRemove.products) {
            const product = await productsService.getProductById(cartProduct.product);
            const quantity = cartProduct.quantity;

            await productsService.updateProduct(
                { _id: product._id },
                { $inc: { stock: quantity } }
            );
        }

        await cartsService.deleteCart({ _id: cid });
        return res.json({ message: 'Carrito eliminado y cantidades de productos devueltas al stock correctamente.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el carrito.' });
    }
}
deleteProductOfCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = parseInt(req.body.quantity);
        if (quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor que 0.' });
        }
        const cart = await cartsService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
        const product = await productsService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        const productIndex = await cartsService.indexProductInCart(cid, pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }
        const cartProduct = cart.products[productIndex];
        if (cartProduct.quantity < quantity) {
            return res.status(400).json({ error: 'La cantidad a eliminar es mayor que la cantidad en el carrito.' });
        }
        // Restar la cantidad del producto en el carrito
        cartProduct.quantity -= quantity;
        // Actualizar el stock del producto y el total del carrito
        product.stock += quantity;
        const productTotal = product.price * quantity;
        cart.total -= productTotal;
        if (cartProduct.quantity === 0) {
        // Si la cantidad llega a 0, eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
        }
        await productsService.updateProduct(pid, product);
        await cartsService.updateCart(cid, cart);

        res.json({ message: 'Producto eliminado del carrito correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
}
clearCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToRemove = await cartsService.getCartById({ _id: cid });

        if (!cartToRemove) {
            return res.status(404).json({ status: "error", error: 'Carrito no encontrado' });
        }
        await cartsService.deleteCart({ _id: cid });
        return res.json({ message: 'Carrito vaciado correctamente.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al vaciar el carrito.' });
    }
}

module.exports = {
    getCarts,
    getCartById,
    createCart,
    updateCart,
    deleteCart,
    deleteProductOfCart,
    clearCart
};