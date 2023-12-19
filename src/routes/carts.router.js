const { Router } = require ("express")
const { getCarts, getCartById, createCart, updateCart, deleteCart, deleteProductOfCart, clearCart } = require ("../controllers/carts.controller.js")
const { getTickets, createTicket } = require ("../controllers/tickets.controller.js")

const router = Router()

router.get("/", getCarts)
router.get("/:cid", getCartById)
router.post("/", createCart)
router.put("/:cid/product/:pid", updateCart)
router.delete("/:cid", deleteCart)
router.delete("/:cid/product/:pid", deleteProductOfCart)
router.delete("/:cid", clearCart)
router.get("/:cid/ticket", getTickets)
router.post("/:cid/purchase", createTicket)

module.exports = { router }