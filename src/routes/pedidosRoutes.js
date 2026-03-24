const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/pedidos
// Body: { cpf, itens: [{ id, nome, preco, quantidade }], clima, pessoas, promocao }
router.post('/', (req, res) => {
  const { cpf, itens, clima = 'nublado', pessoas = 1, promocao = 0 } = req.body;

  if (!cpf || !itens || itens.length === 0) {
    return res.status(400).json({ erro: 'Informe cpf e itens do pedido' });
  }

  const agora = new Date();
  const hora = agora.toTimeString().slice(0, 8); // HH:MM:SS
  const data = agora.toISOString().slice(0, 10);  // YYYY-MM-DD

  // 1. Inserir pedido
  db.query(
    `INSERT INTO Pedidos (ped_hr, ped_data, ped_clima, ped_qtd_pessoas_mesa, ped_tem_promocao, fk_cpf_usuario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [hora, data, clima, pessoas, promocao, cpf],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar pedido' });

      const pedidoId = result.insertId;

      // 2. Inserir itens do pedido
      // Filtrar apenas itens com ID do banco
      const itensComId = itens.filter(i => i.id);
      if (itensComId.length === 0) {
        return res.status(201).json({ mensagem: 'Pedido salvo (sem itens vinculados ao banco)', pedido_id: pedidoId });
      }
      const values = itensComId.map(i => [i.quantidade, i.preco, pedidoId, i.id]);

      db.query(
        `INSERT INTO Itens_Pedido (quant_prod, preco_unitario, fk_id_ped, fk_id_prod) VALUES ?`,
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ erro: 'Pedido salvo mas erro nos itens' });
          res.status(201).json({ mensagem: 'Pedido salvo com sucesso', pedido_id: pedidoId });
        }
      );
    }
  );
});

module.exports = router;