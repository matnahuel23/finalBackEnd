const ticketsService = require ("../dao/factory/ticket.factory.js")
const cartsService = require ("../dao/factory/cart.factory.js")
const usersService = require ("../dao/factory/user.factory.js")
const path = require ("path");
const TicketDTO = require ('../dao/DTOs/ticket.DTO.js')
const { generateEmailContent, sendEmail } = require ('../utils/email.js')
const { sendSMS } = require ('../utils/twilio.js')

function generateRandomAlphaNumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

getTickets = async (req, res) => {
    try {
        const { email, cart, role } = req.session.user;
        const result = await cartsService.getCartById(cart)
        const viewPath = path.join(__dirname, '../views/ticket.hbs');
        res.render(viewPath, { email, result, cart, role});
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener el ticket.' });
    }
}
getTicketById = async (req, res) => {
    try {
        let { tid } = req.params;
        let ticket = await ticketsService.getTicketById(tid)
        if (!ticket) {
            res.send({ status: "error", error: 'Ticket no encontrado.' });
        } else {
            const viewPath = path.join(__dirname, '../views/ticket.hbs');
            const { first_name, email, age, role } = req.session.user;   
            res.render(viewPath, { cart, first_name, email, age, role });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el ticket.' });
    }
}
createTicket = async (req, res) => {
    try {
        const { phone } = req.body;
        const { email } = req.session.user;

        if (!phone) {
            return res.status(400).send({ status: "error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
        }

        // Obtener el carrito del usuario
        const user = await usersService.getUserByEmail(email);
        if (!user || !user.cart) {
            return res.status(400).send({ status: "error", error: 'El usuario no tiene un carrito válido.' });
        }

        const result = await cartsService.getCartById(user.cart);
        const total = result.total;
        if (!result || !result.products || result.products.length === 0) {
            return res.status(400).send({ status: "error", error: 'El carrito está vacío o no es válido.' });
        }

        let code = generateRandomAlphaNumeric(10);
        // Construye el mensaje del correo electrónico utilizando la función de utilidad
        const emailContent = await generateEmailContent(code, result.products, total);

        let newTicket = new TicketDTO({ code, phone, email, cart: result, total });
        await ticketsService.createTicket(newTicket);

        // Envía el correo electrónico después de crear el ticket
        try {
            await sendEmail(email, emailContent);
            console.log('Correo electrónico enviado con éxito');
        } catch (error) {
            console.log('Error al enviar el correo electrónico:', error);
            res.status(500).send({ status: "error", error: 'Error al enviar el Email. Detalles: ' + error.message });
        }

        // Crear un nuevo carrito
        let newCart = await cartsService.createCart();
        // Actualizar el campo "cart" del usuario con el ID del nuevo carrito
        await usersService.updateUser(user._id, { cart: newCart._id });
        const message = "Su compra se realizó correctamente. Número de código: " + code;
        try {
            await sendSMS( message, phone)
            console.log('SMS enviado con éxito');
        } catch (error) {
            console.log('Error al enviar el SMS:', error);
        }
        res.status(200).json({ result: "success", message });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al generar el Ticket. Detalles: ' + error.message });
    }
}
updateTicket = async (req, res) => {
    try {
        let { tid } = req.params;
        const ticketToReplace = req.body;
        // Validamos que se proporcionen campos para actualizar
        if (Object.keys(ticketToReplace).length === 0) {
            return res.send({ status: "error", error: 'Debe proporcionar al menos un campo para actualizar.' });
        }
        let result = await ticketsService.updateTicket(tid, ticketToReplace);
        if (!result) {
            return res.send({ status: "error", error: 'Producto no encontrado.' });
        }
        // Actualizamos los campos del producto encontrado
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.send({ status: "error", error: 'Error al actualizar el ticket.' });
    }
}
deleteTicket = async (req, res) => {
    try {
        let {tid} = req.params;
        let result = await ticketsService.deleteTicket({_id: tid})
        res.send({ result: "success", message: 'Ticket eliminado correctamente.', payload: result })      
    } catch (error) {
        res.send({ status: "error", error: 'Error al eliminar el ticket.' });
    }
}

module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
};