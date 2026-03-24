const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.cadastrar);
router.post('/login', usuarioController.login);
router.post('/preferencias', usuarioController.salvarPreferencias);
router.get('/:cpf/preferencias', usuarioController.checarPreferencias);

module.exports = router;