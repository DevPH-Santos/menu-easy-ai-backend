const express = require("express");
const router = express.Router();
const { verificarAdmin } = require("../middlewares/auth");

router.get("/me", verificarAdmin, (req, res) => {
  res.json({
    nome: req.usuario.id,
    cargo: "Administrador"
  });
});

module.exports = router;