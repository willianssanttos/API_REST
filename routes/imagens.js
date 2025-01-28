const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ImagensController = require('../controllers/imagens-controller');

router.delete('/:id_imagem', login.obrigatorio, ImagensController.deleteImagemProdutos);

module.exports = router;