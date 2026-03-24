const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ProdutoController = require('../controllers/ProdutoController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../../frontend/public/produtos'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = path.basename(file.originalname, ext)
      .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    cb(null, `${Date.now()}_${nome}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  }
});

// POST /api/produtos/upload — salva imagem e retorna o caminho
router.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  res.json({ path: `./public/produtos/${req.file.filename}` });
});

router.get('/caracteristica/:caracteristica', ProdutoController.listarPorCaracteristica);
router.get('/caracteristicas', ProdutoController.listarCaracteristicas);
router.get('/:id/caracteristicas', ProdutoController.listarCaracteristicasDoProduto);
router.get('/', ProdutoController.listarTodos);
router.post('/', ProdutoController.criar);
router.put('/:id', ProdutoController.atualizar);
router.delete('/:id', ProdutoController.deletar);

module.exports = router;