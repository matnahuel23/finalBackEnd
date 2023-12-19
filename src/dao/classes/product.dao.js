const productModel = require ('../models/product.model.js')

module.exports =  class Product {
    getProducts = async () => {
        try {
            let result = await productModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (pid) => {
        try {
            let result = await productModel.findOne({ _id: pid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductByTitle = async (title) => {
        try {
            let result = await productModel.findOne({ title })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createProduct = async (product) => {
        try {
            let result = await productModel.create(product)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateProduct = async (pid, product) => {
        try {
            let result = await productModel.updateOne({ _id: pid }, { $set: product })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteProduct = async (pid) => {
        try {
            let result = await productModel.deleteOne({ _id: pid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    paginate = async (conditions, options) => {
        try {
            const { page, limit, sort } = options;

            const result = await productModel.paginate(conditions, {
                page,
                limit,
                sort,
            });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}