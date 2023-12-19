const Contenedor = require ('./fileSystem.js')
const fs = new Contenedor () 

module.exports =  class User {
    constructor() {
        this.data = []
    }
    
    getUsers = async () => {
        return fs.getAll()
    }

    getUserById = async (pid) => {
        return fs.getById(pid)
    }

    getUserByEmail = async (email) => {
        return fs.getByEmail(email)
    }

    createUser = async (user) => {
        fs(user)
    }

    updateUser = async (uid, user) => {
        fs.updateObject(uid, user)
    }

    deleteUser = async (uid) => {
        fs.deleteById(uid)
    }
}