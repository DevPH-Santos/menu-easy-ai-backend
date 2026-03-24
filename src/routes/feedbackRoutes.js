const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/feedback
// Body: { cpf, produtos: [id, ...] }
// Para cada produto pedido:
//   - se estava no log como recomendação (rec_aceita=0) → atualiza para 1
//   - se não estava → insere novo registro com rec_aceita=0 (pedido sem recomendação)
router.post('/', (req, res) => {
  const { cpf, produtos } = req.body;

  console.log('[feedback] cpf:', cpf, '| produtos:', produtos);

  if (!cpf || !produtos || produtos.length === 0) {
    return res.status(400).json({ erro: 'Informe cpf e produtos' });
  }

  const itensComId = produtos.filter(id => id);
  if (itensComId.length === 0) {
    return res.json({ mensagem: 'Nenhum produto com ID para atualizar' });
  }

  let pendentes = itensComId.length;

  itensComId.forEach(produtoId => {
    db.query(
      `UPDATE Recomendacao_Log
       SET rec_aceita = 1
       WHERE fk_cpf_usuario = ?
         AND fk_id_prod = ?
         AND rec_aceita = 0
         AND rec_data >= DATE_SUB(NOW(), INTERVAL 1 DAY)
       LIMIT 1`,
      [cpf, produtoId],
      (err, result) => {
        if (err) {
          console.error('[feedback] erro no UPDATE produto', produtoId, ':', err.message);
          pendentes--;
          if (pendentes === 0) res.json({ mensagem: 'Feedback salvo' });
          return;
        }

        console.log('[feedback] UPDATE produto', produtoId, '→ affectedRows:', result.affectedRows);

        if (result.affectedRows > 0) {
          // era recomendação aceita
          pendentes--;
          if (pendentes === 0) res.json({ mensagem: 'Feedback salvo' });
          return;
        }

        // não estava no log → insere como pedido sem recomendação
        db.query(
          `INSERT INTO Recomendacao_Log (rec_aceita, fk_cpf_usuario, fk_id_prod)
           VALUES (0, ?, ?)`,
          [cpf, produtoId],
          (err2) => {
            if (err2) console.error('[feedback] erro no INSERT produto', produtoId, ':', err2.message);
            else console.log('[feedback] INSERT rec_aceita=0 para produto', produtoId);
            pendentes--;
            if (pendentes === 0) res.json({ mensagem: 'Feedback salvo' });
          }
        );
      }
    );
  });
});

module.exports = router;