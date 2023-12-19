const path = require ("path")
const productsService = require ("../dao/factory/product.factory.js")
const ProductDTO = require ('../dao/DTOs/product.DTO.js')
const { sendEmail } = require ("../utils/email.js")

getProducts = async (req, res) => {
    try {
        const { sort, category, status, page, limit } = req.query;
        // Parsea el valor de sort a un número entero
        const priceSort = sort ? parseInt(sort) : 1;
        // Define las condiciones de búsqueda
        const conditions = {};
        // Agrega la condición de filtrado por categoría si se proporciona
        if (category) {
            conditions.category = category;
        }
        // Agrega la condición de filtrado por status si se proporciona
        if (status !== undefined) {
            conditions.status = status === 'true'; // Convierte el valor a booleano
        }
        // Realiza la consulta utilizando paginate()
        const options = {
            page: page || 1, // Página actual
            limit: limit || 10, // Cantidad de resultados por página
            sort: { price: priceSort }, // Ordenar por precio
        }
        const products = await productsService.paginate(conditions, options)
        const viewPath = path.join(__dirname, '../views/products.hbs');
        const { _id, first_name, last_name, email, age, cart, role } = req.session.user;
        let userPremium = false
        if(role === "premium"){
            userPremium = true
        }
        res.render(viewPath, { _id, products, first_name, last_name, email, age, cart, role, userPremium})
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al mostrar productos. Detalles: ' + error.message });
    }
}
getProductById = async (req, res) => {
    const { pid } = req.params
    let result = await productsService.getProductById(pid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}
getProductByTitle = async (req, res) => {
    try {
        let { title } = req.params
        let product = await productsService.getProductByTitle(title)
        if (!product) {
            return res.send({status:"error", error: 'Producto no encontrado.' });
        }
        res.send({result:"success", payload:product})
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener el producto.' });
    }
}
createProducts = async (req, res) => {
    try {
        const { email, role } = req.session.user
        let owner = "admin"
        if(role !== "admin"){
            owner = email
        }
        let { title, description, code, price, stock, category, thumbnails } = req.body;
        let product = new ProductDTO({title, description, code, price, stock, category, thumbnails, owner})
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: "error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
        }
        // Agregar el producto en la base de datos
        let result = await productsService.createProduct(product);
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al agregar el producto. Detalles: ' + error.message });
    }
}
updateProduct = async (req, res) => {
    try {
        const { email, role } = req.session.user
        let { pid } = req.params;
        const productToReplace = req.body;

        // Verificamos si el usuario tiene el rol de administrador o es el propietario del producto
        if (role !== "admin" && productToReplace.owner !== email) {
            return res.send({ status: "error", error: 'No tienes permiso para actualizar este producto.' });
        }
        // Validamos que se proporcionen campos para actualizar
        if (Object.keys(productToReplace).length === 0) {
            return res.send({ status: "error", error: 'Debe proporcionar al menos un campo para actualizar.' });
        }
        // Verificamos si el stock es igual a 0 y actualizo el status
        if (productToReplace.stock == "0") {
            productToReplace.status = false;
        } else {
            productToReplace.status = true;
        }
        let result = await productsService.updateProduct(pid, productToReplace);
        if (!result) {
            return res.send({ status: "error", error: 'Producto no encontrado.' });
        }
        // Actualizamos los campos del producto encontrado
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.send({ status: "error", error: 'Error al actualizar el producto.' });
    }
}
deleteProduct = async (req, res) => {
    try {
      let { pid } = req.params;
      const { email, role } = req.session.user;
      const product = await productsService.getProductById(pid);
  
      if (!product) {
        return res.send({ status: "error", error: 'Producto no encontrado.' });
      }
  
      if (role !== "admin" && product.owner !== email) {
        return res.send({ status: "error", error: 'No tienes permiso para eliminar este producto.' });
      }
  
      // Obtener el resultado antes de eliminar el producto
      const result = await productsService.deleteProduct({ _id: pid });
  
      // Si el propietario no es "admin", enviar un correo electrónico
      if (product.owner !== "admin") {
        const emailContent = `El producto "${product.title}" ha sido eliminado correctamente.`;
        const emailSubject = "Producto Eliminado";
  
        await sendEmail(product.owner, emailContent, emailSubject);
      }
  
      res.send({ result: "success", message: 'Producto eliminado correctamente.', payload: result });
    } catch (error) {
      console.error(`Error: ${error}`);
      res.send({ status: "error", error: 'Error al eliminar el producto.' });
    }
  };

module.exports = {
    getProducts,
    getProductById,
    getProductByTitle,
    createProducts,
    updateProduct,
    deleteProduct,
  };