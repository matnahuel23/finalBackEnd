module.exports = class TicketDTO {
    constructor(ticket){
        this.code = ticket.code,
        this.purchase_datetime =  Date.now(),
        this.phone = ticket.phone,
        this.email = ticket.email,
        this.cart = ticket.cart,
        this.total = ticket.total
    }
}