const passport = require ("passport")
const local = require ("passport-local")
const User = require ("../dao/classes/user.dao.js")
const Cart = require ("../dao/classes/cart.dao.js")
const { createHash, isValidatePassword } = require ("../utils/bcrypt.js")
const GitHubStrategy = require ("passport-github2")
const config = require ("./config.js")
const CartDTO = require ('../dao/DTOs/cart.DTO.js')
const UserDTO = require ('../dao/DTOs/user.DTO.js')

const localStrategy = local.Strategy;
const admin = config.adminName
const clientID = config.clientID
const clientSecret = config.clientSecret
const callbackURL = config.callbackURL
const usersService = new User()
const cartsService = new Cart()

const initializePassport = () => {
    configureLocalStrategy();
    configureGitHubStrategy();
    configureSerialization();
};
const configureLocalStrategy = () => {
// Configuración de la estrategia local de registro
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const { first_name, last_name, email, age, role } = req.body;
            let products = [];
            let total= 0;
            try {
                let user = await usersService.getUserByEmail(username);
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                // Crear el carrito primero
                let cart = new CartDTO({products, total})  
                let newCart = await cartsService.createCart(cart);
                let newUser = new UserDTO({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                    role,
                    last_connection: [{ login: new Date() }]
                })

                if (email === admin) {
                    newUser.role = "admin";
                }

                // Crear el usuario después de crear el carrito
                let result = await usersService.createUser(newUser);
                return done(null, result);
            } catch (error) {
                console.error("Error en el registro:", error);
                return done(error);
            }
        }
        ));
    // Configuración de la estrategia local de inicio de sesión
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await usersService.getUserByEmail(email);
            if (!user) {
                console.log('El usuario no existe');
                return done(null, false, { message: 'Usuario no encontrado.' });
            }
            if (!isValidatePassword(user, password)) {
                console.log('Contraseña incorrecta');
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            return done(error);
        }
    }));
    
}
const configureGitHubStrategy = () => { 
    // Configuración de la estrategia de registro con GitHub, previamente instale passport-github2
    passport.use('github', new GitHubStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            let user = await usersService.getUserByEmail(profile._json.email)
            if(!user){ // Si el usuario no existe en nuestra BD, lo agrego
                // Crear el carrito primero
                const newCart = await cartsService.createCart({
                    products: [],
                    total: 0
                });
                let newUser = {
                    first_name:profile._json.name,
                    last_name:'',
                    age:18,
                    email:profile._json.email,
                    password:'', // al ser autentificacion de terceros, no podemos asignar un password
                    cart: newCart._id,
                    role: "user",
                    last_connection: [{ login: new Date() }]
                }
                let result = await usersService.createUser(newUser)
                done(null, result)
            } else { // Si entra aca, es porque el usuario ya existia en nuestra BD
                    await usersService.updateUser(user._id, {
                    last_connection: { login: new Date() }
                });
            done(null, user)
            }
        }catch(error){
            return done(error)
        }
    }))
}
const configureSerialization = () => { 
    // Serialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });
    
    passport.deserializeUser(async (email, done) => {
        try {
            let user = await usersService.getUserByEmail(email);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializePassport
