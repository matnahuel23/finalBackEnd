const { Router } = require ('express')
const { getUsers, 
        getUserByEmail, 
        getUserById, 
        createUser, 
        updateUser, 
        deleteUser, 
        uploadDocumentUser,
        upgradeUserToPremium } = require ('../controllers/users.controller.js')

const router = Router()

router.get("/", getUsers)
router.get("/search/:email", getUserByEmail)
router.get("/:uid", getUserById)
router.post("/", createUser)
router.put("/:uid", updateUser)
router.delete("/:uid", deleteUser)
// Nueva ruta para subir documentos
router.post("/:uid/documents", uploadDocumentUser)
// Nueva ruta para actualizar a usuario premium
router.put("/premium/:uid", upgradeUserToPremium);

module.exports = { router }