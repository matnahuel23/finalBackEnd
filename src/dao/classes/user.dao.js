const userModel = require ("../models/user.model.js")

module.exports =  class User {
    getUsers = async () => {
        try {
            let users = await userModel.find()
            return users
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserById = async (id) => {
        try {
            let user = await userModel.findOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserByEmail = async (email) => {
        try {
            let user = await userModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1 , age: 1, cart: 1, password: 1, role: 1 });
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    createUser = async (user) => {
        try {
            let result = await userModel.create(user)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateUser = async (id, user) => {
        try {
            let result = await userModel.updateOne({ _id: id }, { $set: user })
            return result
        } catch (error) {
            return null
        }
    }

    deleteUser = async (id) => {
        try {
            let user = await userModel.deleteOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    findUsersToDelete = async (dateLogOut, dateLogIn) => {
        try {
            const usersToDelete = await userModel.find({
                $and: [
                    {
                        $or: [
                            { 'last_connection.logout': { $lt: dateLogOut }},
                            { 'last_connection.login': { $lt: dateLogIn } }
                        ]
                    },
                    { role: { $ne: 'admin' } } // No eliminar usuarios con rol 'admin'
            ]
        });
            return usersToDelete;
        } catch (error) {
            console.error(error);
            throw new Error('Error al buscar usuarios para eliminar');
        }
    }
    
    clearUsers = async (dateLogOut, dateLogIn) => {
        try {
            const result = await userModel.deleteMany({
                $or: [
                    { 'last_connection.logout': { $lt: dateLogOut } },
                    { 'last_connection.login': { $lt: dateLogIn } }
                ]
            });    
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Error al limpiar usuarios en el servicio');
        }
    };
    
}