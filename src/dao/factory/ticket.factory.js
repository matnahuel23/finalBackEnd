const config = require('../../config/config.js');

switch (config.persistence) {
    case "MONGO":
        const TicketsMongo = require ('../classes/ticket.dao.js')
        Tickets = new TicketsMongo ();
        break
    case "MEMORY":
        const TicketsMemory= require('../memory/ticket.memory.js');
        Tickets = new TicketsMemory;
        break;
}

module.exports = Tickets;