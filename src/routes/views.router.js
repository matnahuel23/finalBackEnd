const express = require ("express")
const passport = require ("passport")
const { getProducts} = require ('../controllers/products.controller.js')
const { createUser, logUser, restorePass, restorePassOk } = require ('../controllers/users.controller.js')
const path = require ("path")
const router = express.Router();
const usersService = require ("../dao/factory/user.factory.js")

// Rutas
router.post('/register', createUser)

router.post('/login', logUser) 

router.get('/products', getProducts)

router.get('/', (req, res) => {
    res.render('login.hbs');
});

router.get('/restorepassword', restorePassOk)

router.post('/restore', restorePass);

router.get('/faillogin', (req, res) => {
    res.redirect('/')
});

router.get('/admin', async (req, res) => {
    try {
        const viewPath = path.join(__dirname, '../views/admin.hbs');
        const { first_name, email, age, role } = req.session.user;
        let userAdmin = false
        if(role === "admin"){
            userAdmin = true
        }
        res.render(viewPath, { first_name, email, age, role, userAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Error en el ingreso al admin.' });
    }
});

router.get('/register', (req, res) => {
    res.render('register.hbs')
});

router.get('/failregister', async (req, res) => {
    res.send({ error: "Fallo el registro" });
});

router.get('/logout', async (req, res) => {
    try {
        // Obtén el usuario actualizado con la última conexión al cerrar sesión
        const user = req.session.user;
        const foundUser = await usersService.getUserByEmail(user.email)
        user._id = foundUser._id
        if (user) {
            const updatedUser = await usersService.updateUser(user._id, { last_connection: { logout: new Date() }});
            if (!updatedUser) {
                console.error('Error al actualizar last_connection_logout');
            }
        }
    } catch (error) {
        console.error('Error al actualizar last_connection_logout:', error);
    }
    // El destroy elimina datos de sesión
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/');
        } else {
            res.send({ status: 'Logout ERROR', body: err });
        }
    });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    const { first_name, last_name, email, age, role } = req.session.user;
    res.render('profile.hbs', { first_name, last_name, email, age, role });
});

router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send('¡Bienvenido!');
    }
});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'login'}), async(req,res) => {
    // Nuestra estrategia nos devolvera al usuario, solo lo agregamos a nuestro objeto de sesión.
    req.session.user = req.user
    res.redirect('/products');
});

router.get('/documents', (req, res) => {
    const viewPath = path.join(__dirname, '../views/documents.hbs');
    const { _id } = req.session.user;
    res.render(viewPath, { _id })
});

module.exports = router