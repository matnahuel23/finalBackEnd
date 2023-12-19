const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const Contenedor = require('./dao/memory/fileSystem.js');
const passport = require('passport');
const config = require('./config/config.js');
// EMAIL
const { sendEmail } = require('./utils/email.js');
//CORS
const cors = require('cors');

const cartsJsonPath = path.join(__dirname, 'data', 'carts.json');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const initializePassport = require('./config/passport.js');

// ENV
const PORT = config.port || 8080;
const cookiePass = config.cookiePass;
const adminPass = config.adminPass;
const mongoURL = config.mongoUrl;

// Cookie
app.use(cookieParser(cookiePass));

// Session
app.use(session({
  store: MongoStore.create({
    mongoUrl: mongoURL,
    ttl: 6000,
  }),
  secret: adminPass,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();
// Conectarse a Mongoose
mongoose.connect(mongoURL);

// Swagger
const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title:"Documentación Ecommerce Matías Ierace",
      description:"API Swagger"
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

// Configurar el motor de plantillas y las rutas de vistas en la aplicación principal
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cors ver en: http://localhost:5500/frontend/index.html
app.use(cors({origin: 'http://localhost:5500', methods:['GET', 'POST','PUT']}));

// Socket.io
const users = {};
io.on('connection', (socket) => {
  // Conexión y Desconexión de usuarios
  socket.on('newUser', (username) => {
    users[socket.id] = username;
    console.log('Un usuario se ha conectado');
    io.emit('userConnected', username);
  });
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`Un usuario ${username} se ha desconectado`);
    delete users[socket.id];
    io.emit('userDisconnected', username);
  });

  // Agregar y Borrar Productos
  socket.on('addProduct', async (product) => {
    try {
      // Emitir el evento a todos los clientes conectados
      io.emit('productAdded', product);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  });

  socket.on('deleteProduct', async (deletedProductId) => {
    try {
      // Emitir el evento a todos los clientes conectados
      io.emit('productDeleted', deletedProductId);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  });

  // Agregar y borrar Carrito
  socket.on('addCart', async (cart) => {
    try {
      const contenedor = new Contenedor(cartsJsonPath);
      const newCartId = await contenedor.save(cart);
      const newCart = { id: newCartId, ...cart };
      io.emit('cartAdded', newCart);
    } catch (error) {
      console.error('Error al agregar el carrito:', error);
    }
  });

  socket.on('deleteCart', async (cartId) => {
    try {
      const contenedor = new Contenedor(cartsJsonPath);
      await contenedor.deleteById(cartId);
      io.emit('cartDeleted', cartId);
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
    }
  });

  // Chat
  socket.on('chatMessage', (message) => {
    console.log('Mensaje ingresado');
    const username = users[socket.id];
    io.emit('message', { username, message });
  });
});

// Routers
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const usersRouter = require('./routes/users.router.js');
const viewsRouter = require('./routes/views.router.js');
const cookieRouter = require('./routes/cookie.router.js');
const chatsRouter = require('./routes/chat.router.js');

app.use('/products', productsRouter.router);
app.use('/carts', cartsRouter.router);
app.use('/users', usersRouter.router);
app.use('/', viewsRouter);
app.use('/', cookieRouter.router);
app.use('/', chatsRouter.router);

//EMAIL
app.post('/mail', async (req, res) => {
  const { correo, mensaje } = req.params
  try {
    await sendEmail( correo, mensaje ); 
    res.send("Correo enviado con Éxito");
  } catch (error) {
    console.log(error);
    res.send("Error de envío");
  }
});

// Listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});