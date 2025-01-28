const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const fs = require('fs');
const path = require('path');
const ProdutoController = require('../controllers/produto-controller');
const { route } = require('./usuarios');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, timestamp + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProdutoController.getProduto);
router.post('/', 
            login.obrigatorio, 
            upload.single('produto_imagem'), 
            ProdutoController.postProduto
);
router.get('/:id_produto', ProdutoController.getProdutoId);
router.patch('/', login.obrigatorio, ProdutoController.updateProduto);
router.delete('/', login.obrigatorio, ProdutoController.deleteProdutos);
router.post('/:id_produto/imagem', login.obrigatorio, 
            upload.single('produto_imagem'), ProdutoController.postImagemProduto
);
router.get('/:id_produto/imagens', ProdutoController.getImagensProduto);

module.exports = router;