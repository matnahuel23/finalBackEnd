module.exports = class ProductDTO {
    constructor(product){
        this.title = product.title,
        this.description = product.description,
        this.code = product.code,
        this.price = product.price,
        this.stock = product.stock,
        this.category = product.category,
        this.status = true,
        this.thumbnails = product.thumbnails ? [thumbnails] : [],
        this.owner = product.owner;
    }
}