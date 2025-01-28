const express = require('express');
const router = express.Router();

const PedidosController = require('../controllers/pedido-controller');

router.get('/', PedidosController.getPedidos);
router.post('/', PedidosController.postPedidos);
router.get('/:id_pedido', PedidosController.getPedidosId);
router.delete('/', PedidosController.deletePedidos);

module.exports = router;