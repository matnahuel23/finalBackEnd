const Products = require ('../factory/product.factory.js')
const ProductRepository = require ('./products.repository.js')
const Users = require ('../factory/user.factory.js')
const UsersRepository = require ('./users.repository.js')
const Carts = require ('../factory/cart.factory.js')
const CartsRepository = require ('./carts.repository.js')
const Tickets = require ('../factory/ticket.factory.js')
const TicketsRepository = require ('./tickets.repository.js')


const productsService = new ProductRepository(new Products())
const userService = new UsersRepository(new Users())
const cartService = new CartsRepository (new Carts())
const ticketService = new TicketsRepository (new Tickets())

module.exports ={ productsService, usersService, cartsService, ticketsService }