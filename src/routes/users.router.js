const { Router } = require ('express')
const { 
        getUsers, 
        getUserByEmail, 
        getUserById, 
        createUser, 
        updateUser, 
        deleteUser, 
        uploadDocumentUser,
        upgradeUserToPremium,
        clearUsers 
} = require ('../controllers/users.controller.js')

const router = Router()

// Eliminar usuarios sin conexión en 2 días, sino lo ubico primero no me funciona
router.delete("/clear", clearUsers)
// Trae todos los usuarios
router.get("/", getUsers)
// Busca un usuario por mail
router.get("/search/:email", getUserByEmail)
// Busca un usuario por ID
router.get("/:uid", getUserById)
// Crea un usuario
router.post("/", createUser)
// Actualiza un usuario
router.put("/:uid", updateUser)
// Elimina un usuario por ID
router.delete("/:uid", deleteUser)
// Nueva ruta para subir documentos
router.post("/:uid/documents", uploadDocumentUser)
// Nueva ruta para actualizar a usuario premium
router.put("/premium/:uid", upgradeUserToPremium);

module.exports = { router }