const Contenedor = require ('./fileSystem.js')
const fs = new Contenedor () 

module.exports =  class Ticket {
    constructor() {
        this.data = []
    }
    
    getTicket = async () => {
        return fs.getAll()
    }

    getTicketById = async (tid) => {
        return fs.getById(tid)
    }

    createTicket = async (ticket) => {
        fs(ticket)
    }

    deleteTicket = async (tid) => {
        fs.deleteById(tid)
    }
    
    updateTicket = async (tid, newTicket) => {
        fs.updateObject(tid, newTicket)
    }
}