const dotenv = require ("dotenv")

dotenv.config()

module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoURLTesting: process.env.MONGO_URL_TESTING,
    userTest: process.env.USER_TEST,
    adminName: process.env.ADMIN_NAME,
    adminPass: process.env.ADMIN_PASSWORD,
    cookiePass: process.env.COOKIE_PASSWORD,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    persistence: process.env.PERSISTENCE,
    userMail: process.env.USER_MAIL,
    passMail: process.env.PASS_MAIL,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsPhone: process.env.TWILIO_SMS_PHONE
}