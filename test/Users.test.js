const mongoose = require ('mongoose')
const User = require ('../src/dao/classes/user.dao.js')
const config = require ('../src/config/config.js');
const { assert } = require('chai');

// ENV
const PORT = config.port;
const mongoURLTesting = config.mongoURLTesting;

// Conectarse a Mongoose
mongoose.connect(mongoURLTesting);

describe("Testing Users Dao Methods", ()=>{
    before(function (){
        this.usersDao = new User()
    })
    it("Deberia recibir un arreglo con los usuarios de la BD", async function(){
        this.timeout(5000)
        try{
            const result = await this.usersDao.getUsers()
            assert.strictEqual(Array.isArray(result) && result.length > 0, true)
        }catch(error){
            console.log("Errror durante el test", error)
            assert.fail("Test con errores")
        }
    })
    it("El DAO debe agregar un usuario a la BD", async function(){
        let mockUser={
            first_name:"Usuario",
            last_name:"Prueba",
            email:"usuarioprueba@email.com",
            password:"123456"
        }
        const result = await this.usersDao.createUser(mockUser)
        assert.ok(result._id)
    })
    it("El DAO debe encontrar un usuario por el email", async function(){
        let mockUser={
            first_name:"Usuario",
            last_name:"Prueba",
            email:"usuarioprueba@email.com",
            password:"123456"
        }
        const result = await this.usersDao.createUser(mockUser)
        const user = await this.usersDao.getUserByEmail(result.email)
        assert.strictEqual(typeof user, 'object')
    })
}) 