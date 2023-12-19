const express = require ("express")
const {restorePass } = require ('../controllers/users.controller.js')

const router = express.Router();

router.post('/restore', restorePass);