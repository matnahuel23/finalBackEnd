const twilio = require ('twilio');
const config = require ('../config/config.js')

const twilioAccountSID = config.twilioAccountSID;
const twilioAuthToken = config.twilioAuthToken;
const twilioSmsPhone = config.twilioSmsPhone;

const client = twilio(twilioAccountSID, twilioAuthToken);

// Función para enviar mensajes SMS
function sendSMS(message, toPhoneNumber) {
  return client.messages.create({
    body: message,
    from: twilioSmsPhone,
    to: toPhoneNumber,
  });
}

module.exports = { sendSMS }
