const ticketModel = require ('../models/ticket.model.js')

module.exports =  class Ticket {
    getTickets = async () => {
        try {
            let result = await ticketModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getTicketById = async (tid) => {
        try {
            let result = await ticketModel.findOne({ _id: tid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createTicket = async (ticket) => {
        try {
            let result = await ticketModel.create(ticket)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateTicket = async (tid, ticket) => {
        try {
            let result = await ticketModel.updateOne({ _id: tid }, { $set: ticket })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteTicket = async (tid) => {
        try {
            let result = await ticketModel.deleteOne({ _id: tid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    paginate = async (conditions, options) => {
        try {
            const { page, limit, sort } = options;

            const result = await ticketModel.paginate(conditions, {
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