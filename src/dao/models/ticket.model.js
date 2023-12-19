const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  phone: { type: String, required: true },
  email: {type: String,  required: true},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' },
  total: {type: Number, required: true}
},{ versionKey: false });

const ticketModel = mongoose.model('Ticket', ticketSchema)

module.exports = ticketModel