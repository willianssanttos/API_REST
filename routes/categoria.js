const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const CategoriaController = require('../controllers/categoria-controller');

router.get('/', CategoriaController.getCategoria);
router.post('/', login.obrigatorio, CategoriaController.postCategoria);

module.exports = router;